const bcrypt = require('bcrypt')
const mysqlHelper = require('./mysqlHelper');
const helper = require('./helper');

//設定加密強度
const saltRounds = 10

function ValidatePassword(json_data, res, nextStep)
{
    const query = 'SELECT * FROM users WHERE email = ?';
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
                mysqlHelper.fail(res, 'MySQL 連接失敗: ' + error.stack)
                throw error
            }

            if (results.length == 0)
            {
                mysqlHelper.fail(res, '帳號尚未註冊')
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
                    mysqlHelper.fail(res, '密碼錯誤')
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

            json_data.date = helper.createDate()

            bcrypt.hash(json_data.password, saltRounds, (error, hash) =>
            {
                if (error) 
                {
                    mysqlHelper.fail(res, '密碼加密失敗 : ' + error.stack)
                    throw error;
                }

                json_data.password = hash
                let insert = `INSERT INTO users SET ?`
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