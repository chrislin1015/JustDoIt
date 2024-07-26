const bcrypt = require('bcrypt')
const mysqlHelper = require('./mysqlHelper')

//設定加密強度
const saltRounds = 10

function ValidatePassword(json_data, res, nextStep)
{
    const query = 'SELECT * FROM user_data WHERE email = ?';
    if (mysqlHelper.connection() === undefined)
    {
        console.log('Connection is undefined')
        mysqlHelper.fail(res, 'Connection is undefined')
        return;
    }
    mysqlHelper.connection().query(
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
    mysqlHelper.connect(json_data, res, (json_data, res) =>
    {
        ValidatePassword(json_data, res, (json_data, res) =>
        {
            mysqlHelper.success(res, "登入成功")
        })
    })
}

function SignUp(json_data, res)
{
    mysqlHelper.connect(json_data, res, (json_data, res) =>
    {
        mysqlHelper.isAccountExist(json_data, res, (json_data, res, count) =>
        {
            if (count > 0)
            {
                mysqlHelper.fail(res, `Email ${json_data.email} 已經存在。`)
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
                mysqlHelper.connection().query(
                    insert,
                    json_data,
                    function(error, results, field)
                    {
                        if (error)
                        {
                            mysqlHelper.fail(res, 'MySQL 新增資料失敗: ' + error.stack)
                            throw error
                        }
                        mysqlHelper.success(res, "MySQL 新增資料成功")
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