import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

const editProfile = () => {
    const router=useRouter()
    const [bio,setBio]=useState("")
    const {userId}=useLocalSearchParams()

    useEffect(()=>{
      
        const fetchUser=async()=>{
          try{
             const response=await axios.get(`http://localhost:5001/api/auth/profile/${userId}`)
             setBio(response.data.bio)
          }
          catch(err){
           console.log(err)
          }
        }
        fetchUser()
     
    },[])

    const handleUpdateProfile=async()=>{
      try{
        await axios.put(`http://localhost:5001/api/user/${userId}`,{
          bio:bio
        })
        router.push(`/(tabs)/home/profile/${userId}`)
      }
      catch(err){
        console.log(err)
      }
    }
    
  return (
    <View style={{flex:1,backgroundColor:"white",padding:8}}>
    
    <Entypo onPress={()=>router.replace("/home/profile/65e46fb90773da58669cdb86")} name="cross" size={26} color="black" />
      <Text style={{fontSize:20,fontWeight:"500",marginVertical:8}}>Bio</Text>
      <TextInput value={bio} onChangeText={(text)=>setBio(text)} style={{borderBottomWidth:2,borderColor:"#ECECEC",marginHorizontal:8,padding:4,marginVertical:8}} placeholder=''/>

    <Pressable onPress={handleUpdateProfile} style={{alignItems:"center",justifyContent:"center",paddingVertical:10,backgroundColor:"#0077b5",borderRadius:16,marginTop:20}}>
        <Text style={{color:"white",fontWeight:"600"}}>Save</Text>
    </Pressable>
      
    </View>
  )
}

export default editProfile

const styles = StyleSheet.create({})