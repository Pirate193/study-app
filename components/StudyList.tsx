import StudyCard, { StudySet } from '@/components/StudyCard';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

const studySets: StudySet[] = [
  {
    id: "1",
    title: "Data Structures",
    description: "All key concepts and diagrams.",
    course: "Computer Science",
    notesCount: 5,
    flashcardCount: 12,
    pdfCount: 2,
    createdBy: "Patrick",
  },
    {
        id: "2",
        title: "Machine Learning Basics",
        description: "Introduction to ML algorithms.",
        course: "Artificial Intelligence",
        notesCount: 3,
        flashcardCount: 8,
        pdfCount: 1,
        createdBy: "Alice",
    },
    {
        id: "3",
        title: "Web Development Fundamentals",
        description: "HTML, CSS, and JavaScript basics.",
        course: "Web Development",
        notesCount: 4,
        flashcardCount: 10,
        pdfCount: 0,
        createdBy: "Bob",
    },
    {
        id: "4",
        title: "Database Management Systems",
        description: "SQL and NoSQL databases.",
        course: "Database Systems",
        notesCount: 6,
        flashcardCount: 15,
        pdfCount: 3,
        createdBy: "Charlie",
    },
    {
        id: "5",
        title: "Operating Systems Concepts",
        description: "Processes, threads, and memory management.",
        course: "Operating Systems",  
        notesCount: 2,
        flashcardCount: 5,
        pdfCount: 1,
        createdBy: "David",
        
    }
  
];

const StudyList = () => {
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
    
    />
  )
}

export default StudyList

const styles = StyleSheet.create({})