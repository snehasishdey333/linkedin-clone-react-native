import { Stack } from "expo-router";

export default function HomeLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="profile/[userId]"/>
            <Stack.Screen name="skill/[userId]"/>
            <Stack.Screen name="posts"/>
            <Stack.Screen name="editProfile/[userId]"/>
            <Stack.Screen name="search/[query]"/>
        </Stack>
    )
}