import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Navbar = () => {
  const router=useRouter()
  const [userId,setUserId]=useState()
  const [user,setUser]=useState()
  const [query,setQuery]=useState("")
  // const path=usePathname()
  // console.log(path)
  

  useEffect(()=>{
    const fetchUserId=async()=>{
      try{
         const token=await AsyncStorage.getItem("token")
         const decodedToken=jwtDecode(token)
         const id=decodedToken._id
         setUserId(id)
      }
      catch(err){
        console.log(err)
      }
    }

    fetchUserId()
  },[])

  useEffect(()=>{
    if(userId){
       const fetchUser=async()=>{
         try{
            const response=await axios.get(`http://localhost:5001/api/auth/profile/${userId}`)
            setUser(response.data)
         }
         catch(err){
          console.log(err)
         }
       }
       fetchUser()
    }
  },[userId])
  return (
    <View style={{height:50,backgroundColor:"white",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingHorizontal:12}}>
    <TouchableOpacity onPress={()=>router.push(`/(tabs)/home/profile/${userId}`)}>
    {user?.profilePicture ? <Image
          source={{
            uri: user?.profilePicture,
          }}
          style={{ height: 40, width: 40, borderRadius: 75, marginBottom: 8 }}
        />:
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 40, width: 40, borderRadius: 75, marginBottom: 8 }}
        />
        }
       </TouchableOpacity>
       <Pressable style={{flexDirection:"row",alignItems:"center",width:320,height:35,backgroundColor:"#D3D3D3",paddingHorizontal:10,paddingVertical:4,borderRadius:8}}>
       <Octicons onPress={()=>router.push(`/(tabs)/home/search/${query}`)} name="search" size={20} color="black" />
       <TextInput value={query} onChangeText={(text)=>setQuery(text)} style={{marginLeft:8,height:"100%"}} placeholder='Search'/>
       </Pressable>
       <MaterialCommunityIcons name="message-text-outline" size={24} color="black" />
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({})