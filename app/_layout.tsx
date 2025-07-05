import { useAuthStore } from "@/store/authStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const initialize = useAuthStore((state)=> state.initialize)

  useEffect(()=>{
    initialize()
  },[])
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="(auth)"/>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  )
}
