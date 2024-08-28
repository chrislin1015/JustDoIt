const submit = document.querySelector(".submit-circle")
if (submit !== undefined)
{
    submit.addEventListener("click", () =>
    {
        const inputName = document.querySelector(".input-name")
        const inputUserName = document.querySelector(".input-username")
        const inputPassword = document.querySelector(".input-password")
        const inputConfirmPassword = document.querySelector('.confirm-password')
        const errorMessage = document.querySelector('.error-message')
        errorMessage.classList.add('hide')

        if (inputPassword.value !== inputConfirmPassword.value)
        {
            errorMessage.classList.remove('hide')
            errorMessage.textContent = "Confirm password failed"
            return
        }

        axios.post('http://127.0.0.1:3005/signup',
            {
                "email": inputUserName.value,
                "password": inputPassword.value,
                "name": inputName.value   
            },
            {
                headers: getHeaders()
            }).then (response => {
                const token = response.data.token
                localStorage.setItem('authToken', token)
                console.log('註冊成功:', token)
                window.location.href = './index.html'
            }).catch (error => {
                if (errorMessage !== undefined) {
                    errorMessage.classList.remove('hide')
                    errorMessage.textContent = error
                }
                console.error('註冊失敗:', error);
            })

        console.log(`name : ${inputName.value}} | user name : ${inputUserName.value} | password : ${inputPassword.value}`)
    })
}