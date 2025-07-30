import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


const StudySetScreen = () => {
    const { id } = useLocalSearchParams()
  return (
    <View  className='bg-primary p-2 m-2' >
      <Text className='font-bold text-white' > get details of user {id} </Text>
      
    </View>
  )
}

export default StudySetScreen

const styles = StyleSheet.create({})