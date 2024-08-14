
console.log('index.js is load')

const signin = document.querySelector('.signin')
const signup = document.querySelector('.signup')
const logout = document.querySelector('.log-out')

if (logout)
{
    logout.addEventListener("click", () => 
    {
        localStorage.removeItem('authToken')
        window.location.reload()
    })
}

window.onload = function() {
    console.log('index.html is load')
    const token = localStorage.getItem('authToken')
    
    if (token === undefined || token === null) {
        signin.classList.remove('hide')
        signup.classList.remove('hide')
        logout.classList.add('hide')
    }
    else{
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
    }
}