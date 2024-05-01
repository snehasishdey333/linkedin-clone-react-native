import { Stack } from "expo-router";

export default function NetworkLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="connections/[userId]"/>
        </Stack>
    )
}