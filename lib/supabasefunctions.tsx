// lib/supabase-functions.ts
import { StudySet } from '@/components/StudyCard';
import { supabase } from '@/lib/supabase';

// Types based on your database schema
export type DbNote = {
  id: string;
  study_set_id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export type DbFlashcard = {
  id: string;
  study_set_id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type DbFile = {
  id: string;
  study_set_id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
};

export type DbStudySet = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
};

// Fetch study set with all related data
export const getStudySetById = async (studySetId: string, userId: string) => {
  try {
    // Get study set
    const { data: studySet, error: studySetError } = await supabase
      .from('study_sets')
      .select('*')
      .eq('id', studySetId)
      .eq('user_id', userId)
      .single();

    if (studySetError) throw studySetError;

    // Get notes count
    const { count: notesCount, error: notesError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('study_set_id', studySetId)
      .eq('user_id', userId);

    if (notesError) throw notesError;

    // Get flashcards count
    const { count: flashcardsCount, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('study_set_id', studySetId)
      .eq('user_id', userId);

    if (flashcardsError) throw flashcardsError;

    // Get files count
    const { count: filesCount, error: filesError } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('study_set_id', studySetId)
      .eq('user_id', userId);

    if (filesError) throw filesError;

    // Transform to StudySet format
    const transformedStudySet: StudySet = {
      id: studySet.id,
      title: studySet.title,
      description: studySet.description || '',
      course: 'General', // You might want to add course to your schema
      notesCount: notesCount || 0,
      flashcardCount: flashcardsCount || 0,
      pdfCount: filesCount || 0,
      createdBy: 'You',
    };

    return { studySet: transformedStudySet, error: null };
  } catch (error) {
    console.error('Error fetching study set:', error);
    return { studySet: null, error };
  }
};

// Fetch notes for a study set
export const getNotes = async (studySetId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('study_set_id', studySetId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { notes: data || [], error: null };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { notes: [], error };
  }
};

// Fetch flashcards for a study set
export const getFlashcards = async (studySetId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('study_set_id', studySetId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { flashcards: data || [], error: null };
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return { flashcards: [], error };
  }
};

// Fetch files for a study set
export const getFiles = async (studySetId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('study_set_id', studySetId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { files: data || [], error: null };
  } catch (error) {
    console.error('Error fetching files:', error);
    return { files: [], error };
  }
};

// Create a new note
export const createNote = async (
  studySetId: string,
  userId: string,
  title: string,
  content: string
) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        study_set_id: studySetId,
        user_id: userId,
        title,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return { note: data, error: null };
  } catch (error) {
    console.error('Error creating note:', error);
    return { note: null, error };
  }
};

// Create a new flashcard
export const createFlashcard = async (
  studySetId: string,
  userId: string,
  question: string,
  answer: string
) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        study_set_id: studySetId,
        user_id: userId,
        question,
        answer,
      })
      .select()
      .single();

    if (error) throw error;
    return { flashcard: data, error: null };
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return { flashcard: null, error };
  }
};

// Upload file (you'll need to set up Supabase Storage first)
export const uploadFile = async (
  studySetId: string,
  userId: string,
  file: {
    uri: string;
    name: string;
    type: string;
  }
) => {
  try {
    // First upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${studySetId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('study-files') // You need to create this bucket
      .upload(filePath, {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('study-files')
      .getPublicUrl(filePath);

    // Save file record to database
    const { data, error } = await supabase
      .from('files')
      .insert({
        study_set_id: studySetId,
        user_id: userId,
        name: file.name,
        url: publicUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return { file: data, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { file: null, error };
  }
};

// Get all study sets for a user
export const getUserStudySets = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('study_sets')
      .select(`
        *,
        notes(count),
        flashcards(count),
        files(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to StudySet format
    const studySets: StudySet[] = data?.map(set => ({
      id: set.id,
      title: set.title,
      description: set.description || '',
      course: 'General', // Add course field to your schema if needed
      notesCount: set.notes?.[0]?.count || 0,
      flashcardCount: set.flashcards?.[0]?.count || 0,
      pdfCount: set.files?.[0]?.count || 0,
      createdBy: 'You',
    })) || [];

    return { studySets, error: null };
  } catch (error) {
    console.error('Error fetching study sets:', error);
    return { studySets: [], error };
  }
};

// Create a new study set
export const createStudySet = async (
  userId: string,
  title: string,
  description?: string
) => {
  try {
    const { data, error } = await supabase
      .from('study_sets')
      .insert({
        user_id: userId,
        title,
        description,
      })
      .select()
      .single();

    if (error) throw error;
    return { studySet: data, error: null };
  } catch (error) {
    console.error('Error creating study set:', error);
    return { studySet: null, error };
  }
};