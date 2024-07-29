const errorHandle = require('./errorHandle')
const todosData = require('./todosData')

function Add(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.content === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    todosData.add(json_data, res)
}

function Delete(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.id === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    todosData.delete(json_data, res)
}

function Change(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.id === undefined || json_data.content === undefined)
    {
        errorHandle(res, '資料錯誤')
        return
    }

    todosData.change(json_data, res)
}

module.exports =
{
    add : Add,
    delete : Delete,
    change : Change,
}