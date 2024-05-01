import {
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import Comment from "../../../components/Comment";
import axios from "axios";
import { convertTime } from "../../../utils";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
const postDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post,setPost]=useState()
  const [comments,setComments]=useState([])
  const [comment,setComment]=useState("")
  const [isLiked,setIsLiked]=useState(false)
  const [loggedInUserId,setLoggedInUserId]=useState()
  const [loggedInUser,setLoggedInUser]=useState()

  const userId=post?.user._id

 
  const handleLikePost=async()=>{
    try{
      const response=await axios.post(`http://localhost:5001/api/post/like/${postId}/${userId}`)
      const updatedPost=response.data.post
      setIsLiked(updatedPost.likes.some((like) => like.toString()==userId));
      
    }
    catch(err){
      console.log(err)
    }
  }

 
  useEffect(()=>{

    const fetchPost=async()=>{
      try{
         const response=await axios.get(`http://localhost:5001/api/post/post/${postId}`)
         setPost(response.data)
      }
      catch(err){
        console.log(err)
      }
    }

    fetchPost()

  },[postId])

  
  useEffect(()=>{
    const fetchLoggedInUserId=async()=>{
      try{
         const token=await AsyncStorage.getItem("token")
         const decodedToken=jwtDecode(token)
         const id=decodedToken._id
         setLoggedInUserId(id)
      }
      catch(err){
        console.log(err)
      }
    }

    fetchLoggedInUserId()
  },[])

  useEffect(()=>{
    if(loggedInUserId){
       const fetchLoggedInUser=async()=>{
         try{
            const response=await axios.get(`http://localhost:5001/api/auth/profile/${loggedInUserId}`)
            setLoggedInUser(response.data)
         }
         catch(err){
          console.log(err)
         }
       }
       fetchLoggedInUser()
    }
  },[userId])

  useEffect(()=>{

    const fetchComments=async()=>{
      try{
         const response=await axios.get(`http://localhost:5001/api/comment/${postId}`)
         setComments(response.data)
      }
      catch(err){
        console.log(err)
      }
    }

    fetchComments()

  },[postId])

  const handleCommentPost=async()=>{
    try{
      const response=await axios.post("http://localhost:5001/api/comment/create",{
        postId:postId, 
        userId:loggedInUserId, 
        text:comment
      })
      setComment("")

      setComments(prevComments => [...prevComments, response.data.comment])
    }
    catch(err){
      console.log(err)
    }
  }



  return (
    <ScrollView style={{flex:1,backgroundColor:"white",padding:8}}>
    <AntDesign onPress={()=>router.push("/(tabs)/home")} name="arrowleft" size={24} color="black" />
      <View style={{ marginVertical:4}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:10}}>
        {post?.user.profilePicture ? <Image
          source={{
            uri: post?.user.profilePicture,
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />:<Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />}
        <View>
          <Text style={{fontWeight:"700",fontSize:18}}>{post?.user.name}</Text>
          {post?.user.bio && <Text style={{color:"gray"}}>{post?.user.bio}</Text>}
          <Text style={{color:"gray"}}>{convertTime(post?.createdAt)}</Text>
        </View>
      </View>
      
      <Pressable onPress={()=>router.push("/post/123")}>
      <Text style={{fontSize:16,marginTop:4}}>
        {post?.caption}
      </Text>
      {post?.image.length>0 && <Image
          source={{
            uri: post?.image[0],
          }}
          style={{marginVertical:8, height: 300, width: "100%", marginBottom: 8 }}
        />}
      </Pressable>
      
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:30,marginTop:8}}>
      <Pressable onPress={handleLikePost} style={{alignItems:"center",gap:4}}>
        { post?.likes.some((like) => like.toString()==userId) ? 
          <View>
        <AntDesign name="like1" size={24} color="blue" />
          <Text style={{color:"blue"}}>Like</Text>
        </View>
         : isLiked ? <View>
        <AntDesign name="like1" size={24} color="blue" />
          <Text style={{color:"blue"}}>Like</Text>
        </View>:
        <View>
        <AntDesign name="like2" size={24} color="black" />
          <Text>Like</Text>
        </View>
          }
        </Pressable>

        <Pressable style={{alignItems:"center",gap:4}}>
          <FontAwesome5 name="comment-dots" size={24} color="black" />
          <Text>Comment</Text>
        </Pressable>

        <Pressable style={{alignItems:"center",gap:4}}>
          <AntDesign name="sharealt" size={24} color="black" />
          <Text>Repost</Text>
        </Pressable>

        <Pressable style={{alignItems:"center",gap:4}}>
          <FontAwesome name="send" size={24} color="black" />
          <Text>Send</Text>
        </Pressable>
      </View>
    </View>

    <View style={{backgroundColor:"white",padding:8}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    <View style={{flexDirection:"row",alignItems:'center'}}>
    {loggedInUser?.profilePicture ? 
      <Image
          source={{
            uri: loggedInUser?.profilePicture
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />:
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />}
        <TextInput value={comment} onChangeText={(text)=>setComment(text)} style={{marginLeft:8}} placeholder="Share your thoughts"/>
    </View>
    
        <Button onPress={handleCommentPost} title="Post"/>
    </View>
      <Text style={{fontSize:16,marginVertical:12}}>Comments</Text>
      {comments.map((comment,index)=>(
        <Comment props={comment} key={index}/>
      ))}
    </View>
    </ScrollView>
  )
}

export default postDetails

