import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import UserCard from "../../../components/UserCard";
import { AntDesign } from '@expo/vector-icons';
import ConnectionRequestCard from "../../../components/ConnectionRequestCard";
import { dummyUsers } from "../../../data/data";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const index = () => {

  const router=useRouter()
  const [userId,setUserId]=useState()
  const [users,setUsers]=useState([])
  const [requests,setRequests]=useState([])

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
       const fetchRequests=async()=>{
        try{
           const response=await axios.get(`http://localhost:5001/api/user/requests/${userId}`)
           setRequests(response.data.users)
        }
        catch(err){
          console.log(err)
        }
       }
       fetchRequests()
    }
  },[userId])

  useEffect(()=>{
    if(userId){
       const fetchUsers=async()=>{
        try{
           const response=await axios.get(`http://localhost:5001/api/user/users/${userId}`)
           setUsers(response.data.users)
        }
        catch(err){
          console.log(err)
        }
       }
       fetchUsers()
    }
  },[userId])
  
  
  return (
    <ScrollView style={{ flex: 1,backgroundColor:"#ECECEC" }}>
      <Navbar />
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"white",marginVertical:8,padding:8}}>
        <View style={{}}>
          <Text style={{fontSize:16}}>Invitations ({requests.length})</Text>
        </View>
        <AntDesign name="arrowright" size={24} color="black" />
      </View>

      <View style={{marginBottom:8,gap:4}}>
        {requests.map((request,index)=>(
          <ConnectionRequestCard key={index} props={request} userId={userId} setRequests={setRequests} requests={requests}/>
        ))}
      </View>

      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"white",marginBottom:8,padding:8}}>
        <Text style={{fontSize:16}}>Manage my network</Text>
        <AntDesign onPress={()=>router.push(`/network/connections/${userId}`)} name="arrowright" size={24} color="black" />
      </View>

      <View style={{backgroundColor:"white",paddingBottom:16}}>
        <Text style={{paddingHorizontal:8,fontSize:16,paddingVertical:8}}>People you may know</Text>
        <FlatList
        scrollEnabled={false}
        data={users}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => <UserCard key={index} userId={userId} props={item} />}
      />
      </View>
      
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
