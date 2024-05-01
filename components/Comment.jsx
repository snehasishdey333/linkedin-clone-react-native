import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { convertTime } from '../utils'


const Comment = ({props}) => {
  
  
  return (
    <View style={{flexDirection:"row",alignItems:"flex-start",gap:12,marginVertical:8}}>
      {props.user.profilePicture ? <Image
          source={{
            uri: props?.user.profilePicture,
          }}
          style={{ height: 50, width: 50, borderRadius: 75, marginBottom: 8 }}
        />:
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={{ height: 60, width: 60, borderRadius: 75, marginBottom: 8 }}
        />}
        <View style={{backgroundColor:"#ECECEC",borderRadius:8,padding:8,width:340}}>
          <Text style={{fontWeight:"700",fontSize:16}}>{props?.user.name}</Text>
          <Text style={{fontSize:14,color:"gray"}}>{props?.user.bio}</Text>
          <Text style={{fontSize:14,color:"gray"}}>{convertTime(props?.createdAt)}</Text>
          <Text style={{fontSize:15}}>{props.text}</Text>
        </View>
      </View>
  )
}

export default Comment

const styles = StyleSheet.create({})