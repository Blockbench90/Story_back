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

app.get('/users', UserCtrl.index); //взять всех юзеров
app.post('/users', registerValidations, UserCtrl.create) //создать юзера
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show); //найти конкретного юзера

app.get('/stories', StoriesCtrl.index); //взять все истории
app.get('/stories/:id', StoriesCtrl.show); //найти конкретную историю
//пропускаю stories через мидлваре passport.authenticate('jwt'), создавая доп.интерфейс, чтобы взять ее из поля запроса(req)
app.delete('/stories/:id', passport.authenticate('jwt'), StoriesCtrl.delete); //удалить историю
app.patch('/stories/:id', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.update); //обновить историю
app.post('/stories', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.create); //создать в базе историю

app.get('/auth/verify', registerValidations, UserCtrl.verify); //верефецировать пользователя
app.post('/auth/register', registerValidations, UserCtrl.create);  //зарегистрировать пользователя
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);  //залогиниться


//слушьть порт 8888, ну или тот, который указан в конфигурации
app.listen(process.env.PORT, (): void => {
  console.log('SERVER RUNNING!');
});
