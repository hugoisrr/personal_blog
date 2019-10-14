import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    name: string;
    avatar: string;
    password: string;
    encrypPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            min: 4,
            lowercase: true,
        },
        name: {
            type: String,
            required: true,
            min: 4
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.methods.encrypPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', userSchema);
