const http = require('http')
const { v4: uuidv4 } = require('uuid')
const header = require('./commonDefine')
const successHandle = require('./successHandle')
const errorHandle = require('./errorHandle')
const loginProcess = require('./loginProcess')

let todos = []

function requestLinstener(req, res)
{
    console.log(req)
    successHandle(res, todos)

    let post_data = ""
    req.on('data', (chunk) =>{
        post_data += chunk
    })

    if (req.url === '/signin' && req.method === 'POST')
    {
        req.on('end', () => {
            let json_data = JSON.parse(post_data)
            loginProcess.signin(json_data, res)
        })
    }
    else if (req.url === '/signup' && req.method === 'POST')
    {
        req.on('end', () => {
            let json_data = JSON.parse(post_data)
            loginProcess.signup(json_data, res)
        })
    }
}

const server = http.createServer(requestLinstener).listen(process.env.PORT || 3005)