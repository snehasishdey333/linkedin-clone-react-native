import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

const addSkill = () => {
    const router=useRouter()
    const {userId}=useLocalSearchParams()
    
    const [skill,setSkill]=useState("")
    const handleAddSkill=async()=>{
      try{
        await axios.post(`http://localhost:5001/api/skill/create/${userId}`,{
          title:skill
        })
        router.push(`/(tabs)/home/profile/${userId}`)
      }
      catch(err){
        console.log(err)
      }
    }
    

  return (
    <View style={{flex:1,backgroundColor:"white",padding:8}}>
    
    <Entypo onPress={()=>router.replace("/home/profile")} name="cross" size={26} color="black" />
      <Text style={{fontSize:20,fontWeight:"500",marginVertical:8}}>Add Skill</Text>
      <TextInput value={skill} onChangeText={(text)=>setSkill(text)} style={{borderBottomWidth:2,borderColor:"#ECECEC",marginHorizontal:8,padding:4,marginVertical:8}} placeholder=''/>
    

    <Pressable onPress={handleAddSkill} style={{alignItems:"center",justifyContent:"center",paddingVertical:10,backgroundColor:"#0077b5",borderRadius:16,marginTop:20}}>
        <Text style={{color:"white",fontWeight:"600"}}>Save</Text>
    </Pressable>
      
    </View>
  )
}

export default addSkill

const styles = StyleSheet.create({})