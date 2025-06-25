import type { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController{
    static createTask = async (req: Request, res: Response) => {
        try{
            const task = new Task(req.body)
            task.list = req.list.id
            req.list.tasks.push(task.id)
            await Promise.all([task.save(), req.list.save()])
            res.status(201).send("Task created")
        }catch (error) {
            res.status(500).send('Internal server error')
            console.error(error)
        }
    }

    static getAllTasksByList = async (req: Request, res: Response) => {
        try{
            const { listId } = req.params
            const tasks = await Task.find({ list: listId }).select('description completed favorite priority repeat')
            if (tasks.length === 0) {
                res.status(404).send('No tasks found for this list')
                return
            }
            res.status(200).send(tasks)
        }catch (error) {
            res.status(500).send('Internal server error')
            console.error(error)    
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
            const allowedUpdates = ['description', 'completed', 'repeat', 'favorite', 'priority']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
            if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid updates!' })
                return
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

    static setFavoriteTask = async (req: Request, res: Response) => {
        try{
            req.task.favorite = !req.task.favorite
            await req.task.save()
            res.status(200).send("Favorite")
        }catch (error) {
            res.status(500).send('Internal server error')
            console.error(error)
        }
    }

    static setCompletedTask = async (req: Request, res: Response) => {
        try{
            req.task.completed = !req.task.completed
            await req.task.save()
            res.status(200).send("Completed")
        }catch (error) {
            res.status(500).send('Internal server error')
            console.error(error)
        }
    }
}