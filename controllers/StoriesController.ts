import express from 'express';

import { validationResult } from 'express-validator';
import { StoryModel } from '../models/StoryModel';
import { isValidObjectId } from '../utils/isValidObjectId';
import { UserModelInterface } from '../models/UserModel';

class StoriesController {
  //достать все сторисы
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const stories = await StoryModel.find({}).populate('user').sort({ 'createdAt': '-1' }).exec();

      res.json({
        status: 'success',
        data: stories,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async show(req: any, res: express.Response): Promise<void> {
  //достать конкретную сторис
    try {
      const storyId = req.params.id;

      if (!isValidObjectId(storyId)) {
        res.status(400).send();
        return;
      }

      const story = await StoryModel.findById(storyId).populate('user').exec();

      if (!story) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: story,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
   //создать сторис
    try {
      const user = req.user as UserModelInterface;

      if (user?._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
          return;
        }

        const data: any = {
          title: req.body.title,
          text: req.body.text,
          user: user._id,
        };

        const story = await StoryModel.create(data);
        console.log(story)
        res.json({
          status: 'success',
          data: await story.populate('user').execPopulate(),
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async   delete(req: express.Request, res: express.Response): Promise<void> {
    //операция патовая, поэтому сначала проверка, является ли пользователь владельцем истории
    const user = req.user as UserModelInterface;

    try {
      if (user) {
        const storyId = req.params.id;

        if (!isValidObjectId(storyId)) {
          res.status(400).send();
          return;
        }

        const story = await StoryModel.findById(storyId);

        if (story) {
          if (String(story.user._id) === String(user._id)) {
            story.remove();
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async update(req: express.Request, res: express.Response): Promise<void> {
    const user = req.user as UserModelInterface;

    try {
      if (user) {
        const storyId = req.params.id;

        if (!isValidObjectId(storyId)) {
          res.status(400).send();
          return;
        }

        const story = await StoryModel.findById(storyId);

        if (story) {
          if (String(story.user._id) === String(user._id)) {
            const text = req.body.text;
            story.text = text;
            story.save();
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export const StoriesCtrl = new StoriesController();
