const express=require("express")
const app=express()
const dotnev=require("dotenv")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const path=require("path")
const dbConnect = require("./database/dbConnect")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
const userRoute=require("./routes/users")
const commentRoute=require("./routes/comments")
const skillRoute=require("./routes/skills")
const {errorHandler}=require("./middlewares/error")


dotnev.config()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/api/auth",authRoute)
app.use("/api/post",postRoute)
app.use("/api/user",userRoute)
app.use("/api/comment",commentRoute)
app.use("/api/skill",skillRoute)


app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    dbConnect()
    console.log("app is running!")
})
