import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string, 
    name: string, 
    token: string
}

export class AuthEmail{
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'ToDo <admin@todo.com',
            to: user.email,
            subject: 'ToDo - Confirm your email',
            text: "ToDo - Verify your email",
            html: `Hello: ${user.name}, please confirm your email typing the code:
                <p> Add the code: <b>${user.token}</b></p>
                <p>This token will expire in 1 hour</p>
            `
        })
        console.log('Message sent: %s', info.messageId)
    }
    static sendResetPasswordEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'ToDo <admin@todo.com',
            to: user.email,
            subject: 'ToDo - Reset your password',
            text: "ToDo - Reset your password",        
            html: `Hello: ${user.name}, please confirm your email typing the code:
                <p> Add the code: <b>${user.token}</b></p>
                <p>This token will expire in 1 hour</p>
            `
        })
        console.log('Message sent: %s', info.messageId)
    }
}