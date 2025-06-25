import type { Request, Response } from 'express'
import List from '../models/List'
import Task from '../models/Task'
import User from '../models/User'

export class ProjectController{
    static createList = async (req: Request, res: Response) => {
        const list = new List(req.body)
        const user = await User.findById(req.user._id)
        if(!user){
            res.status(404).json({ message: 'User not found' })
            return
        }
        user.lists.push(list._id as any)
        try{
            await list.save()
            await user.save()
            res.send("Project saved")
        }catch (error) {
            res.status(500).json({error})
        }
    }

    static getAllListsByCategory = async (req: Request, res: Response) => {
        try{
            const { category } = req.params
            const lists = await List.find({ category, owner: req.user._id }).select('listName description listColor')
            if (lists.length === 0) {
                res.status(404).json({ message: 'No lists found for this category' })
                return
            }
            res.json(lists)
        }catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static getAllLists = async (req: Request, res: Response) => {
        try{
            const lists = await List.find({ owner: req.user._id }).select('listName description listColor category')
            res.json(lists)
        }catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static getListById = async (req: Request, res: Response) => {
        try{
            const { id } = req.params
            const list = await List.findById(id)
            if(!list){
                res.status(404).json({ message: 'List not found' })
                return
            }
            if(list.owner.toString() !== req.user._id.toString()){
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            res.json(list)
        }catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static updateList = async (req: Request, res: Response) => {
        try{
            const { id } = req.params
            const list = await List.findById(id)
            if(!list){
                res.status(404).json({ message: 'List not found' })
                return
            }
            if(list.owner.toString() !== req.user._id.toString()){
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            const updates = Object.keys(req.body)
            const allowedUpdates = ['listName', 'description','listColor', 'category']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
            if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid updates!' })
                return
            }
            updates.forEach((update) => list[update] = req.body[update])
            await list.save()
            res.send("Project updated")
        }catch (error) {
            res.status(500).json({error})
        }
    }

    static deleteList = async (req: Request, res: Response) => {
        try{
            const { id } = req.params
            const list = await List.findById(id)
            if(!list){
                res.status(404).json({ message: 'List not found' })
                return
            }
            if(list.owner.toString() !== req.user._id.toString()){
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            await Promise.all(list.tasks.map(async (taskId) => {
                await Task.findByIdAndDelete(taskId)
            }))
            const user = await User.findById(req.user._id)
            user.lists = user.lists.filter((listId) => listId.toString() !== id)
            await Promise.all([
                user.save(),
                List.deleteOne({ _id: id })
            ])
            res.send("Project deleted")
        }catch(error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}