import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


const StudySetScreen = () => {
    const { id } = useLocalSearchParams()
  return (
    <View>
      <Text> {id} </Text>
    </View>
  )
}

export default StudySetScreen

const styles = StyleSheet.create({})