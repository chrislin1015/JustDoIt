const mysql = require('mysql2')
const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')

let connection = undefined

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
                errorHandle(res, 'MySQL 連接失敗: ' + error.stack)
                console.error('MySQL 連接失敗: ' + error.stack)
                connection.end()
                connection = undefined
                throw error
            }

            if (nextStep === undefined) 
            {
                connection.end()
                connection = undefined
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
                errorHandle(res, 'MySQL 連接失敗: ' + error.stack)
                console.error('MySQL 連接失敗: ' + error.stack)
                connection.end()
                connection = undefined
                throw error
            }

            if (nextStep === undefined) 
            {
                connection.end()
                connection = undefined
                return
            }

            const count = results[0].count
            nextStep(json_data, res, count)
        })
}

function ValidatePassword(json_data, res, nextStep)
{
    const query = 'SELECT * FROM user_data WHERE email = ?';
    connection.query(
        query,
        [json_data.email],
        function(error, results, field)
        {
            if (error) 
            {
                errorHandle(res, 'MySQL 連接失敗: ' + error.stack)
                connection.end()
                connection = undefined
                throw error
            }

            if (results.length == 0)
            {
                errorHandle(res, '帳號尚未註冊')
                connection.end()
                connection = undefined
                return
            }

            const user = results[0]
            if (user.password === json_data.password)
            {
                nextStep(json_data, res)
            }
            else
            {
                errorHandle(res, '密碼錯誤')
                connection.end()
                connection = undefined
            }
        })
}

function SignIn(json_data, res)
{
    ConnectToMySQL(json_data, res, (json_data, res) =>
    {
        ValidatePassword(json_data, res, (json_data, res) =>
        {
            successHandle(res, "登入成功")
            connection.end()
            connection = undefined
        })
    })
}

function SignUp(json_data, res)
{
    ConnectToMySQL(json_data, res, (json_data, res) =>
    {
        IsAccountExist(json_data, res, (json_data, res, count) =>
        {
            if (count > 0)
            {
                errorHandle(res,  `Email ${json_data.email} 已經存在。`)
                connection.end()
                connection = undefined
                return
            }

            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth()
            let day = date.getDay()
            let create_date = `${year}-${month}-${day}`
            json_data.create_date = create_date

            let insert = `INSERT INTO user_data SET ?`
            connection.query(
                insert,
                json_data,
                function(error, results, field)
                {
                    if (error)
                    {
                        errorHandle(res, 'MySQL 新增資料失敗: ' + error.stack)
                        console.error('MySQL 新增資料失敗: ' + error.stack)
                        connection.end()
                        connection = undefined
                        throw error
                    }

                    successHandle(res, "MySQL 新增資料成功")
                    connection.end()
                    connection = undefined
                }
            )
        })
    })   
}

module.exports = 
{
    signIn: SignIn,
    signUp: SignUp
}