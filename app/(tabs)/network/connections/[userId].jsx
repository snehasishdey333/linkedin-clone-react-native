import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const connections = () => {
  const router=useRouter()
  const { userId } = useLocalSearchParams();
  const [users,setUsers]=useState([])

  useEffect(()=>{
    const fetchConnections=async()=>{
       try{
          const response=await axios.get(`http://localhost:5001/api/user/connections/${userId}`)
          setUsers(response.data.connections)
       }
       catch(err){
        console.log(err)
       }
    }
    fetchConnections()
  },[userId])

  return (
    <ScrollView style={{flex:1,backgroundColor:"white"}}>
      <View style={{height:40,backgroundColor:"white",padding:8}}>
      <Ionicons onPress={()=>router.push("/network")} name="arrow-back" size={24} color="black" />
      </View>
       <Text style={{margin:8,fontSize:20,fontWeight:"600"}}>Connections</Text>
       {users.map((user,index)=>(
        <View key={index}>
        <Pressable onPress={()=>router.push(`/(tabs)/home/profile/${user._id}`)} style={{paddingHorizontal:16,paddingVertical:8,flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"white"}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
      {user.profilePicture ? <Image
          source={{
            uri: user.profilePicture,
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
          <Text style={{fontSize:18,fontWeight:"600"}}>{user.name}</Text>
         {user.bio &&  <Text style={{color:"gray"}}>{user.bio}</Text>}
        </View>
      </View>

      <MaterialCommunityIcons name="message-text-outline" size={24} color="black" />
    </Pressable>
        </View>
       ))}
       

    </ScrollView>
  )
}

export default connections

const styles = StyleSheet.create({})