const errorHandle = require('./errorHandle')

function validateEmail(email) 
{
    const re = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z]{2,}$/
    return re.test(email)
}

function validatePassword(password)
{
    const regexLettersAndNumbers = /^[a-zA-z0-9]+&/
    const reqexUpcase = /[A-Z]/
    const reqexLowcase = /[a-z]/
    const reqexNumber = /[0-9]/

    if (!regexLettersAndNumbers.test(password)) return false
    if (!reqexUpcase.test(password)) return false
    if (!reqexLowcase.test(password)) return false
    if (!reqexNumber.test(password)) return false

    return true
}

function signIn(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    if (!validateEmail(json_data.email))
    {
        errorHandle(res, 'Email 格式錯誤')
        return;
    }

    if (!validateEmail(json_data.password))
    {
        errorHandle(res, 'Password 格式錯誤')
        return;
    }
}

function signUp(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.password === undefined || json_data.name === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    if (!validateEmail(json_data.email))
    {
        errorHandle(res, 'Email 格式錯誤')
        return;
    }

    if (!validateEmail(json_data.password))
    {
        errorHandle(res, 'Password 格式錯誤')
        return;
    }
}

module.exports = 
{
    signin: signIn,
    signup: signUp
}