import StudyList from '@/components/StudyList'
import { darkTheme } from '@/lib/color'
import React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const studyset = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar  />
      <StudyList />
    </SafeAreaView>
  )
}

export default studyset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
})