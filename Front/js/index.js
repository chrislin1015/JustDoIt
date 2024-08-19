console.log('index.js is load')

const signin = document.querySelector('.signin')
const signup = document.querySelector('.signup')
const logout = document.querySelector('.log-out')
const addnew = document.querySelector('.addnew')

// function isSignIn() {
//     const token = localStorage.getItem('authToken')
//     if (token === undefined || token === null)
//         return false
//     return true
// }

if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    })
}

if (addnew) {
    addnew.addEventListener('click', () => {
        const token = localStorage.getItem('authToken')
        if (token === undefined || token === null) return
        const todoContext = document.querySelector('.todo-context')
        if (todoContext.value.trim() === '') return

        axios.post('http://localhost:3005/add', 
            {
                "content": todoContext.value
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then (response => {
                console.log('成功新增todo項目:', response.data);
            }).catch (error => {
                console.error('無法新增todo項目', error.response.data.message);
            })
    })
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
            console.log('受保護的資源:', response.data);
        })
        .catch(error => {
            console.error('無法取得受保護的資源', error.response.data.message);
        });
    } else {
        signin.classList.remove('hide')
        signup.classList.remove('hide')
        logout.classList.add('hide')  
    }
}