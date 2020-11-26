import dotenv from 'dotenv';
//запускаем получение ключевых конфигураций
dotenv.config();

import './core/db';

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/register';
import { passport } from './core/passport';
import { StoriesCtrl } from './controllers/StoriesController';
import { createStoryValidations } from './validations/createStory';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create)
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/stories', StoriesCtrl.index);
app.get('/stories/:id', StoriesCtrl.show);
app.delete('/stories/:id', passport.authenticate('jwt'), StoriesCtrl.delete);
app.patch('/stories/:id', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.update);
app.post('/stories', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.create);

app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.listen(process.env.PORT, (): void => {
  console.log('SERVER RUNNING!');
});
