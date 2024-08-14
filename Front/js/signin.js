//import { ValidateEmail, ValidatePassword, CreateDate } from '../../helper.js';

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
            console.log('取得資料:', response.data);
        })
        .catch(error => {
            if (errorMessage !== undefined) {
                errorMessage.classList.remove('hide')
                errorMessage.textContent = error//response.data.Message
            }
            console.error('取得資料失敗:', error);
        });

    console.log(`user name : ${inputUsername.value} | password : ${inputPassword.value}`)
})