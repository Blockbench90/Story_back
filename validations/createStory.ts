import { body } from 'express-validator';

export const createStoryValidations = [
  body('text', 'Введите текст твита')
    .isString()
    .isLength({
      max: 1000,
    })
    .withMessage('Максимальная длина твита 1000 символов'),
];
