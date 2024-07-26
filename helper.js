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

function CreateDate()
{
    let date = new Date()
    let year = date.getFullYear()
    // javascript 中 Date 物件的 getMonth 函式回傳的是 0 開始的索引值 0~11 
    let month = date.getMonth() + 1
    // getDay 回傳的是星期幾，getDate 回傳的才是日期
    let day = date.getDate()
    let create_date = `${year}-${month}-${day}`
    return create_date
}

module.exports = 
{
    validateEmail: ValidateEmail,
    validatePassword: ValidatePassword,
    createDate: CreateDate,
}