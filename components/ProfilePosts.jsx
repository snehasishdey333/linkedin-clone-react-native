import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { convertTime } from '../utils'
import { useRouter } from 'expo-router'

const ProfilePosts = ({post,user}) => {
  const router=useRouter()
  return (
    <View style={{width:"100%", padding: 8 ,backgroundColor:"white",marginVertical:4}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:10}}>
        {user?.profilePicture ? <Image
          source={{
            uri: user?.profilePicture,
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
        <View>
          <Text style={{fontWeight:"700",fontSize:18}}>{user?.name}</Text>
          {user?.bio && <Text style={{color:"gray"}}>{user?.bio}</Text>}
          <Text style={{color:"gray"}}>{convertTime(post?.createdAt)}</Text>
        </View>
      </View>
      
      <Pressable onPress={()=>router.push(`/post/${post?._id}`)}>
      <Text style={{fontSize:16,marginTop:4}}>
        {post?.caption}
      </Text>
      {post?.image.length>0 && <Image
          source={{
            uri: post?.image[0],
          }}
          style={{marginVertical:8, height: 300, width: "100%", marginBottom: 8 }}
        />}
      </Pressable>
      </View>
  )
}

export default ProfilePosts

const styles = StyleSheet.create({})