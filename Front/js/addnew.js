const addnew = document.querySelector('.addnew')

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