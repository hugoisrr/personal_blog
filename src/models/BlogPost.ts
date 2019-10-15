import { Schema, model, Document, Types } from 'mongoose'

export interface IBlogPost extends Document {
    author: Types.ObjectId,
    title: string,
    timeSpent: number,
    mainImage: {
        url: string,
        imageCredit?: string
    },
    body: string,
    code?: string,
    video?: string
}

const blogPostSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true,
            min: 4
        },
        timeSpent: {
            type: Number,
            required: true,
            min: 0
        },
        mainImage: {
           url: {
               type: String,
               required: true
           },
           imageCredit: {
               type: String
           }
        },
        body: {
            type: String,
            required: true
        },
        code: {
            type: String,
            default: null
        },
        video: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

export default model<IBlogPost>('BlogPost', blogPostSchema)