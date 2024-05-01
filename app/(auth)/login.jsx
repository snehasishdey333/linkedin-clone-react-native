import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { loginValidation } from '../../schemas/schema';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = () => {
    const router=useRouter()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [errors, setErrors] = useState({});
    
    const handleSubmit=async()=>{
      try {
        
        await loginValidation.validate({ email, password }, { abortEarly: false });
        const response = await axios.post('http://localhost:5001/api/auth/login', { email:email, password:password });
        const token=response.data
        AsyncStorage.setItem("token",token)
        Alert.alert('Success', 'Login successful');
        router.push("/(tabs)/home")
      } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
          const errors = {};
          error.inner.forEach(validationError => {
            errors[validationError.path] = validationError.message;
          });
          setErrors(errors);
        } else {
          Alert.alert('Error', 'Login failed. Please try again later.');
        }
      }
    }

    useEffect(()=>{
      const checkLoginStatus=async()=>{
        try{
           const token=await AsyncStorage.getItem("token")
           if(token){
            router.replace("/(tabs)/home")
            // router.push("/(tabs)/post/[postId]")
           }
        }
        catch(error){
          console.log(error)
        }
      }
      checkLoginStatus()
    },[])

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={require('../../assets/linkedin.png')}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Log in to your Account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text)=>setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 18,
              }}
              placeholder="enter your Email"
            />
            
          </View>
          {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="gray"
              />
              <TextInput
                value={password}
                onChangeText={(text)=>setPassword(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: 18,
                }}
                placeholder="enter your Password"
              />
              
            </View>
            {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
          </View>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged in</Text>

            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 80 }} />

          <Pressable
            onPress={handleSubmit}
            style={{
              width: 200,
              backgroundColor: "#0072b1",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({})