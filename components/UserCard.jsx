import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

const UserCard = ({props,userId}) => {
  const router=useRouter()
  const [sent,setSent]=useState(false)

  const handleSendConnectionRequest=async()=>{
    try{
       const response=await axios.post(`http://localhost:5001/api/user/send-request`,{
        userId:userId, 
        targetUserId:props._id
       })
       setSent(true)
       
    }
    catch(err){
      console.log(err)
    }
  }
  
  return (
    <Pressable onPress={()=>router.push(`/(tabs)/home/profile/${props._id}`)}
      style={{
        backgroundColor:"white",
        width: 200,
        height: 250,
        alignItems: "center",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 8,
        paddingVertical: 16,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      {props?.profilePicture ? <Image
          source={{
            uri: props?.profilePicture,
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
      <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 20 }}>
        {props?.name}
      </Text>
      {props?.bio && <Text
        style={{
          marginBottom: 20,
          fontSize: 16,
          color: "gray",
          textAlign: "center",
          paddingHorizontal:4
        }}
      >
        {props?.bio}
      </Text>}
      {!sent? <Pressable
      onPress={handleSendConnectionRequest}
        style={{
          borderRadius: 16,
          borderColor: "blue",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
          paddingVertical: 8,
        }}
      >
        <Text style={{ fontSize: 14, color: "blue" }}>Connect</Text>
      </Pressable>:
      <Pressable
      
        style={{
          borderRadius: 16,
          borderColor: "gray",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
          paddingVertical: 8,
        }}
      >
        <Text style={{ fontSize: 14, color: "gray" }}>Connect</Text>
      </Pressable>}
    </Pressable>
  );
};

export default UserCard;

const styles = StyleSheet.create({});
