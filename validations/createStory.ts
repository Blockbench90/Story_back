import { body } from 'express-validator';
//валидация для создания сторис
//по умолчанию text, а дальше проверки, "это строка?", "max длинна"
export const createStoryValidations = [
  body('title', 'Введите заголовок').isString().isLength({max: 1000}).withMessage('Максимальная длина истории 1000 символов'),
  body('text', 'Введите текст истории').isString().isLength({max: 3000}).withMessage('Максимальная длина истории 3000 символов'),
];
