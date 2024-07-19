const header = require('./commonDefine')

function errorHandle(res, message)
{
    res.writeHead(400, header);
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

module.exports = errorHandle