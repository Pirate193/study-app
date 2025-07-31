import StudyCard, { StudySet } from '@/components/StudyCard';
import { dark } from '@/lib/color';
import { supabase } from '@/lib/supabase';
import { getUserStudySets } from '@/lib/supabasefunctions';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';



const StudyList = () => {
  const [studySets, setStudySets] =useState<StudySet[]>([]);
  const [loading, setLoading] =useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  //get curreent user 
  // This function should be implemented to fetch the current user
  useEffect(()=>{
    getCurrentUser();
  },[])

  // Fetch study sets from the database
   const getCurrentUser = async ()=>{
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
   };

   //load study sets when user is available 
   useEffect(()=>{
    if (currentUser){
      loadStudysets();
    }
   } ,[currentUser]);
    
   const loadStudysets =async()=>{
    if(!currentUser ) return;
    setLoading(true);
    try{
      const { studySets: data,error} = await getUserStudySets(currentUser.id);
      if (error){
        console.error('Error fetching study sets:', error);
      }else{
        setStudySets(data);
      }

    }catch (error){
      console.error('Error fetching study sets:', error);
    }finally{
      setLoading(false);
    }
   };

   const onRefresh = async () => {
    setRefreshing(true);
    await loadStudysets();
    setRefreshing(false);
  };

  if(loading){
    return (
      <View style={styles.centered}> 
        <Text style={styles.loadingtext} >Loading your study sets...</Text>
      </View>
    )
  }
  if (studySets.length === 0){
    return (
      <View style={styles.centered}> 
       
        <Text style={styles.emptyText}>No study sets yet</Text>
        <Text style={styles.emptySubtext}>Create your first study set to get started</Text>
        
      </View>
    )
  }
  

  return (
    <FlatList 
    data={studySets}
    keyExtractor={(item=>(item.id))}
    renderItem={(item)=>(
        <StudyCard
         studySet={item.item}
            onPress={() => router.push(`/studyset/${item.item.id}`)}
        
        />
    )}
    refreshControl={
      <RefreshControl 
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={dark.text}
      />
    }
    contentContainerStyle={studySets.length === 0 ? styles.centered : undefined}
    
    />
  )
}

export default StudyList

const styles = StyleSheet.create({
  centered:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingtext: {
    color: dark.text,
    fontSize: 16,
   
  },
  emptyText: {
    color: dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: dark.text,
    fontSize: 16,
    textAlign: 'center',
   
  },
})