import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User';

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No autorizado: Token no proporcionado o formato incorrecto' });
        return
    }
    const [, token] = bearer.split(' ')
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded !== null){
            const user = await User.findById(decoded.id).select('_id username email')
            if(user){
                req.user = user
                next()
            }else{
                res.status(500).json({ error: 'Unvalid token' })
            }
        }
    }catch(error){
        res.status(500).json({ error: 'Unvalid token' })
    }
}