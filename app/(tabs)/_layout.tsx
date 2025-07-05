import AuthGuard from "@/components/AuthGuard"
import { Tabs } from "expo-router"
export default function TabsLayout(){
    return(
     <AuthGuard>
        <Tabs>
            <Tabs.Screen name="index" options={{headerShown:false}}/>
            <Tabs.Screen name="profile" options={{headerShown:false}}/>
        </Tabs>
     </AuthGuard>
    )
}