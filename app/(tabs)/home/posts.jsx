import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Post from '../../../components/Post'

const posts = () => {
    const router=useRouter()
  return (
    <ScrollView style={{flex:1,backgroundColor:"white",padding:8}}>
      <Entypo onPress={()=>router.replace("/home/profile")} name="cross" size={26} color="black" />
      <Text style={{fontSize:20,fontWeight:"500",marginVertical:8}}>My posts</Text>
      <View>
        <Post/>
        <Post/>
        <Post/>
        <Post/>
      </View>
    </ScrollView>
  )
}

export default posts

const styles = StyleSheet.create({})