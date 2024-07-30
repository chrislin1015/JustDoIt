const responser = require('./responser')
const todosData = require('./todosData')

function Add(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.content === undefined)
    {
        responser.error(res, '資料錯誤')
        return;
    }

    todosData.add(json_data, res)
}

function Delete(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.id === undefined)
    {
        responser.error(res, '資料錯誤')
        return;
    }

    todosData.delete(json_data, res)
}

function Change(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.id === undefined || json_data.content === undefined)
    {
        responser.error(res, '資料錯誤')
        return
    }

    todosData.change(json_data, res)
}

function Done(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined || json_data.id === undefined || json_data.done === undefined)
    {
        responser.error(res, '資料錯誤')
        return
    }

    todosData.done(json_data, res)
}

function Fetch(json_data, res)
{
    if (json_data === undefined || json_data.email === undefined)
    {
        responser.error(res, '資料錯誤')
        return
    }

    todosData.fetch(json_data, res)
}

module.exports =
{
    add : Add,
    delete : Delete,
    change : Change,
    done : Done,
    fetch : Fetch
}