import mongoose, { Schema, Document, Types } from "mongoose";

const repeatOptions = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTLY: "monthly",
    YEARLY: "yearly",
} as const

const lvlPriorityOptions = {
    BLOCKER: "blocker",
    CRITICAL: "critical",
    HIGH: "high",
    NORMAL: "normal",
    LOW: "low",
    OPTINAL: "optional"
}as const

export type RepeatOptions = typeof repeatOptions[keyof typeof repeatOptions];
export type PriorityOptions = typeof lvlPriorityOptions[keyof typeof lvlPriorityOptions]

export interface ITask extends Document {
    description: string,
    completed: boolean,
    dueDate: Date | null,
    list: Types.ObjectId,
    reminder: Date | null,
    repeat: RepeatOptions | null,
    favorite: boolean,
    priority: PriorityOptions
}

export const TaskSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: null
    },
    list: {
        type: Types.ObjectId,
        ref: "List",
        required: true
    },
    reminder: {
        type: Date,
        default: null
    },
    repeat: {
        type: String,
        enum: Object.values(repeatOptions),
        default: null
    },
    favorite: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: Object.values(lvlPriorityOptions),
        default: lvlPriorityOptions.NORMAL
    }
})

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
    