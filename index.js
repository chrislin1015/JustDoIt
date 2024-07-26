const http = require('http')
const errorHandle = require('./errorHandle')
const loginProcess = require('./loginProcess')
const todosProcess = require('./todosProcess')

let todos = []

function RequestLinstener(req, res)
{
    let post_data = ""
    req.on('data', (chunk) =>{
        post_data += chunk
    })

    if (req.url === '/todos' && req.method === 'GET')
    {

    }
    else if (req.url === '/signin' && req.method === 'POST')
    {
        req.on('end', () => {
            try
            {
                let json_data = JSON.parse(post_data)
                loginProcess.signIn(json_data, res)
            }
            catch (error)
            {
                console.log(error)
                errorHandle(res, error)
            }
        })
    }
    else if (req.url === '/signup' && req.method === 'POST')
    {
        req.on('end', () => {
            try
            {
                let json_data = JSON.parse(post_data)
                loginProcess.signUp(json_data, res)
            }
            catch (error)
            {
                errorHandle(res, error)
            }
        })
    }
    else if (req.url === '/add' && req.method === 'POST')
    {
        req.on('end', () => 
        {
            try
            {
                let json_data = JSON.parse(post_data)
                todosProcess.add(json_data, res)
            }
            catch (error)
            {
                errorHandle(res, error)
            }
        })
    }
}

const server = http.createServer(RequestLinstener).listen(process.env.PORT || 3005)