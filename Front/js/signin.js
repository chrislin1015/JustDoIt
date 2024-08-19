//import { ValidateEmail, ValidatePassword, CreateDate } from '../../helper.js';

function test()
{
    localStorage.setItem('authToken', "test 123")
    console.log('登入成功，token:', 'test 123');
    window.location.href = './index.html'
}

const submit = document.getElementsByClassName("submit-circle")
submit[0].addEventListener("click", () => 
{
    const inputUsername = document.querySelector(".input-username")
    const inputPassword = document.querySelector(".input-password")
    const errorMessage = document.querySelector(".error-message")
    if (inputUsername === undefined || inputPassword === undefined || errorMessage === undefined)
    {
        console.log(`Can not query element`)
        return;
    }
    errorMessage.classList.add('hide')

    // if (!ValidateEmail(input_username[0].value))
    // {
    //     console.log('email formate error')
    //     return;
    // }

    // if (!ValidatePassword(input_password[0].value))
    // {
    //     console.log('email formate error')
    //     return;
    // }

    axios.post('http://127.0.0.1:3005/signin', {
            "email": inputUsername.value,
            "password": inputPassword.value,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const token = response.data.token
            localStorage.setItem('authToken', token)
            console.log('登入成功，token:', token);
            window.location.href = './index.html'
        })
        .catch(error => {
            if (errorMessage !== undefined) {
                errorMessage.classList.remove('hide')
                errorMessage.textContent = error//response.data.Message
            }
            console.error('登入失敗:', error);
        });

    console.log(`user name : ${inputUsername.value} | password : ${inputPassword.value}`)
})