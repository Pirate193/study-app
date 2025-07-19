import AuthGuard from "@/components/AuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout(){
    // This layout is used for the main app tabs
    // It will be rendered when the user is authenticated
    // and will show the main app tabs like Home, Study Set, Library, Schedule,
    // and Profile.
    // The AuthGuard component will check if the user is authenticated
    // and redirect to the sign-in page if not.
    return(
     <AuthGuard>
        <Tabs screenOptions={({route})=>({
             headerShown:false,
             tabBarActiveTintColor:"#3386ff",
             tabBarInactiveTintColor:"#999",
             tabBarStyle:{
                
                 height: Platform.OS === 'android' ? 60 : 80,
            paddingBottom: 10,
            paddingTop: 5,
            backgroundColor: '#000000',
            borderTopWidth: 0.5,
            borderTopColor: '#ccc',
             },
             tabBarIcon:({focused,color,size})=> {
              let iconName: keyof typeof Ionicons.glyphMap ="home";
              switch(route.name){
                case "index":
                    iconName = focused ? "home-sharp" : "home-outline";
                break ;
                case "studyset":
                  iconName= focused ? "book-sharp" : "book-outline";
                break;
                case "library":
                    iconName= focused ? "library-sharp" : "library-outline";
                break;
                case "schedule":
                    iconName= focused ? "calendar-sharp" : "calendar-outline";
                break;
                case "profile":
                    iconName= focused ? "person-sharp" : "person-outline";
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