import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ProfilePosts from '../../../../components/ProfilePosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { pickImage } from '../../../../utils';

const profile = () => {
  const { userId } = useLocalSearchParams();
  const router=useRouter()
  const [user,setUser]=useState()
  const [loggedinUserId,setLoggedInUserId]=useState()

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

  const handleLogout = async () => {
    try {
     
      await AsyncStorage.removeItem('token');
      router.push("/login")
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  
 

  const updateProfileImage=async()=>{
    try{
      const res=await pickImage()
      let formData = new FormData();
   
      formData.append("profilePicture", {
        uri:res,
        type: 'image/jpeg', 
        name: 'image.jpg',
      });
      
      try {
        
        const response = await axios.put(`http://localhost:5001/api/user/update-profile-picture/${userId}`, formData,{headers: {
          'Content-Type': 'multipart/form-data',
        }});
        router.push(`/(tabs)/home/profile/${userId}`)
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      }
      catch(err){
        console.log(err)
      }
      
    }
    
  

  

  return (
    <ScrollView style={{flex:1,backgroundColor:"#ECECEC"}}>
    
    <View style={{backgroundColor:"white",marginBottom:8,paddingHorizontal:8,paddingVertical:16}}>
    <View style={{backgroundColor:"white",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    <AntDesign onPress={()=>router.replace("/(tabs)/home")} name="arrowleft" size={24} color="black" />
    {loggedinUserId==userId && <MaterialIcons onPress={handleLogout} name="logout" size={24} color="black" />}
    </View>
    
    {user?.profilePicture ? 
      <TouchableOpacity onPress={updateProfileImage}>
    <Image
          source={{
            uri: user?.profilePicture,
          }}
          style={{ height: 100, width: 100, borderRadius: 75, marginBottom: 8 }}
        />
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={updateProfileImage}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 100, width: 100, borderRadius: 75, marginBottom: 8 }}
        />
        </TouchableOpacity>
        }
        <View style={{marginBottom:8,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        <Text style={{fontWeight:"bold",fontSize:24}}>{user?.name}</Text>
        {loggedinUserId==userId && <SimpleLineIcons onPress={()=>router.push(`/(tabs)/home/editProfile/${userId}`)} name="pencil" size={20} color="black" />}
        </View>
        
        {user?.bio && <Text style={{marginBottom:4,fontSize:18}}>{user?.bio}</Text>}
        <Text style={{fontWeight:"700",color:"blue"}}>{user?.connections.length} connections</Text>
        {user?._id !== userId && <Pressable style={{backgroundColor:"#0077b5",width:100,borderRadius:20,padding:6,alignItems:"center",justifyContent:"center",marginVertical:6}}>
          <Text style={{color:"white",fontSize:15,fontWeight:"600"}}>Connect</Text>
        </Pressable>}
    </View>

    

    <View style={{backgroundColor:"white",paddingHorizontal:8,paddingVertical:16}}>
      <Text style={{fontWeight:"bold",fontSize:22}}>Activity</Text>
      <Text style={{fontWeight:"700",color:"blue"}}>{user?.connections.length + user?.connectionRequests.length} followers</Text>
      <View style={{backgroundColor:"green",padding:6,borderRadius:20,width:60,alignItems:"center",justifyContent:"center",marginTop:12,marginBottom:8}}>
      <Text style={{color:"white",fontSize:18,fontWeight:"600"}}>Posts</Text>
      </View>


      <View style={{alignItems:"center"}}>
      {user?.posts.map((post,index)=>(
        <ProfilePosts key={index} post={post} user={user}/>
      ))}
        
        
        <View style={{flexDirection:"row",alignItems:'center',gap:6,paddingVertical:8}}>
          <Text>view all posts</Text>
          <FontAwesome5 name="long-arrow-alt-right" size={24} color="black" />
        </View>
      </View>

      
    </View>
    {user?.skills.length>0 && <View style={{backgroundColor:"white",marginTop:8,padding:8}}>
    <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between",gap:6}}>
    <Text style={{fontSize:20,fontWeight:"600"}}>Skills</Text>
    {loggedinUserId==userId && <Fontisto onPress={()=>router.push(`/(tabs)/home/skill/${userId}`)} name="plus-a" size={20} color="black" />}
    </View>
       
       <View style={{gap:4,marginTop:8}}>
       {user?.skills.map((skill,index)=>(
        <Text key={index} style={{fontSize:16,fontWeight:"500"}}>{skill.title}</Text>
       ))}
       </View>
       
      </View>}
      
    </ScrollView>
  )
}

export default profile

const styles = StyleSheet.create({})