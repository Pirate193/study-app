import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AuthGuard({children}:{children:ReactNode}) {
    const {user,isInitialized} = useAuthStore()
    const segments = useSegments()
    const router =useRouter()

    useEffect(()=>{
        if(!isInitialized) return
        const inAuthGroup = segments[0]==='(auth)'

        if(!user && !inAuthGroup){
            //redirect to signin if not authenticated
            router.replace('/(auth)/signin')

        }else if (user && inAuthGroup){
            //redirect to  main app 
            router.replace('/(tabs)')
        }
    },[user,isInitialized,segments])

    if(!isInitialized){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
    return<>{children} </>
}