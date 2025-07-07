import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function Index() {
  const insets = useSafeAreaInsets();
  const {user} = useAuthStore();
  const userName = user?.user_metadata?.user_name || user?.email;
  const [showActions,setShowActions] =useState(false);


  return (
    <View  style={[styles.container, { paddingTop: insets.top }]}>
     <ScrollView
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Welcome {userName} </Text>

      {/* Today’s Tasks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}> Todays Tasks</Text>
        <View style={styles.taskItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#4ade80" />
          <Text style={styles.taskText}>Finish Data Structures Revision</Text>
        </View>
        <View style={styles.taskItem}>
          <Ionicons name="ellipse-outline" size={20} color="#facc15" />
          <Text style={styles.taskText}>Submit AI Assignment</Text>
        </View>
      </View>

      {/* Upcoming Schedule */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Schedule</Text>
        <View style={styles.scheduleItem}>
          <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
          <Text style={styles.scheduleText}>AI Class - Today 2:00 PM</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
          <Text style={styles.scheduleText}>Maths Exam - Monday</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="book-outline" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Study Set</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
     <TouchableOpacity style={styles.fab} onPress={() => setShowActions(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Quick Actions */}
      <Modal
        visible={showActions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New</Text>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="book-outline" size={20} color="#1d4ed8" />
              <Text style={styles.modalItemText}>New Study Set</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="document-text-outline" size={20} color="#1d4ed8" />
              <Text style={styles.modalItemText}>New Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="calendar-outline" size={20} color="#1d4ed8" />
              <Text style={styles.modalItemText}>New Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowActions(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1d4ed8',
  },
  modalCancel: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#ef4444',
  },
});