import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "../../../../components/Navbar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

const searchResults = () => {
  
  const { query } = useLocalSearchParams();
  const [users, setUsers] = useState([]);
  const router=useRouter()
  const [loading,setLoading]=useState(false)
  
  useEffect(() => {
    
    const searchUsers = async (query) => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/search/${query}`
        );
        setUsers(response.data);
        setLoading(false)
        
      } catch (err) {
        setLoading(true)
        console.log(err);
      }
    };
    searchUsers(query);
  }, [query]);

  if(loading){
    return <ActivityIndicator/>
  }


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "whit" }}>
      <Navbar />
      <FlatList
      scrollEnabled={false}
        data={users}
        keyExtractor={(user) => user._id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={()=>router.push(`/(tabs)/home/profile/${item._id}`)} style={{paddingHorizontal:16,paddingVertical:8,flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"white"}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
      {item?.profilePicture ? <Image
          source={{
            uri: item?.profilePicture,
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
          <Text style={{fontSize:18,fontWeight:"600"}}>{item?.name}</Text>
          <Text style={{color:"gray"}}>{item?.bio}</Text>
        </View>
      </View>

      
    </Pressable>
          
        )}
      />
     
    </ScrollView>
  );
};

export default searchResults;

const styles = StyleSheet.create({});


