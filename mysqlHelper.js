const mysql = require('mysql2')
const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')

let connection = undefined

function GetConnection()
{
    return connection
}

function Fail(res, message)
{
    errorHandle(res, message)
    connection.end()
    connection = undefined
}

function Success(res, message)
{
    successHandle(res, message)
    connection.end()
    connection = undefined
}

function ConnectToMySQL(json_data, res, nextStep)
{
    connection = mysql.createConnection(
        {
            host: 'localHost',
            user: 'root',
            password: 'Anfernee0224',
            database: 'just_do_it'
        })

    connection.connect((error) => 
        {
            if (error) 
            {
                Fail(res, 'MySQL 連接失敗: ' + error.stack)
                throw error
            }

            if (nextStep === undefined) 
            {
                Fail(res, 'nextSetp 沒有設定')
                return
            }
            nextStep(json_data, res)
        })
}

function IsAccountExist(json_data, res, nextStep)
{
    //判斷是否已經註冊過
    let checkExist = `SELECT COUNT(*) AS count FROM user_data WHERE email = ?`;
    connection.query(
        checkExist, 
        [json_data.email], 
        function(error, results, field)
        {
            if (error) 
            {
                Fail(res, 'MySQL 連接失敗: ' + error.stack)
                throw error
            }

            if (nextStep === undefined) 
            {
                Fail(res, 'nextSetp 沒有設定')
                return
            }

            const count = results[0].count
            nextStep(json_data, res, count)
        })
}

function FetchTodos(email, res)
{
    let query = `SELECT * FROM todos WHERE email = ?`;
    connection.query(
        query, 
        [email], 
        function(error, results, field)
        {
            if (error) 
            {
                Fail(res, 'MySQL 連接失敗: ' + error.stack)
                throw error
            }
            console.log(results)
            let todosData = []
            results.forEach(element => 
                {
                    let data = 
                    {
                        id: element.id,
                        content: element.content,
                        date: element.date,
                        done: element.done
                    }
                    todosData.push(data)
                });
            successHandle(res, todosData)
        })
}

module.exports = 
{
    connect: ConnectToMySQL,
    isAccountExist: IsAccountExist,
    fail: Fail,
    success: Success,
    connection: GetConnection,
    todos: FetchTodos,
}