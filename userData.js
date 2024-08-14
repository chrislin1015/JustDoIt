const bcrypt = require('bcrypt')
const mysqlHelper = require('./mysqlHelper')
const helper = require('./helper')
const jwt = require('jsonwebtoken')
const common = require('./commonDefine')

//設定加密強度
const saltRounds = 10

function getJWT(json_data, res)
{
    const user = { email: json_data.email, name: json_data.name }
    const token = jwt.sign(user, common.SECRET_KEY, { expiresIn: '1h'})
    res.writeHead(200, common.header);
    res.end(JSON.stringify({ token }));
}

function ValidatePassword(json_data, res, nextStep)
{
    const query = 'SELECT * FROM users WHERE email = ?'
    if (mysqlHelper.connection() === undefined)
    {
        console.log('Connection is undefined')
        mysqlHelper.fail(res, 'Connection is undefined')
        return
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
                    json_data.name = user.name
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
            getJWT(json_data, res)
            mysqlHelper.close()
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
                        getJWT(json_data, res)
                        mysqlHelper.close()
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