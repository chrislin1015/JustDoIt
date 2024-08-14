const eyeIcon = document.querySelector('.eye-icon')
eyeIcon.addEventListener('click', () =>
{
    if (eyeIcon.src.endsWith('eye.png')) {
        const inputPassword = document.querySelector('.input-password')
        if (inputPassword !== undefined && inputPassword !== null) {
            inputPassword.type = 'Password'
        }

        const inputConfirmPassword = document.querySelector('.confirm-password')
        if (inputConfirmPassword !== undefined && inputConfirmPassword !== null) {
            inputConfirmPassword.type = 'Password'
        }

        eyeIcon.src = '../image/closed-eyes.png'
    }
    else if (eyeIcon.src.endsWith('closed-eyes.png')) {
        const inputPassword = document.querySelector('.input-password')
        if (inputPassword !== undefined && inputPassword !== null) {
            inputPassword.type = 'Text'
        }

        const inputConfirmPassword = document.querySelector('.confirm-password')
        if (inputConfirmPassword !== undefined && inputConfirmPassword !== null) {
            inputConfirmPassword.type = 'Text'
        }
        eyeIcon.src = '../image/eye.png'
    }
    console.log(eyeIcon.src)
})