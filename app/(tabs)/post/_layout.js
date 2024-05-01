import { Stack } from "expo-router";

export default function PostLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="[postId]"/>

        </Stack>
    )
}