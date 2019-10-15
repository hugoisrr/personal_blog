import { Router } from 'express'
const router = Router()

import { create, showBlogPosts } from '../controllers/blogpost';
import { TokenValidation } from "../libs/verifyToken";


/* Private Routes */

router.post("/create", TokenValidation, create)


/* Public Routes */

router.get("/", showBlogPosts)

export default router