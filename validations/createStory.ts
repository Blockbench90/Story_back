import { body } from 'express-validator';
//валидация для создания сторис
//по умолчанию text, а дальше проверки, "это строка?", "max длинна"
export const createStoryValidations = [
  body('text', 'Введите текст твита')
    .isString()
    .isLength({
      max: 1000,
    })
    .withMessage('Максимальная длина истории 1000 символов'),
];
