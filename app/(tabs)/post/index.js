import { Button, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { pickImage } from '../../../utils';

const index = () => {
  const [userId,setUserId]=useState()
  const [image, setImage] = useState();
  const [caption,setCaption]=useState("")
  const router=useRouter()


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

 
const takeImage=async()=>{
  const res=await pickImage()
  setImage(res)
}

  

  const uploadImage = async () => {
    let formData = new FormData();
    
    if(image!=undefined){
      formData.append('images', {
        uri:image,
        type: 'image/jpeg', 
        name: 'image.jpg',
      });
    }
    
    formData.append("caption",caption)
    console.log(image)
    try {
      const response = await axios.post(`http://localhost:5001/api/post/create/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push("/(tabs)/home")
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const handlePostSubmission=async()=>{
    try{
      await uploadImage(image)
    }
    catch(err){
      console.log(err)
    }
  }

 

  return (
    <View style={{flex:1,backgroundColor:"white",padding:8,justifyContent:'space-between'}}>
    <View>
    <Entypo onPress={()=>router.replace("/(tabs)/home")} name="cross" size={26} color="black" />
    <Text style={{fontWeight:"500",fontSize:20,marginVertical:10}}>Create post</Text>
  
      <TextInput value={caption} onChangeText={(text)=>setCaption(text)} style={{}} placeholder='write a post'/>
    </View>

    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    <Entypo onPress={takeImage} name="image" size={24} color="black" />
      <Pressable onPress={handlePostSubmission} style={{backgroundColor:"#0077b5",width:100,alignItems:"center",justifyContent:"center",padding:8,borderRadius:4}}>
        <Text style={{color:"white",fontSize:16}}>Post</Text>
      </Pressable>
    </View>
    
     
    </View>
  )
}

export default index


const styles = StyleSheet.create({})