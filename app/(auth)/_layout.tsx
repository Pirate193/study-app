import { useAuthStore } from "@/store/authStore";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout(){
  const user = useAuthStore(state => state.user);

  if(user){
    return <Redirect href='/(tabs)' />
  }
    return (
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="signin"/>
          <Stack.Screen name="signup"/>
        </Stack>
    )
}