import { Request, Response } from 'express';
import User from '../models/User';
import { comparePasswords, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
import { promises } from 'nodemailer/lib/xoauth2';

export class AuthController{
    static createAccount = async (req: Request, res: Response) => {
        try{
            const { password, email } = req.body;

            const emailExists = await User.findOne({email})
            if(emailExists){
                res.status(400).send({message: "Email already in use"})
                return;
            } 
            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.username,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send("Account created, check your email to verify your account")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try{
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                res.status(400).send({message: "Invalid token"})
                return;
            }

            const user = await User.findById(tokenExists.user)
            if(!user){
                res.status(400).send({message: "User not created or found"})
                return;
            }
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Account confirmed")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static login = async (req: Request, res: Response) => {
        try{
            const { email, password } = req.body
            const user = await User.findOne({email})
            if(!user){
                res.status(400).send({message: "Invalid credentials"})
                return;
            }

            if(!user.confirmed){
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.username,
                    token: token.token
                })
                res.status(400).send({message: "Account not confirmed"})
                await token.save()
                return;
            }

            const isMatch = await comparePasswords(password, user.password)
            if(!isMatch){
                res.status(400).send({message: "Invalid credentials"})
                return;
            }
            const token = generateJWT({id : user.id})
            res.send(token)
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static requestCode = async (req: Request, res: Response) => {
        try{
            const { email } = req.body
            const emailExists = await User.findOne({email})
            if(!emailExists){
                res.status(400).send({message: "Email not registered"})
                return
            }
            if(emailExists.confirmed){
                res.status(400).send({message: "Account already confirmed"})
                return
            }
            const token = new Token()
            token.token = generateToken()
            token.user = emailExists.id
            AuthEmail.sendConfirmationEmail({
                email: emailExists.email,
                name: emailExists.username,
                token: token.token
            })
            await Promise.allSettled([token.save(), emailExists.save()])
            res.send("Confirmation email sent")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static requestPasswordReset = async (req: Request, res: Response) => {
        try{
            const { email } = req.body
            const emailExists = await User.findOne({email})
            if(!emailExists){
                res.status(400).send({message: "Email not registered"})
                return
            }
            const token = new Token()
            token.token = generateToken()
            token.user = emailExists.id
            AuthEmail.sendResetPasswordEmail({
                email: emailExists.email,
                name: emailExists.username,
                token: token.token
            })
            await token.save()
            res.send("Password reset email sent")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try{
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                res.status(400).send({message: "Invalid token"})
                return;
            }
            res.send("Token valid")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }

    static resetPassword = async (req: Request, res: Response) => {
        try{
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({token})
            const user = await User.findById(tokenExists.user)

            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Password reset")
        }catch(error){
            res.status(500).json({message: "Internal server error"})
        }
    }
}