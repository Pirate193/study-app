import { dark, darkTheme } from '@/lib/color';
import { createStudySet } from '@/lib/supabasefunctions';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Props ={
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
};

const CreateStudySetModal = ({visible , onClose,  onSuccess,userId}:Props) => {
    const [title,setTitle]= useState('');
    const [description,setDescription]= useState('');
    const [loading,setLoading]= useState(false);


   const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your study set.');
      return;
    }

    setLoading(true);

    try {
      const { studySet, error } = await createStudySet(
        userId,
        title.trim(),
        description.trim() || undefined
      );

      if (error) {
        Alert.alert('Error', 'Failed to create study set. Please try again.');
        return;
      }

      Alert.alert('Success', 'Study set created successfully!');
      setTitle('');
      setDescription('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Create study set error:', error);
      Alert.alert('Error', 'Failed to create study set. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>New Study Set</Text>
              <TouchableOpacity 
                onPress={handleCreate} 
                disabled={loading || !title.trim()}
                style={[
                  styles.createButton,
                  (!title.trim() || loading) && styles.createButtonDisabled
                ]}
              >
                <Text style={[
                  styles.createButtonText,
                  (!title.trim() || loading) && styles.createButtonTextDisabled
                ]}>
                  {loading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter study set title"
                  placeholderTextColor={darkTheme.textSecondary}
                  maxLength={100}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter a brief description"
                  placeholderTextColor={darkTheme.textSecondary}
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                />
              </View>

     
              <Text style={styles.helpText}>
                Add study materials like PDFs, notes, and flashcards after creating your study set.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

export default CreateStudySetModal

const styles = StyleSheet.create({
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: dark.bg,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: dark.bglight,
  },
  cancelButton: {
    color: darkTheme.textSecondary,
    fontSize: 16,
  },
  title: {
    color: dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonDisabled: {
    backgroundColor: darkTheme.textSecondary,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: '#999',
  },
  form: {
    flex: 1,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: dark.bglight,
    borderRadius: 8,
    padding: 16,
    color: dark.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    color: darkTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
  },
})
