const express=require("express")
const router=express.Router()
const Post=require("../models/Post")
const User=require("../models/User")
const Comment=require("../models/Comment")
const { CustomError } = require("../middlewares/error")
const upload=require("../middlewares/upload")

router.post("/create/:userId",upload.array("images",5),async(req,res,next)=>{
    const {userId}=req.params
    const {caption}=req.body
    const files=req.files

    try{
        const user=await User.findById(userId)
       if(!user){
        throw new CustomError("User not found!",404)
       }
       const imageUrls=files.map(file=>generateFileUrl(file.filename))
       const newPost=new Post({
        user:userId,
        caption,
        image:imageUrls
       })

       await newPost.save()
       user.posts.push(newPost._id)
       await user.save()
       res.status(201).json({message:"Post created successfully!",post:newPost})

    }
    catch(error){
        next(error)
    }

})

const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}

router.get("/post/:postId",async(req,res,next)=>{
    const {postId}=req.params
    try{
        const post=await Post.findById(postId).populate("user","name profilePicture bio")
        if(!post){
            throw new CustomError("Post not found!",404)
        }
        res.status(200).json(post)

    }
    catch(error){
        next(error)
    }
})

router.get("/all/:userId",async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId)
        if(!user){
            throw new CustomError("User not found!",404)
        }

        const allPosts=await Post.find().populate("user","name profilePicture bio")
        res.status(200).json(allPosts)

    }
    catch(error){
        next(error)
    }
})

router.get("/:userId",async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId)
        if(!user){
            throw new CustomError("User not found!",404)
        }

        const userPosts=await Post.find({user:userId})

        res.status(200).json(userPosts)

    }
    catch(error){
        next(error)
    }
})

router.delete("/:postId",async (req,res,next)=>{
    const {postId}=req.params
    try{
        const postToDelete=await Post.findById(postId)
        if(!postToDelete){
            throw new CustomError("Post not found!",404)
        }
        const user=await User.findById(postToDelete.user)
        if(!user){
            throw new CustomError("User not found!",404)
        }
        user.posts=user.posts.filter(postId=>postId.toString()!==postToDelete._id.toString())
        await user.save()
        await postToDelete.deleteOne()
        await Comment.deleteMany({post:postId})

        res.status(200).json({message:"Post deleted successfully!"})

    }
    catch(error){
        next(error)
    }
})

router.post("/like/:postId/:userId",async(req,res,next)=>{
    const {postId}=req.params
    const {userId}=req.params
    try{
        const post=await Post.findById(postId)
        if(!post){
            throw new CustomError("Post not found!",404)
        }
        const user=await User.findById(userId)
        if(!user){
            throw new CustomError("User not found!",404)
        }
        if(post.likes.includes(userId)){
        post.likes=post.likes.filter(id=>id.toString()!==userId)
        await post.save()
        res.status(200).json({message:"Post disliked successfully!",post})
        }else{
            post.likes.push(userId)
            await post.save()
            res.status(200).json({message:"Post liked successfully!",post})
        }
        
    }
    catch(error){
        next(error)
    }
})


module.exports=router