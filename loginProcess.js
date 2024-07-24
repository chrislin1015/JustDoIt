const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')
const userData = require('./userData')
const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 20

function ValidateEmail(email) 
{
    const re = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z]{2,}$/
    return re.test(email)
}

function ValidatePassword(password)
{
    const regexLettersAndNumbers = /^[a-zA-z0-9]+$/
    const reqexUpcase = /[A-Z]/
    const reqexLowcase = /[a-z]/
    const reqexNumber = /[0-9]/

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) 
    {
        console.log("長度不正確");
        return false
    }

    if (!regexLettersAndNumbers.test(password))
    {
        console.log("regexLettersAndNumbers");
        return false
    }

    if (!reqexUpcase.test(password))
    {
        console.log("reqexUpcase");
        return false
    }

    if (!reqexLowcase.test(password))
    {
        console.log("reqexLowcase");
        return false
    }

    if (!reqexNumber.test(password))
    {
        console.log("reqexNumber");
        return false
    }

    return true
}

function SignIn(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    if (!ValidateEmail(json_data.email))
    {
        errorHandle(res, 'Email 格式錯誤')
        return;
    }

    if (!ValidatePassword(json_data.password))
    {
        errorHandle(res, 'Password 格式錯誤')
        return;
    }

    userData.signIn(json_data, res)
}

function SignUp(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined || json_data.name === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    if (!ValidateEmail(json_data.email))
    {
        errorHandle(res, 'Email 格式錯誤')
        return;
    }

    if (!ValidatePassword(json_data.password))
    {
        errorHandle(res, `Password 格式錯誤 : ${json_data.password}`)
        return;
    }

    userData.signUp(json_data, res)
}

module.exports = 
{
    signIn: SignIn,
    signUp: SignUp
}