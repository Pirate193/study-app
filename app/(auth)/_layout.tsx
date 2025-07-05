import { Stack } from "expo-router";

export default function AAuthLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="signin"/>
          <Stack.Screen name="signup"/>
        </Stack>
    )
}