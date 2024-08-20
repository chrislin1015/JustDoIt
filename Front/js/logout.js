const logout = document.querySelector('.log-out')

if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    })
}