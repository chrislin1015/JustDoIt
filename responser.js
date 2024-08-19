const common = require('./commonDefine')

function errorHandle(res, message)
{
    res.writeHead(400, common.header);
    res.write
    (
        JSON.stringify
        (
            {
                'Status': 'Fail',
                'Message': message
            }
        )
    )
    res.end()
}

function successHandle(res, todos)
{
    res.writeHeader(200, common.header)
    res.write
    (
        JSON.stringify
        (
            {
                'Status': 'Success',
                'Data': todos
            }
        )
    )
    res.end()
}

module.exports = 
{
    error: errorHandle,
    success: successHandle
}