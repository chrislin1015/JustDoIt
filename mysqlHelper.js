const mysql = require('mysql2')
const responser = require('./responser')

let connection = undefined

function GetConnection()
{
    return connection
}

function Fail(res, message)
{
    responser.error(res, message)
    connection.end()
    connection = undefined
}

function Success(res, message)
{
    responser.success(res, message)
    connection.end()
    connection = undefined
}

function Connect(json_data, res, nextStep)
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

            nextStep(json_data, res)
        })
}

function IsSignUp(json_data, res, nextStep)
{
    //判斷是否已經註冊過
    let checkExist = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
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

            nextStep(json_data, res, results[0].count)
        })
}

function Todos(email, res)
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
                Success(res, todosData)
        })
}

function Close()
{
    connection.end()
    connection = undefined
}

module.exports = 
{
    connect: Connect,
    isAccountExist: IsSignUp,
    fail: Fail,
    success: Success,
    connection: GetConnection,
    todos: Todos,
    close: Close
}