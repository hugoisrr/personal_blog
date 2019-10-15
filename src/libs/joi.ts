import Joi from '@hapi/joi';
import {IUser} from '../models/User'
import {IBlogPost} from '../models/BlogPost';

export const signupValidation = (data: IUser) => {
    const userSchema = Joi.object({
        username: Joi
            .string()
            .min(4)
            .max(30)
            .required(),
        email: Joi
            .string()
            .required(),
        name: Joi
            .string()
            .min(4)
            .max(25)
            .required(),
        password: Joi
            .string()
            .min(6)
            .required()
    });
    return userSchema.validate(data);
};

export const signinValidation = (data: IUser) => {
    const userSchema = Joi.object({
        email: Joi
            .string()
            .required(),
        password: Joi
            .string()
            .min(6)
            .required()
    });
    return userSchema.validate(data);
};

export const createBlogPostValidation = (data: IBlogPost) => {
    const blogPostSchema = Joi.object({
        title: Joi
            .string()
            .trim()
            .required()
            .min(4),
        timeSpent: Joi
            .number()
            .min(1)
            .required(),
        mainImage: {
            url: Joi
                .string()
                .trim()
                .required(),
            imageCredit: Joi
                .string()
                .trim()
        },
        body: Joi
            .string()
            .required(),
        code: Joi
            .string(),
        video: Joi
            .string()
            .trim()
    })
    return blogPostSchema.validate(data)
}