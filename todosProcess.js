const errorHandle = require('./errorHandle')
const todosData = require('./todosData')

function Add(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.todo === undefined)
    {
        errorHandle(res, '資料錯誤')
        return;
    }

    todosData.add(json_data, res)
}

function Delete(json_data, res)
{
    
}

module.exports =
{
    add : Add,
    delete : Delete
}