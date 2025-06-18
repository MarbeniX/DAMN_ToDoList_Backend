import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

const colorList = {
    RED: "#FF0000",
    ORANGE: "#FFA500",
    YELLO: "#FFFF00",
    GREEN: "#008000",
    BLUE: "#0000FF",
    PURPLE: "#800080",
    PINK: "#FFC0CB",
    BROWN: "#A52A2A",
    GRAY: "#808080",
} as const;

const categoryList = {
    PERSONAL: "personal",
    WORK: "work",
    URGENT: "urgent"
}as const

export type ColorList = typeof colorList[keyof typeof colorList];
export type CategoryList = typeof categoryList[keyof typeof categoryList];

export interface IList extends Document {
    listName: string,
    description: string,
    listColor: ColorList,
    tasks: PopulatedDoc<ITask & Document>[],
    category: CategoryList,
    owner: PopulatedDoc<IUser & Document>
}

export const ListSchema = new Schema({
    listName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        minLength: 1,
    },
    description: {
        type: String, 
        required: false,
        trim: true,
        maxLength: 100
    },
    listColor: {
        type: String,
        required: false,
        enum: Object.values(colorList),
        default: colorList.BLUE
    },
    tasks: [{
        type: String,
        ref: "Task",
    }],
    category: {
        type: String, 
        require: false,
        enum: Object.values(categoryList),
        default: categoryList.PERSONAL
    },
    owner: {
        type: Types.ObjectId,
        ref: "User",
    }
})

const List = mongoose.model<IList>("List", ListSchema);
export default List;