const todolist = []

function compareDate(date1, date2)
{
    const dateOne = new Date(date1)
    const yearOne = dateOne.getFullYear()
    const monthOne = dateOne.getMonth() + 1
    const dayOne = dateOne.getDate()
    
    const dateTwo = new Date(date2)
    const yearTwo = dateTwo.getFullYear()
    const monthTwo = dateTwo.getMonth() + 1
    const dayTwo = dateTwo.getDate()

    if (yearOne < yearTwo || monthOne < monthTwo || dayOne < dayTwo) {
        return true
    }
    return false
}

function clearTodolist() {
    todolist.length = 0
}

function addTodolist(todo) {
    const todoData = {
        id: todo.id,
        date: todo.date,
        done: todo.done,
        content: todo.content
    }

    if (todolist.length !== 0){
        if (compareDate(todolist[0].date, todoData.date)) {
            console.log('unshift')
            todolist.unshift(todoData)
        } else {
            todolist.push(todoData)
        }
    } else {
        todolist.push(todoData)
    }
}

function getTodolist() {
    return todolist
}

