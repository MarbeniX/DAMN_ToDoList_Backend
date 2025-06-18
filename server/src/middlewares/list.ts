import type { Request, Response, NextFunction } from 'express'
import List, { IList } from '../models/List'

declare global{
    namespace Express{
        interface Request {
            list: IList
        }
    }
}

export async function validateListExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { listId } = req.params
        const list = await List.findById(listId)
        if (!list) {
            res.status(404).json({ message: 'List not found' })
            return
        }
        req.list = list // Attach the list to the request object for use in the next middleware or route handler
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}