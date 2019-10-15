import { Request, Response } from 'express'

import BlogPost, { IBlogPost } from '../models/BlogPost';
import { createBlogPostValidation } from '../libs/joi';
import User from '../models/User';

/**
 * @route   GET api/blogpost/
 * @desc    List of BlogPosts
 * @access  Public
 */

 export const showBlogPosts = async ( req: Request, res: Response ) => {
    try {
        const blogPosts = await BlogPost.find().sort({ createdAt: -1 })
        res.json(blogPosts)
    } catch (e) {
        res.status(500).send('Server Error')
    }
 }

/**
 * @route   POST api/blogpost/create
 * @desc    Validates data BlogPost data and creates new BlogPost
 * @access  Private
 */

export const create = async ( req: Request, res: Response ) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
        return res.status(404).json('No User found');
    }
    const { error } = createBlogPostValidation(req.body)
    if (error) return res.status(400).json(error.message)

    const { title, timeSpent, mainImage, body, code, video } = req.body
    const { url, imageCredit } = mainImage
    try {
        // Creates new BlogPost
        const newBlogPost: IBlogPost = new BlogPost({
            author: user.id,
            title,
            timeSpent,
            mainImage: {
                url,
                imageCredit
            },
            body,
            code,
            video
        })

        const savedBlogPost = await newBlogPost.save()
        
        res.json(savedBlogPost)
    } catch (e) {
        res.status(400).json(e)
    }
}