import { Stack, Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function PageLayout(){
    return (
        <Tabs>
            <Tabs.Screen name="home" 
                options={{
                    tabBarLabel:"Home",
                    headerShown:false,
                    tabBarIcon:({focused})=> focused?
                    <Ionicons name="home-sharp" size={24} color="black" />:
                    <Ionicons name="home-outline" size={24} color="black" />
                }}
            />
            <Tabs.Screen name="post" 
                options={{
                    tabBarLabel:"Post",
                    headerShown:false,
                    tabBarIcon:({focused})=> focused?
                    <AntDesign name="plussquare" size={24} color="black" />:
                    <AntDesign name="plussquareo" size={24} color="black" />
                }}
            />
            <Tabs.Screen name="network" 
                options={{
                    tabBarLabel:"Network",
                    headerShown:false,
                    tabBarIcon:({focused})=> focused?
                    <MaterialIcons name="people" size={24} color="black" />:
                    <MaterialIcons name="people-outline" size={24} color="black" />
                }}
            />
        </Tabs>
    )
}