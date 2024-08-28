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
        method(json_data, res)
    } catch (error) {
        responser.error(res, error)
    }
}

function handleAuthorizationToken(req, res, method, json_data)
{
    const auth = req.headers['authorization']
    if (auth)
    {
        //auth => "Bearer your_jwt"
        const token = auth.split(' ')[1]
        jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
            if (error) {
                responser.error(res, 'Invalid Token')
                return
            }
            
            if (method === undefined || json_data === undefined) {
                console.log('not method callback or json_data inupt')
            }

            json_data.email = decoded.email
            method(json_data, res)
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

    if (req.method === 'OPTIONS') {
        res.writeHeader(200, common.header)
        res.end()
    } else if (req.url === '/todos' && req.method === 'GET') {
        req.on('end', () => {
            const json_data = {}
            handleAuthorizationToken(req, res, todosProcess.fetch, json_data)
        })
    } else if (req.url === '/signin' && req.method === 'POST') {
        req.on('end', () => {
            ProcessPostData(loginProcess.signIn, res, post_data)
        })
    } else if (req.url === '/signup' && req.method === 'POST') {
        req.on('end', () => {
            ProcessPostData(loginProcess.signUp, res, post_data)
        })
    } else if (req.url === '/add' && req.method === 'POST') {
        req.on('end', () => {
            try {
                const json_data = JSON.parse(post_data)
                handleAuthorizationToken(req, res, todosProcess.add, json_data)
            } catch (error) {
                responser.error(res, error)
            }

            // const auth = req.headers['authorization']
            // if (auth) {
            //     //auth => "Bearer your_jwt"
            //     const token = auth.split(' ')[1]
            //     jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
            //         if (error) {
            //             responser.error(res, "Invalid Token")
            //         } else {
            //             try {
            //                 let json_data = JSON.parse(post_data)
            //                 json_data.email = decoded.email
            //                 todosProcess.add(json_data, res)
            //             } catch (error) {
            //                 responser.error(res, error)
            //             }
            //         }
            //     })
            // } else {
            //     responser.error(res, 'No token provided')
            // }
        })
    } else if (req.url.startsWith('/delete') && req.method === 'DELETE') {
        req.on('end', () => {
            try {
                const queryObject = url.parse(req.url, true).query
                const id = queryObject.id;
                const json_data = {
                    id: id
                }
                handleAuthorizationToken(req, res, todosProcess.delete, json_data)
            } catch (error) {
                responser.error(res, error)
            }
 
            // const auth = req.headers['authorization']
            // if (auth) {
            //     const queryObject = url.parse(req.url, true).query
            //     const id = queryObject.id;
            //     if (id) {
            //         const token = auth.split(' ')[1]
            //         jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
            //             if (error) {
            //                 responser.error(res, 'Invalid Token')
            //             } else {
            //                 try {
            //                     const json_data = {
            //                         email: decoded.email,
            //                         id: id
            //                     }
            //                     todosProcess.delete(json_data, res)
            //                 } catch (error) {
            //                     responser.error(res, error)
            //                 }
            //             }
            //         })
            //     } else {
            //         responser.error(res, 'No todo it provided')
            //     }
                
            // } else {
            //     responser.error(res, 'No token provided')
            // }
        })
    } else if (req.url === '/change' && req.method === 'PATCH') {
        req.on('end', () => {
            ProcessPostData(todosProcess.change, res, post_data)            
        })
    } else if (req.url === '/done' && req.method === 'PATCH') {
        req.on('end', () => {
            try {
                let json_data = JSON.parse(post_data)
                handleAuthorizationToken(req, res, todosProcess.done, json_data)
            } catch (error) {
                responser.error(res, error)
            }

            // const auth = req.headers['authorization']
            // if (auth) {
            //     const token = auth.split(' ')[1]
            //     jwt.verify(token, common.SECRET_KEY, (error, decoded) => {
            //         if (error) {
            //             responser.error(res, "Invalid Token")
            //         } else {
            //             try {
            //                 let json_data = JSON.parse(post_data)
            //                 json_data.email = decoded.email
            //                 todosProcess.done(json_data, res)
            //             } catch (error) {
            //                 responser.error(res, error)
            //             }
            //         }
            //     })
            // } else {
            //     responser.error(res, 'No token provided')
            // }
        })
    }
}

const server = http.createServer(RequestLinstener).listen(process.env.PORT || 3005)