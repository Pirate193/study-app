import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AuthGuard({children}:{children:ReactNode}) {
    const {user,isInitialized} = useAuthStore()
    const segments = useSegments()
    const router =useRouter()

    useEffect(()=>{
        console.log('Authguard:',{user,segments,isInitialized})
        if(!isInitialized) return
        const inAuthGroup = segments[0]==='(auth)'

        if(!user && !inAuthGroup){
            //redirect to signin if not authenticated
            setTimeout(() => router.replace('/(auth)/signin'), 0);

        }else if (user && inAuthGroup){
            //redirect to  main app 
            setTimeout(() => router.replace('/(tabs)'), 0);
          
        }
    },[user,isInitialized,segments])

    if(!isInitialized){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
    return<>{children}</>
}