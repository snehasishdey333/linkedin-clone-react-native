import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { registerValidation } from '../../schemas/schema';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = () => {
    const router=useRouter()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [errors,setErrors]=useState({})
 
  
    const handleSubmit = async () => {
      try {
        
        await registerValidation.validate({ name, email, password }, { abortEarly: false });
        const response = await axios.post('http://localhost:5001/api/auth/register', { name:name, email:email, password:password });
        const token=response.data
        AsyncStorage.setItem("token",token)
        Alert.alert('Success', 'Registration successful');
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
          Alert.alert('Error', 'Registration failed. Please try again later.');
        }
      }
    };

    
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
            Register your account
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
              value={name}
              onChangeText={(text)=>setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 18,
              }}
              placeholder="enter your Name"
            />
          </View>
          {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
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
                placeholder="enter your email"
              />
            </View>
            {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
          </View>

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
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default register

const styles = StyleSheet.create({})