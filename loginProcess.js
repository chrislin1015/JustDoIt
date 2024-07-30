const responser = require('./responser')
const userData = require('./userData')
const helper = require('./helper')

function SignIn(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined)
    {
        responser.error(res, '資料錯誤')
        return;
    }

    if (!helper.validateEmail(json_data.email))
    {
        responser.error(res, 'Email 格式錯誤')
        return;
    }

    if (!helper.validatePassword(json_data.password))
    {
        responser.error(res, 'Password 格式錯誤')
        return;
    }

    userData.signIn(json_data, res)
}

function SignUp(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined || json_data.name === undefined)
    {
        responser.error(res, '資料錯誤')
        return;
    }

    if (!helper.validateEmail(json_data.email))
    {
        responser.error(res, 'Email 格式錯誤')
        return;
    }

    if (!helper.validatePassword(json_data.password))
    {
        responser.error(res, `Password 格式錯誤 : ${json_data.password}`)
        return;
    }

    userData.signUp(json_data, res)
}

module.exports = 
{
    signIn: SignIn,
    signUp: SignUp
}