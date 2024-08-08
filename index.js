const http = require('http')
const header = require('./commonDefine')
const responser = require('./responser')
const loginProcess = require('./loginProcess')
const todosProcess = require('./todosProcess')

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

function RequestLinstener(req, res)
{
    let post_data = ""
    req.on('data', (chunk) =>
        {
            post_data += chunk
        })

    console.log(req.url)
    console.log(req.method)

    if (req.method === 'OPTIONS')
    {
        res.writeHeader(200, header)
        res.end()
    }
    else if (req.url === '/todos' && req.method === 'GET')
    {
        req.on('end', () => 
        {
            ProcessPostData(todosProcess.fetch, res, post_data)
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