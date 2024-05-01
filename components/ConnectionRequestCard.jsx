import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import axios from "axios";

const ConnectionRequestCard = ({props,userId,setRequests,requests}) => {

  const handleAcceptRequest=async(requesterId)=>{
     try{
        await axios.post(`http://localhost:5001/api/user/accept-request`,
        {
          userId:userId, 
          requesterId:requesterId
        })
        setRequests(
          requests.filter((request) => request._id !== requesterId)
        );
        
     }
     catch(err){
      console.log(err)
     }
  }

  const handleRejectRequest=async(requesterId)=>{
    try{
      await axios.post(`http://localhost:5001/api/user/reject-request`,
      {
        userId:userId, 
        requesterId:requesterId
      })
      setRequests(
        requests.filter((request) => request._id !== requesterId)
      );
    }
    catch(err){
     console.log(err)
    }
  }

  return (
    <Pressable style={{paddingHorizontal:16,paddingVertical:8,flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"white"}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
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
        <View style={{alignItems:"flex-start"}}>
          <Text style={{fontSize:18,fontWeight:"600"}}>{props?.name}</Text>
          <Text style={{color:"gray"}}>{props?.bio.slice(0,30)}</Text>
        </View>
      </View>

      <View style={{flexDirection:"row",gap:12}}>
        <Pressable onPress={()=>handleAcceptRequest(props._id)} style={{borderColor:"blue",borderWidth:1,borderRadius:75,padding:4}}>
        <Feather name="check" size={24} color="blue" />
        </Pressable>
        <Pressable onPress={()=>handleRejectRequest(props._id)} style={{borderColor:"blue",borderWidth:1,borderRadius:75,padding:4}}>
          <Entypo name="cross" size={24} color="blue" />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ConnectionRequestCard;

const styles = StyleSheet.create({});
