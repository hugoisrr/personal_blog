import { Request, Response } from 'express';
import gravatar from 'gravatar';

import User, { IUser } from '../models/User';
import { signupValidation, signinValidation } from '../libs/joi';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    const { username, name, email, password } = req.body
    // Validation
    const { error } = signupValidation(req.body);
    if (error) return res.status(400).json(error.message);

    // Email Validation
    const emailExists = await User.findOne({ email: email });
    if (emailExists) return res.status(400).json('Email already exists');

    // Saving a new User
    try {
        // Creates avatar
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })

        const newUser: IUser = new User({
            username,
            email,
            name,
            avatar,
            password,
        });
        newUser.password = await newUser.encrypPassword(newUser.password);
        const savedUser = await newUser.save();

        const token: string = jwt.sign({ _id: savedUser._id }, process.env['TOKEN_SECRET'] || '', {
            expiresIn: 60 * 60 * 24,
        });
        // res.header('auth-token', token).json(token);
        res.header('auth-token', token).json(savedUser);
    } catch (e) {
        res.status(400).json(e);
    }
};

export const signin = async (req: Request, res: Response) => {  
    const { email, password } = req.body;
    const { error } = signinValidation(req.body);
    if (error) return res.status(400).json(error.message);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json('Email or Password is wrong');
    const correctPassword = await user.validatePassword(password);
    if (!correctPassword) return res.status(400).json('Invalid Password');

    // Create a Token
    const token: string = jwt.sign({ _id: user._id }, process.env['TOKEN_SECRET'] || '');
    res.header('auth-token', token).json(token);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
        return res.status(404).json('No User found');
    }
    res.json(user);
};
