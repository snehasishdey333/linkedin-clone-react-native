import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import "core-js/stable/atob";
import axios from 'axios'
import HomePost from '../../../components/Post'

const index = () => {
  const [userId,setUserId]=useState()
  const [user,setUser]=useState()
  const [posts,setPosts]=useState([])
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
       const fetchPosts=async()=>{
         try{
            const response=await axios.get(`http://localhost:5001/api/post/all/${userId}`)
            setPosts(response.data)
         }
         catch(err){
          console.log(err)
         }
       }
       fetchPosts()
    }
  },[userId])

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
    <ScrollView>
      <Navbar/>
      {posts?.reverse().map((post,index)=>(
        <HomePost props={post} key={index}/>
      ))}
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})