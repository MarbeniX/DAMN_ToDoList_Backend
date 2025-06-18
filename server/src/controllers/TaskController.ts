import type { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController{
    static createTask = async (req: Request, res: Response) => {
        try{
            const task = new Task(req.body)
            task.list = req.list.id
            req.list.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.list.save()])
            res.status(201).send("Task created")
        }catch (error) {
            res.status(500).send('Internal server error')
        }
    }

    static getAllTasks = async (req: Request, res: Response) => {
        try{
            const tasks = await Task.find({ list: req.list.id }).populate("list")
            res.status(200).send(tasks)
        }catch (error) {
            res.status(500).send('Internal server error')
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try{
            res.json(req.task)
        }catch (error) {
            res.status(500).send('Internal server error')
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try{
            const updates = Object.keys(req.body)
            const allowedUpdates = ['description', 'completed', 'dueDate', 'reminder', 'repeat', 'favorite', 'priority']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
            if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid updates!' })
            }
            updates.forEach((update) => req.task[update] = req.body[update])
            await req.task.save()
            res.status(200).send("Task updated")
        }catch (error) {
            res.status(500).send('Internal server error')
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try{
            req.list.tasks = req.list.tasks.filter((taskId) => taskId.toString() !== req.params.taskId)
            await Promise.allSettled([req.list.save(), req.task.deleteOne()])
            res.status(200).send("Task deleted")
        }catch(error) {
            res.status(500).send('Internal server error')
        }
    }
}