import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
         padding:30
      }}
    >
      <View style={{backgroundColor: 'red',
       borderRadius:10,
       padding:5,
       marginBottom:10
      }}>
          <Text>fuck you</Text>
      </View>
      <View style={{backgroundColor: 'red',
       borderRadius:10,
       padding:30
      }}>
          <Text>fuck you</Text>
      </View>
    </View>
  );
}
