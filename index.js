const http = require('http')
const { v4: uuidv4 } = require('uuid')
const header = require('./commonDefine')
const successHandle = require('./successHandle')
const errorHandle = require('./errorHandle')

let todos = []

function requestLinstener(req, res)
{

}

const server = http.createServer(requestLinstener).listen(process.env.PORT || 3005)