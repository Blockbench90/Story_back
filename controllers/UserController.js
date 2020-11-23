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

            if(!isValidObjectId(userId)){
                res.status(400).send()
                return
            }
            const user = await UserModel.findById(userId).exec()

            if(!user) {
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
            if(!errors.isEmpty()) {
                res.status(400).json({status: 'error', errors: errors.array() })
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

            sendEmail()

        } catch (error) {
            
        }
    }
}