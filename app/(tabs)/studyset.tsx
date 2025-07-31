import CreateStudySetModal from '@/components/CreateStudySetModal'
import FloatingActionButton from '@/components/FloatingActionButton'
import StudyList from '@/components/StudyList'
import { darkTheme } from '@/lib/color'
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Studyset = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(()=>{
    getCurrentUser();
  },[] )

  const getCurrentUser = async () => {
    try{
      const{data:{user}}=await supabase.auth.getUser();
      setCurrentUser(user);
    }catch(error){
      console.error('Error fetching current user:', error);
    }
  };

  const handleCreateSuccess = () => {
    setRefreshKey(prev=> prev + 1); // Increment the key to refresh the list
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={darkTheme.background } />
      <View style={{ flex: 1, padding: 16 }}>
         <StudyList key={refreshKey} />
         <FloatingActionButton onPress={()=>setShowCreateModal(true)} 
          icon='+'
          disabled={!currentUser}
          />
      </View>
      {currentUser &&(
         <CreateStudySetModal 
          visible={showCreateModal}
          onClose={()=>setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          userId={currentUser.id}
         />
      )}
      
      
      
    </SafeAreaView>
  )
}

export default Studyset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
})