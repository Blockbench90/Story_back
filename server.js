const express = require("express")
const passport = require('passport')

const app = express()

app.use(express.json())
app.use(passport.initialize())

app.get('/users', )

app.listen(3001, () => {
    console.log('SERVER START')
})

//остановился на sendEmail