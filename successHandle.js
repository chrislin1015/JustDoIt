const header = require('./commonDefine')

function successHandle(res, todos)
{
    res.writeHeader(200, header)
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

module.exports = successHandle