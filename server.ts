import dotenv from 'dotenv';
//запускаем получение ключевых конфигураций
dotenv.config();

import './core/db';

import express from 'express';
import {UserCtrl} from './controllers/UserController';
import {registerValidations} from './validations/register';
import {passport} from './core/passport';
import {StoriesCtrl} from './controllers/StoriesController';
import {createStoryValidations} from './validations/createStory';

const app = express();

app.use(express.json());
app.use(passport.initialize());
//взять всех юзеров
app.get('/users', UserCtrl.index);
//создать юзера
app.post('/users', registerValidations, UserCtrl.create)
//верифицировать пользователя
app.get('/users/me', passport.authenticate('jwt', {session: false}), UserCtrl.getUserInfo);
//найти конкретного юзера
app.get('/users/:id', UserCtrl.show);

//взять все истории
app.get('/stories', StoriesCtrl.index);
//найти конкретную историю
app.get('/stories/:id', StoriesCtrl.show);
//пропускаю stories через мидлваре passport.authenticate('jwt'), создавая доп.интерфейс, чтобы взять ее из поля запроса(req)
//удалить историю
app.delete('/stories/:id', passport.authenticate('jwt'), StoriesCtrl.delete);
//обновить историю
app.patch('/stories/:id', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.update);
//создать в базе историю
app.post('/stories', passport.authenticate('jwt'), createStoryValidations, StoriesCtrl.create);

//зарегистрировать пользователя
app.post('/auth/register', registerValidations, UserCtrl.create);
//верефецировать пользователя
app.get('/auth/verify', registerValidations, UserCtrl.verify);
//залогиниться
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);


//слушьть порт 8888, ну или тот, который указан в конфигурации
app.listen(process.env.PORT, (): void => {
    console.log('SERVER RUNNING!');
});
