import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { convertTime } from "../utils";
import axios from "axios";

const HomePost = ({props}) => {

  const router=useRouter()
  const [isLiked,setIsLiked]=useState(false)

  const postId=props?._id
  const userId=props?.user._id

 
 
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

  
  return (
    <View style={{ padding: 8 ,backgroundColor:"white",marginVertical:4}}>
      <Pressable onPress={()=>router.push(`/(tabs)/home/profile/${props?.user._id}`)} style={{flexDirection:"row",alignItems:"center",gap:10}}>
        {props?.user.profilePicture ? <Image
          source={{
            uri: props?.user.profilePicture,
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />:
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />
        }
        <View>
          <Text style={{fontWeight:"700",fontSize:18}}>{props.user.name}</Text>
          {props.user.bio && <Text style={{color:"gray"}}>{props.user.bio}</Text>}
          <Text style={{color:"gray"}}>{convertTime(props.createdAt)}</Text>
        </View>
      </Pressable>
      
      <Pressable onPress={()=>router.push(`/post/${props._id}`)}>
      <Text style={{fontSize:16,marginTop:4}}>
        {props.caption}
      </Text>
      {props.image.length>0 && <Image
          source={{
            uri: props.image[0],
          }}
          style={{marginVertical:8, height: 300, width: "100%", marginBottom: 8 }}
        />}
      </Pressable>
      {/* <Text style={{color:"gray"}}>{props.likes.length} Likes</Text> */}
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:30,marginTop:8}}>
        <Pressable onPress={handleLikePost} style={{alignItems:"center",gap:4}}>
        { props.likes.some((like) => like.toString()==userId) ? 
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

        <Pressable onPress={()=>router.push(`/post/${props._id}`)} style={{alignItems:"center",gap:4}}>
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
  );
};

export default HomePost;

const styles = StyleSheet.create({});
