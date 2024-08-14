const http = require('http')
const common = require('./commonDefine')
const responser = require('./responser')
const loginProcess = require('./loginProcess')
const todosProcess = require('./todosProcess')
const jwt = require('jsonwebtoken')
const { error } = require('console')

function ProcessPostData(method, res, post_data)
{
    try
    {
        let json_data = JSON.parse(post_data)
        console.log(json_data)
        method(json_data, res)
    }
    catch (error)
    {
        console.log(error)
        responser.error(res, error)
    }
}

function handleAuthorizationToken(req, res, method)
{
    const auth = req.headers['authorization']
    if (auth)
    {
        //auth => "Bearer your_jwt"
        const token = auth.split(' ')[1]
        jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
            if (error) {
                res.statusCode = 403
                res.end('Invalid Token')
            }
            else {
                method(decoded, res)
            }
        })
    }
    else {
        res.statusCode = 403
        res.end('No token provided')
    }
}

function RequestLinstener(req, res)
{
    let post_data = ""
    req.on('data', (chunk) =>
        {
            post_data += chunk
        })

    if (req.method === 'OPTIONS')
    {
        console.log('options')
        res.writeHeader(200, common.header)
        res.end()
    }
    else if (req.url === '/todos' && req.method === 'GET')
    {
        req.on('end', () => 
        {
            handleAuthorizationToken(req, res, todosProcess.fetch)
        })
    }
    else if (req.url === '/signin' && req.method === 'POST')
    {
        console.log("siginin")
        req.on('end', () => 
        {
            ProcessPostData(loginProcess.signIn, res, post_data)
        })
    }
    else if (req.url === '/signup' && req.method === 'POST')
    {
        req.on('end', () => 
        {
            console.log('signup')
            ProcessPostData(loginProcess.signUp, res, post_data)
        })
    }
    else if (req.url === '/add' && req.method === 'POST')
    {
        req.on('end', () => 
        {
            ProcessPostData(todosProcess.add, res, post_data)
        })
    }
    else if (req.url === '/delete' && req.method === 'DELETE')
    {
        req.on('end', () =>
        {
            ProcessPostData(todosProcess.delete, res, post_data)
        })
    }
    else if (req.url === '/change' && req.method === 'PATCH')
    {
        req.on('end', () =>
        {
            ProcessPostData(todosProcess.change, res, post_data)            
        })
    }
    else if (req.url === '/done' && req.method === 'PATCH')
    {
        req.on('end', () =>
        {
            ProcessPostData(todosProcess.done, res, post_data)
        })
    }
}

const server = http.createServer(RequestLinstener).listen(process.env.PORT || 3005)