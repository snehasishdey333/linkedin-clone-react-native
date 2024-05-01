const express=require("express")
const User = require("../models/User")
const Skill=require("../models/Skill")
const { CustomError } = require("../middlewares/error")
const router=express.Router()

router.post("/create/:userId",async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId)
        if(!user){
         throw new CustomError("User not found!",404)
        }
       const newSkill=new Skill(req.body)
       const savedSkill=await newSkill.save()
       user.skills.push(savedSkill._id)
       await user.save()
       res.status(201).json("New skill added")
    }
    catch(error){
       next(error)
    }

})

router.get("/:userId",async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId).populate("skills","title")
        if(!user){
         throw new CustomError("User not found!",404)
        }
        const skills=user.skills
        res.status(200).json(skills)

    }
    catch(error){
        next(error)
    }
})

router.delete("/:skillId/:userId",async(req,res,next)=>{

    const {skillId,userId}=req.params
    try{
        const skillToDelete=await Skill.findById(skillId)
        if(!skillToDelete){
            throw new CustomError("Skill not found!",404)
        }
        const user=await User.findById(userId)
        if(!user){
            throw new CustomError("User not found!",404)
        }
        user.skills=user.skills.filter(skillId=>skillId.toString()!==skillToDelete._id.toString())
        await user.save()
        await skillToDelete.deleteOne()
        

        res.status(200).json({message:"Skill deleted successfully!"})

    }
    catch(error){
        next(error)
    }
})
module.exports=router