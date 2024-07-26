const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')

let connection = undefined
//設定加密強度
const saltRounds = 10

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
                Fail(res, 'MySQL 連接失敗: ' + error.stack)
                throw error
            }

            if (results.length == 0)
            {
                Fail(res, '帳號尚未註冊')
                return
            }

            const user = results[0]
            bcrypt.compare(json_data.password, user.password, (error, isMatch) =>
            {
                if (error) throw error
                if (isMatch)
                {
                    nextStep(json_data, res)
                }
                else
                {
                    Fail(res, '密碼錯誤')
                }
            })
        })
}

function SignIn(json_data, res)
{
    ConnectToMySQL(json_data, res, (json_data, res) =>
    {
        ValidatePassword(json_data, res, (json_data, res) =>
        {
            Success(res, "登入成功")
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
                Fail(res, `Email ${json_data.email} 已經存在。`)
                return
            }

            let date = new Date()
            let year = date.getFullYear()
            // javascript 中 Date 物件的 getMonth 函式回傳的是 0 開始的索引值 0~11 
            let month = date.getMonth() + 1
            // getDay 回傳的是星期幾，getDate 回傳的才是日期
            let day = date.getDate()
            let create_date = `${year}-${month}-${day}`
            json_data.create_date = create_date

            bcrypt.hash(json_data.password, saltRounds, (error, hash) =>
            {
                if (error) 
                {
                    Fail(res, '密碼加密失敗 : ' + error.stack)
                    throw error;
                }

                json_data.password = hash
                let insert = `INSERT INTO user_data SET ?`
                connection.query(
                    insert,
                    json_data,
                    function(error, results, field)
                    {
                        if (error)
                        {
                            Fail(res, 'MySQL 新增資料失敗: ' + error.stack)
                            throw error
                        }
                        Success(res, "MySQL 新增資料成功")
                    }
                )
            })
        })
    })   
}

module.exports = 
{
    signIn: SignIn,
    signUp: SignUp
}