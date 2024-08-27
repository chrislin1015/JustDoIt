const http = require('http')
const common = require('./commonDefine')
const responser = require('./responser')
const loginProcess = require('./loginProcess')
const todosProcess = require('./todosProcess')
const jwt = require('jsonwebtoken')
const url = require('url')

function ProcessPostData(method, res, post_data)
{
    try {
        let json_data = JSON.parse(post_data)
        console.log(json_data)
        method(json_data, res)
    } catch (error) {
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
                responser.error(res, 'Invalid Token')
            } else {
                if (method !== undefined) {
                        method(decoded, res)
                }
            }
        })
    } else {
        responser.error(res, 'No token provided')
    }
}

function RequestLinstener(req, res)
{
    let post_data = ""
    req.on('data', (chunk) => {
            post_data += chunk
        })

    console.log(req.method)
    console.log(req.url)

    if (req.method === 'OPTIONS') {
        console.log('options')
        res.writeHeader(200, common.header)
        res.end()
    } else if (req.url === '/todos' && req.method === 'GET') {
        req.on('end', () => {
            handleAuthorizationToken(req, res, todosProcess.fetch)
        })
    } else if (req.url === '/signin' && req.method === 'POST') {
        console.log("siginin")
        req.on('end', () => {
            ProcessPostData(loginProcess.signIn, res, post_data)
        })
    } else if (req.url === '/signup' && req.method === 'POST') {
        req.on('end', () => {
            console.log('signup')
            ProcessPostData(loginProcess.signUp, res, post_data)
        })
    } else if (req.url === '/add' && req.method === 'POST') {
        req.on('end', () => {
            const auth = req.headers['authorization']
            if (auth) {
                //auth => "Bearer your_jwt"
                const token = auth.split(' ')[1]
                jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
                    if (error) {
                        responser.error(res, "Invalid Token")
                    } else {
                        try {
                            let json_data = JSON.parse(post_data)
                            json_data.email = decoded.email
                            todosProcess.add(json_data, res)
                        } catch (error) {
                            responser.error(res, error)
                        }
                    }
                })
            } else {
                responser.error(res, 'No token provided')
            }

            // console.log('add')
            // const email = handleAuthorizationToken(req, res)
            // console.log(`email is ${email}`)
            // if (email === undefined || email === null) {
            //     responser.error(res, `email is ${email}`)
            //     return
            // }

            // try
            // {
            //     let json_data = JSON.parse(post_data)
            //     json_data.email = email
            //     console.log(json_data)
            //     todosProcess.add(json_data, res)
            // }
            // catch (error)
            // {
            //     console.log(error)
            //     responser.error(res, error)
            // }
            //ProcessPostData(todosProcess.add, res, post_data)
        })
    } else if (req.url.startsWith('/delete') && req.method === 'DELETE') {
        console.log('delete')
        req.on('end', () => {
            console.log(req.headers)
            const auth = req.headers['authorization']
            if (auth) {
                const queryObject = url.parse(req.url, true).query
                const id = queryObject.id;
                if (id) {
                    const token = auth.split(' ')[1]
                    jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
                        console.log('jwt verify')
                        if (error) {
                            responser.error(res, 'Invalid Token')
                        } else {
                            try {
                                const json_data = {
                                    email: decoded.email,
                                    id: id
                                }
                                todosProcess.delete(json_data, res)
                                console.log('process done')
                            } catch (error) {
                                console.log('process error')
                                responser.error(res, error)
                            }
                        }
                    })
                } else {
                    responser.error(res, 'No todo it provided')
                }
                
            } else {
                console.log('No token provided')
                responser.error(res, 'No token provided')
            }
            //ProcessPostData(todosProcess.delete, res, post_data)
        })
    } else if (req.url === '/change' && req.method === 'PATCH') {
        req.on('end', () => {
            ProcessPostData(todosProcess.change, res, post_data)            
        })
    } else if (req.url === '/done' && req.method === 'PATCH') {
        req.on('end', () => {
            console.log(req.headers)
            const auth = req.headers['authorization']
            if (auth) {
                const token = auth.split(' ')[1]
                jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
                    if (error) {
                        responser.error(res, "Invalid Token")
                    } else {
                        try {
                            let json_data = JSON.parse(post_data)
                            json_data.email = decoded.email
                            todosProcess.done(json_data, res)
                        } catch (error) {
                            responser.error(res, error)
                        }
                    }
                })
            } else {
                responser.error(res, 'No token provided')
            }
        })
    }
}

const server = http.createServer(RequestLinstener).listen(process.env.PORT || 3005)