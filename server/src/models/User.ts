import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose"
import { IList } from "./List"

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    confirmed: boolean,
    lists: PopulatedDoc<IList & Document>[]
}

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 12,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    lists: [{
        type: Types.ObjectId,
        ref: "List",
    }]
})

const User = mongoose.model<IUser>("User", UserSchema)
export default User
