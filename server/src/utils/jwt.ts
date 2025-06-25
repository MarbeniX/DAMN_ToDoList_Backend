import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayload = {
    id: Types.ObjectId,
    email: string,
    username: string
}

export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
    return token
}