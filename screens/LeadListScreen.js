import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'student_leads';

export default function LeadListScreen({ navigation }) {
  const [leads, setLeads] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeads = async () => {
    try {
      const storedLeads = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLeads) {
        const parsedLeads = JSON.parse(storedLeads);
        parsedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLeads(parsedLeads);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
      Alert.alert('Error', 'Failed to load leads');
    }
  };

  useEffect(() => {
    loadLeads();
    const unsubscribe = navigation.addListener('focus', loadLeads);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeads();
    setRefreshing(false);
  };

  const deleteLead = async (id, leadName) => {
    Alert.alert(
      'Delete Lead',
      `Are you sure you want to delete "${leadName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedLeads = leads.filter(lead => lead.id !== id);
              setLeads(updatedLeads);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
              Alert.alert('Success', 'Lead deleted successfully');
            } catch (error) {
              console.error('Error deleting lead:', error);
              Alert.alert('Error', 'Failed to delete lead');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderLeadItem = ({ item }) => (
    <View style={styles.leadCard}>
      <TouchableOpacity
        style={styles.leadContent}
        onPress={() => navigation.navigate('LeadDetail', { lead: item })}
        activeOpacity={0.7}
      >
        <View style={styles.leadHeader}>
          <Text style={styles.leadName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {item.course}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>📧</Text>
          <Text style={styles.leadEmail} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>📱</Text>
          <Text style={styles.leadPhone}>{item.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>🔗</Text>
          <Text style={styles.leadSource}>Source: {item.source}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteLead(item.id, item.name)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>No Leads Yet</Text>
      <Text style={styles.emptySubtext}>
        Start by adding your first student lead using the button below
      </Text>
    </View>
  );

  const renderListHeader = () => {
    if (leads.length === 0) return null;
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={leads}
        keyExtractor={item => item.id}
        renderItem={renderLeadItem}
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={
          leads.length === 0 ? styles.emptyListContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddLead')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Add Lead</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyListContainer: { flex: 1 },
  listHeader: { marginBottom: 12 },
  listHeaderText: { fontSize: 16, fontWeight: '600', color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 80, marginBottom: 16 },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  leadCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, overflow: 'hidden' },
  leadContent: { padding: 16 },
  leadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  leadName: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', flex: 1, marginRight: 8 },
  badge: { backgroundColor: '#6366f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, maxWidth: 120 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { fontSize: 14, marginRight: 8, width: 20 },
  leadEmail: { fontSize: 14, color: '#4b5563', flex: 1 },
  leadPhone: { fontSize: 14, color: '#4b5563' },
  leadSource: { fontSize: 13, color: '#6b7280' },
  deleteButton: { backgroundColor: '#ef4444', paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginRight: 8 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
