import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

declare global{
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).send('Task not found')
        }
        if(task.list.toString() !== req.list.id) {
            return res.status(403).send('Forbidden')
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).send('Internal server error')
    }
}