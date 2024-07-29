const mysqlHelper = require('./mysqlHelper')
const { v4: uuidv4 } = require('uuid')
const helper = require('./helper')
const errorHandle = require('./errorHandle')

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

            let todoData = 
            {
                id: uuidv4(),
                content: json_data.content,
                email: json_data.email,
                date: helper.createDate(),
                done: 0
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
                })
        })
    })
}

function Delete(json_data, res)
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

            let query = `DELETE FROM todos WHERE email = ? AND id = ?`
            mysqlHelper.connection().query(
                query,
                [json_data.email, json_data.id],
                function(error, results, field)
                {
                    if (error)
                    {
                        errorHandle(res, error)
                        return
                    }
                    mysqlHelper.todos(json_data.email, res)
                }
            )
        })
    })
}

function Change(json_data, res)
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

            let query = `UPDATE todos SET content = ? WHERE email = ? AND id = ?`
            mysqlHelper.connection().query(
                query,
                [json_data.content, json_data.email, json_data.id],
                function(error, results, field)
                {
                    if (error)
                    {
                        errorHandle(res, error)
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
    delete: Delete,
    change: Change
}