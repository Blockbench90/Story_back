const express = require("express")
const passport = require('passport')
const { UserCtrl } = require('./controllers/UserController')
const app = express()

app.use(express.json())
app.use(passport.initialize())

app.get('/users', UserCtrl.index)

app.listen(3001, () => {
    console.log('SERVER START')
})

//остановился на sendEmail