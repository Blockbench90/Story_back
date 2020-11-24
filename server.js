import {StoryCtrl} from "./controllers/StoryController";
import {createStoryValidations} from "./validations/createStory";
import {registerValidator} from "./validations/register";
const { UserCtrl } = require('./controllers/UserController')

const express = require("express")
const passport = require('passport')
const app = express()

app.use(express.json())
app.use(passport.initialize())

app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo)
app.use('/users/:id', UserCtrl.show)

app.get('/stories', StoryCtrl.index)
app.get('/stories/:id', StoryCtrl.show)
app.delete('/stories/:id', passport.authenticate('jwt'), StoryCtrl.delete)
app.patch('/stories/:id', passport.authenticate('jwt'), createStoryValidations, StoryCtrl.update)
app.post('/stories', passport.authenticate('jwt'), createStoryValidations, StoryCtrl.create)

app.get('/auth/verify', registerValidator, UserCtrl.verify)
app.post('/auth/register', registerValidator, UserCtrl.create)
app.get('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)

app.listen(3001, () => {
    console.log('SERVER START')
})

//остановился на sendEmail