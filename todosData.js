const mysqlHelper = require('./mysqlHelper')
const { v4: uuidv4 } = require('uuid')
const helper = require('./helper')

function Add(json_data, res)
{
    mysqlHelper.connect(json_data, res, (json_data, res) => 
    {
        mysqlHelper.isAccountExist(json_data, res, (json_data, res, count) =>
        {
            if (count == 0)
            {
                mysqlHelper.fail(res, "帳號尚未註冊")
                return
            }

            let todoData = {
                uid: uuidv4(),
                contend: json_data.todo,
                email: json_data.email,
                date: helper.createDate()
            }
            let query = `INSERT INTO todos SET ?`
            mysqlHelper.connection().query(
                query,
                todoData,
                function(error, results, field)
                {
                    if (error)
                    {
                        mysqlHelper.fail(res, error)
                        return
                    }
                    mysqlHelper.todos(json_data.email, res)
                }
            )
        })
    })
}

module.exports = {
    add: Add,
}