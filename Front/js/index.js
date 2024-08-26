console.log('index.js is load')

const signin = document.querySelector('.signin')
const signup = document.querySelector('.signup')
const todocell = document.querySelector('.todo-cell')

function sqlDateToYearMonthDay(sqlDate) {
    const dateObject = new Date(sqlDate);
    const year = dateObject.getFullYear(); // 2024
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // 08 (月份從 0 開始，所以要 +1)
    const day = dateObject.getDate().toString().padStart(2, '0'); // 10
    const datePart = `${year}-${month}-${day}`;
    return datePart
}

function done(event) {
    const token = localStorage.getItem('authToken')
    if (token === null || token === undefined) return

    const todoid = event.target.parentNode.getAttribute('data-id')
    console.log(event.target.checked)
    axios.patch('http://localhost:3005/done', 
        {
            'id': todoid,
            'done': event.target.checked
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }   
        }).then (response => {
            const content = event.target.parentNode.querySelector('.content-in-cell')
            if (event.target.checked)
                content.classList.add('done')
            else
                content.classList.remove('done')
            console.log('成功修改 done :', response.data);
        }).catch (error => {
            console.log('修改 done 失敗:', error);
        })
}

function generateTodo(todo) {
    // clone 整個 todo DOM 元件
    const clone = todocell.cloneNode(true)
    todocell.parentNode.appendChild(clone)//insertBefore(clone, todocell.parentNode.firstChild);
    clone.classList.remove('hide')
    // 設定 date-id 屬性為 id
    clone.setAttribute('data-id', todo.id)

    // 初始化設定各種子元素
    const contentInCell = clone.querySelector('.content-in-cell')
    contentInCell.innerText = todo.content
    const dateInCell = clone.querySelector('.date-in-cell')
    dateInCell.innerText = sqlDateToYearMonthDay(todo.date)
    const checkboxInCell = clone.querySelector('.checkbox-in-cell')
    checkboxInCell.checked = todo.done

    // 註冊 done call back
    checkboxInCell.addEventListener('click', done)
}

window.onload = function() {
    console.log('index.html is load')
    const token = localStorage.getItem('authToken')
    if (token !== undefined && token !== null) {
        signin.classList.add('hide')
        signup.classList.add('hide')
        logout.classList.remove('hide')
        
        axios.get('http://localhost:3005/todos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('取得 todo 清單:', response.data.Data);
            clearTodolist()
            response.data.Data.forEach(element => {
                addTodolist(element)
            });
            const gettodo = getTodolist()
            console.log(`details: ${JSON.stringify(gettodo, null, 2)}`);
            gettodo.forEach(element => {
                generateTodo(element)
            });
        })
        .catch(error => {
            console.error('無法取得 todo 清單', error.response.data.message);
        });
    } else {
        signin.classList.remove('hide')
        signup.classList.remove('hide')
        logout.classList.add('hide')  
    }
}