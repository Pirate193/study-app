// lib/add-material-handlers.ts
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { createFlashcard, createNote, uploadFile } from './supabasefunctions';

// Handle file upload
export const handleFileUpload = async (
  studySetId: string,
  userId: string,
  onSuccess: () => void
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*', 'text/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      
      // Show loading state here if needed
      Alert.alert('Uploading', 'Please wait while we upload your file...');
      
      const { file: uploadedFile, error } = await uploadFile(studySetId, userId, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });

      if (error) {
        Alert.alert('Error', 'Failed to upload file. Please try again.');
        return;
      }

      Alert.alert('Success', 'File uploaded successfully!');
      onSuccess();
    }
  } catch (error) {
    console.error('File upload error:', error);
    Alert.alert('Error', 'Failed to upload file. Please try again.');
  }
};

// Handle manual note creation
export const handleCreateNote = (
  studySetId: string,
  userId: string,
  onSuccess: () => void
) => {
  Alert.prompt(
    'Create Note',
    'Enter note title:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async (title) => {
          if (!title || title.trim() === '') {
            Alert.alert('Error', 'Please enter a title for your note.');
            return;
          }

          try {
            const { note, error } = await createNote(
              studySetId,
              userId,
              title.trim(),
              '' // Empty content initially
            );

            if (error) {
              Alert.alert('Error', 'Failed to create note. Please try again.');
              return;
            }

            Alert.alert('Success', 'Note created successfully!');
            onSuccess();
          } catch (error) {
            console.error('Create note error:', error);
            Alert.alert('Error', 'Failed to create note. Please try again.');
          }
        },
      },
    ],
    'plain-text'
  );
};

// Handle manual flashcard creation
export const handleCreateFlashcard = (
  studySetId: string,
  userId: string,
  onSuccess: () => void
) => {
  Alert.prompt(
    'Create Flashcard',
    'Enter the question:',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Next',
        onPress: (question) => {
          if (!question || question.trim() === '') {
            Alert.alert('Error', 'Please enter a question.');
            return;
          }

          Alert.prompt(
            'Create Flashcard',
            'Enter the answer:',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Create',
                onPress: async (answer) => {
                  if (!answer || answer.trim() === '') {
                    Alert.alert('Error', 'Please enter an answer.');
                    return;
                  }

                  try {
                    const { flashcard, error } = await createFlashcard(
                      studySetId,
                      userId,
                      question.trim(),
                      answer.trim()
                    );

                    if (error) {
                      Alert.alert('Error', 'Failed to create flashcard. Please try again.');
                      return;
                    }

                    Alert.alert('Success', 'Flashcard created successfully!');
                    onSuccess();
                  } catch (error) {
                    console.error('Create flashcard error:', error);
                    Alert.alert('Error', 'Failed to create flashcard. Please try again.');
                  }
                },
              },
            ],
            'plain-text'
          );
        },
      },
    ],
    'plain-text'
  );
};

// Handle AI flashcard generation (placeholder)
export const handleAIFlashcardGeneration = (
  studySetId: string,
  userId: string,
  onSuccess: () => void
) => {
  Alert.alert(
    'AI Flashcard Generation',
    'This feature will be available soon! You can create flashcards manually for now.',
    [{ text: 'OK' }]
  );
};

// Handle scan material (placeholder)
export const handleScanMaterial = (
  studySetId: string,
  userId: string,
  onSuccess: () => void
) => {
  Alert.alert(
    'Scan Material',
    'This feature will be available soon! You can upload files manually for now.',
    [{ text: 'OK' }]
  );
};