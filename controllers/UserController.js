import {UserModel} from "../models/UserModel";
import {validationResult} from 'express-validator'
import {generateMD5} from "../utils/generateHash";

const express = require('express')
const jwt = require('jsonwebtoken')

class UserController {
    async index(_, res) {
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 'success',
                data: users
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async show(req, res) {
        try {
            const userId = req.params.id

            if (!isValidObjectId(userId)) {
                res.status(400).send()
                return
            }
            const user = await UserModel.findById(userId).exec()

            if (!user) {
                res.status(404).send()
                return
            }

            res.json({
                status: 'success',
                data: user
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
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({status: 'error', errors: errors.array()})
                return
            }
            const data = {
                email: req.body.email,
                userName: req.body.userName,
                fullName: req.body.fullName,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }

            const user = await UserModel.create(data)

            sendEmail({
                    emailFrom: 'admin@story.com',
                    emailTo: data.email,
                    subject: 'Подтверждение почты',
                    html: `Для того, чтобы подтвердить почту, перейдите на <a href="http://localhost:${
                        process.env.PORT || 8888
                    }/auth/varufy?hash=${data.confirmHash}">по этой ссылке</a>`
                },
                (err) => {
                    if (err) {
                        res.status(500).json({
                            status: 'error',
                            message: err
                        })
                    } else {
                        res.status(201).json({
                            status: 'success',
                            data: user
                        })
                    }
                })

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async verify(req,res) {
        try{
            const hash = req.query.hash

            if(!hash) {
                res.status(400).send()
                return
            }
            const user = await UserModel.findOne({confirmHash: hash}).exec()

            if(user) {
                user.confirmed = true
                await user.save()

                res.json({
                    status: 'success',
                    data: user.toJSON()
                })
            } else {
                res.status(404).json({status: 'error', message: 'Пользователь не найден'})
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async afterLogin(req, res) {
        try{
            const user = req.user ? req.user.toJSON() : undefined
            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({ data: req.user},
                        process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days'
                        })
                }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
    async getUserInfo(req, res) {
        try{
            const user = req.user ? req.user.toJSON() : undefined
            res.json({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
}
export const UserCtrl = new UserController()