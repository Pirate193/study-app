import { darkTheme } from '@/lib/color';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type StudySet = {
  id: string;
  title: string;
  description: string;
  course: string;
  notesCount: number;
  flashcardCount: number;
  pdfCount: number;
  createdBy?: string;
};

type Props = {
  studySet: StudySet;
  onPress: () => void;
};

const StudyCard = ({studySet,onPress}:Props) => {
  return (
    <TouchableOpacity  style={styles.card} onPress={onPress} >
            <Text style={styles.title}>{studySet.title} </Text>
            <Text style={[styles.course,{color:darkTheme.text}]} >{studySet.course} </Text>
            <Text style={[styles.description,{color:darkTheme.text}]}>{studySet.description}</Text>
     <View style={styles.stats} >
        <Text style={{color:darkTheme.textSecondary,fontSize:14}}>Notes: {studySet.notesCount}</Text>
        <Text style={{color:darkTheme.textSecondary,fontSize:14}}>Flashcards: {studySet.flashcardCount}</Text>
        <Text style={{color:darkTheme.textSecondary,fontSize:14}}>PDFs: {studySet.pdfCount}</Text>
      
      <Text style={[styles.owner, { color: darkTheme.textSecondary }]}>
        👤 {studySet.createdBy || "You"}
      </Text>

     </View>
      
       
    </TouchableOpacity>
  )
}

export default StudyCard

const styles = StyleSheet.create({
    card:{
        backgroundColor:darkTheme.card,
        padding: 16,
        borderRadius: 8,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title:{
        fontSize:18,
        color:darkTheme.text,
        fontWeight:'600',
    },
    course:{
        fontSize:14,
        marginTop:4,
    },
    description:{
        fontSize:14,
        marginTop:4,
    },
    stats:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:8,
        
    },
    owner:{
        fontSize: 11,
    textAlign: "right",
    }
})