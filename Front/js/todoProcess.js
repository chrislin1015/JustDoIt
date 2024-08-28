function done(event) {
    const token = localStorage.getItem('authToken')
    if (token === null || token === undefined) return

    const todoId = event.target.parentNode.getAttribute('data-id')
    axios.patch('http://localhost:3005/done', 
        {
            'id': todoId,
            'done': event.target.checked
        },
        {
            headers: getHeaders()
        }).then (response => {
            const content = event.target.parentNode.querySelector('.content-in-cell')
            if (event.target.checked)
                content.classList.add('done')
            else
                content.classList.remove('done')
            console.log(`${todoId} was set done`);
        }).catch (error => {
            console.log(`${todoId} set done was failed`);
        })
}

function del(event) {
    const token = localStorage.getItem('authToken')
    if (token === null || token === undefined) return

    const todoId = event.target.parentNode.getAttribute('data-id')
    axios.delete('http://localhost:3005/delete', 
        {
            params: {
                'id': todoId
            },
            headers: getHeaders()
        }).then (response => {
            window.location.reload()
            console.log(`${todoId} was deleted`);
        }).catch (error => {
            console.log(`delete ${todoId} was failed`);
        })
}