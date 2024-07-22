const mysql = require('mysql2')

const connection = mysql.createConnection
(
    {
        host: 'localHost',
        user: 'root',
        password: 'Anfernee0224',
        database: 'just_do_it'
    }
)
connection.connect()

function Login(email, password)
{

}

function SignUp(email, password)
{

}

module.exports = 
{
    login: Login,
    signUp: SignUp
}