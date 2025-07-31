// app/studyset/[id].tsx
import { StudySet } from '@/components/StudyCard';
import {
  handleAIFlashcardGeneration,
  handleCreateFlashcard,
  handleCreateNote,
  handleFileUpload,
  handleScanMaterial,
} from '@/lib/addmaterialhandlers';
import { dark, darkTheme } from '@/lib/color';
import { supabase } from '@/lib/supabase';
import {
  DbFile,
  DbFlashcard,
  DbNote,
  getFiles,
  getFlashcards,
  getNotes,
  getStudySetById
} from '@/lib/supabasefunctions';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Import types from supabase functions
type Note = DbNote;
type Flashcard = DbFlashcard;
type File = DbFile;

const StudySetScreen = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'material' | 'study-plan'>('material');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  // Load data when user is available
  useEffect(() => {
    if (currentUser && id) {
      loadStudySetData();
    }
  }, [id, currentUser]);

  const loadStudySetData = async () => {
    if (!currentUser || !id) return;
    
    setLoading(true);
    
    try {
      // Load study set details
      const { studySet: studySetData, error: studySetError } = await getStudySetById(
        id as string, 
        currentUser.id
      );
      
      if (studySetError) {
        Alert.alert('Error', 'Failed to load study set');
        setLoading(false);
        return;
      }

      // Load all related data in parallel
      const [notesResult, flashcardsResult, filesResult] = await Promise.all([
        getNotes(id as string, currentUser.id),
        getFlashcards(id as string, currentUser.id),
        getFiles(id as string, currentUser.id),
      ]);

      if (notesResult.error) {
        console.error('Error loading notes:', notesResult.error);
      }
      if (flashcardsResult.error) {
        console.error('Error loading flashcards:', flashcardsResult.error);
      }
      if (filesResult.error) {
        console.error('Error loading files:', filesResult.error);
      }

      // Update state
      setStudySet(studySetData);
      setNotes(notesResult.notes);
      setFlashcards(flashcardsResult.flashcards);
      setFiles(filesResult.files);
      
    } catch (error) {
      console.error('Error loading study set data:', error);
      Alert.alert('Error', 'Failed to load study set data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !studySet) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: studySet.title,
          headerStyle: { backgroundColor: dark.bg },
          headerTintColor: dark.text,
        }} 
      />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'material' && styles.activeTab]}
          onPress={() => setActiveTab('material')}
        >
          <Text style={[styles.tabText, activeTab === 'material' && styles.activeTabText]}>
            Material
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'study-plan' && styles.activeTab]}
          onPress={() => setActiveTab('study-plan')}
        >
          <Text style={[styles.tabText, activeTab === 'study-plan' && styles.activeTabText]}>
            Study Plan
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'material' && (
        <ScrollView style={styles.content}>
          {/* All Topics Dropdown */}
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>📋 All topics</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Flashcards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flashcards {flashcards.length}</Text>
            {flashcards.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📚</Text>
                <Text style={styles.emptyTitle}>No flashcards yet</Text>
                <Text style={styles.emptyDescription}>
                  Create your first one to begin your journey to memorization mastery.
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => handleCreateFlashcard(id as string, currentUser.id, loadStudySetData)}
                  >
                    <Text style={styles.primaryButtonText}>✏️ Create manually</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => handleAIFlashcardGeneration(id as string, currentUser.id, loadStudySetData)}
                  >
                    <Text style={styles.secondaryButtonText}>🤖 Generate with AI</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Render flashcards here
              flashcards.map((flashcard) => (
                <View key={flashcard.id} style={styles.itemCard}>
                  <Text style={styles.itemTitle}>{flashcard.question}</Text>
                </View>
              ))
            )}
          </View>

          {/* Files Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Files {files.length}</Text>
            {files.map((file) => (
              <TouchableOpacity key={file.id} style={styles.fileItem}>
                <View style={styles.fileIcon}>
                  <Text style={styles.fileIconText}>PDF</Text>
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.filePages}>2 pages</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>⋯</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes {notes.length}</Text>
            {notes.map((note) => (
              <TouchableOpacity key={note.id} style={styles.noteItem}>
                <View style={styles.noteAvatar}>
                  <Text style={styles.noteAvatarText}>📝</Text>
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteName}>{note.title}</Text>
                  <Text style={styles.noteAuthor}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>⋯</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {activeTab === 'study-plan' && (
        <View style={styles.content}>
          <Text style={styles.comingSoon}>Study Plan coming soon...</Text>
        </View>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fab}>
        <TouchableOpacity 
          style={[styles.addButton, !currentUser && styles.disabledButton]}
          onPress={() => setShowAddModal(true)}
          disabled={!currentUser}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>▶️ Start learning</Text>
        </TouchableOpacity>
      </View>

      {/* Add Material Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add material</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                if (!currentUser) return;
                setShowAddModal(false);
                handleAIFlashcardGeneration(id as string, currentUser.id, loadStudySetData);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.optionIconText}>🤖</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Generate flashcards with AI</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                if (!currentUser) return;
                setShowAddModal(false);
                handleCreateFlashcard(id as string, currentUser.id, loadStudySetData);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.optionIconText}>📋</Text>
              </View>
              <Text style={styles.optionTitle}>Create flashcards manually</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                if (!currentUser) return;
                setShowAddModal(false);
                handleScanMaterial(id as string, currentUser.id, loadStudySetData);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.optionIconText}>📷</Text>
              </View>
              <Text style={styles.optionTitle}>Scan material</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                if (!currentUser) return;
                setShowAddModal(false);
                handleFileUpload(id as string, currentUser.id, loadStudySetData);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.optionIconText}>📁</Text>
              </View>
              <Text style={styles.optionTitle}>Upload a file</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                if (!currentUser) return;
                setShowAddModal(false);
                handleCreateNote(id as string, currentUser.id, loadStudySetData);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#10B981' }]}>
                <Text style={styles.optionIconText}>📝</Text>
              </View>
              <Text style={styles.optionTitle}>Create a note</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.bg,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: dark.text,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: dark.bglight,
    margin: 16,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: dark.bg,
  },
  tabText: {
    color: darkTheme.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: dark.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: dark.bglight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownText: {
    color: dark.text,
    fontSize: 16,
  },
  dropdownArrow: {
    color: darkTheme.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: dark.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: dark.bglight,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: darkTheme.textSecondary,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    color: dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    color: darkTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: dark.text,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: dark.bg,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: dark.bglight,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileIconText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  filePages: {
    color: darkTheme.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: dark.bglight,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noteAvatarText: {
    fontSize: 16,
  },
  noteInfo: {
    flex: 1,
  },
  noteName: {
    color: dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  noteAuthor: {
    color: darkTheme.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    color: darkTheme.textSecondary,
    fontSize: 16,
  },
  itemCard: {
    backgroundColor: dark.bglight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    color: dark.text,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: dark.text,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: dark.bg,
    fontSize: 24,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: dark.bglight,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: darkTheme.textSecondary,
  },
  comingSoon: {
    color: darkTheme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: dark.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: dark.text,
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    color: darkTheme.textSecondary,
    fontSize: 18,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: dark.bglight,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 16,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionTitle: {
    color: dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  recommendedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recommendedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  arrow: {
    color: darkTheme.textSecondary,
    fontSize: 18,
  },
});

export default StudySetScreen;
