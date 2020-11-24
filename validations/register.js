import {body} from "express-validator";


export const registerValidator = [
    body('email', 'Введите E-mail').isEmail().withMessage('Неверный E-mail').isLength({ min: 10, max: 40}).withMessage('Допустимое ко-во символов в почте от 10 до 40.'),
    body('FullName', 'Введите имя').isString().isLength({min:2 , max: 40}).withMessage('Допустимое количество символов в имени от 2 до 40.'),
    body('userName', 'Укажите логин').isString().isLength({ min: 2, max: 40}).withMessage('Допустимое кол-во символов в логине от 2 до 40.'),
    body('password', 'Укажите пароль').isString().isLength({min: 6}).withMessage('Минимальная длинна пароля 6 символов').custom((value, {req}) => {
        if(value !== req.body.password2) {
            throw new Error('Пароли не совпадают')
        } else {
            return value
        }
    })
]