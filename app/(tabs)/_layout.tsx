import AuthGuard from "@/components/AuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
export default function TabsLayout(){
    return(
     <AuthGuard>
        <Tabs screenOptions={({route})=>({
             headerShown:false,
             tabBarActiveTintColor:"#2563eb",
             tabBarInactiveTintColor:"#94a#b8",
             tabBarStyle:{
                backgroundColor:"#fff",
                borderTopWidth:1,
                borderColor:"#e5e7eb",
                height: 60,
                paddingBottom:5,
             },
             tabBarIcon:({color,size})=> {
              let iconName: keyof typeof Ionicons.glyphMap ="home";
              switch(route.name){
                case "index":
                    iconName="home-outline";
                break;
                case "studyset":
                  iconName="book-outline";
                break;
                case "library":
                    iconName="document-text-outline";
                break;
                case "schedule":
                    iconName="calendar-outline";
                break;
                case "profile":
                    iconName="person-outline";
                break;
                default:
                    iconName="ellipse-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
             },
        })} >
            <Tabs.Screen name="index" options={{title:"Home"}} />
            <Tabs.Screen name="studyset" options={{title:"Study Set" }} />
            <Tabs.Screen name="library" options={{title:"Library" }} />
            <Tabs.Screen name="schedule" options={{title:"Schedule" }} />
            <Tabs.Screen name="profile" options={{ title:"Profile" }} />
        </Tabs>
     </AuthGuard>
    )
}