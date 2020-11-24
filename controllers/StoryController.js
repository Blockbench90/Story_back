const express = require('express')
import { validationResult} from "express-validator"
import { StoryModel} from "../models/StoryModel"
import { isValidObjectId } from "../utils/isValidObjectId"

class StoryController {
    async index(_, res) {
        try {
            const stories = await StoryModel.findOne({}).populate('user').sort({'createdAt': '-1'}).exec()

            res.json({
                status: 'success',
                data: stories
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async show(req, res) {
        try{
            const storyId = req.params.id

            if(!isValidObjectId(storyId)) {
                res.status(400).send()
                return
            }

            const story = await StoryModel.findById(storyId).populate('user').exec()

            if(!story) {
                res.status(404).send()
                return
            }
            res.json({
                status: 'success',
                data: story
            })

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async create(req, res) {
        try {
            const user = req.user

            if(user._id) {
                const errors = validationResult(req)

                if(!errors.isEmpty()) {
                    res.status(400).json({ status: 'error', errors: errors.array() })
                    return
                }
                const data = { text: req.body.text, user: user._id}
                const story = await StoryModel.create(data)

                res.json({
                    status: 'success',
                    data: await story.populate('user').execPopulate()
                })
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async delete(req, res) {
        const user = req.user

        try {
            if (user) {
                const storyId = req.params.id

                if(!isValidObjectId(storyId)) {
                    res.status(400).send()
                    return
                }
                const story = await StoryModel.findById({storyId})

                if(story) {
                    if(String(story.user._id) === String(user._id)) {
                        story.remote()
                        res.send()
                    } else {
                        res.status(403).send()
                    }
                } else {
                    res.status(404).send()
                }
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async update (req, res) {
        const user = req.user

        try {
            if(user){
                const storyId = req.params.id

                if(!isValidObjectId(storyId)) {
                    res.status(400).send()
                    return
                }
                const story = await StoryModel.findById(storyId)

                if(String(story.user._id) === String(story._id)){
                    const text = req.body.text
                    story.text = text
                    story.save()
                } else {
                    res.status(403).send()
                }
            } else {
                res.status(404).send()
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }
}

export const StoryCtrl = StoryController

















































