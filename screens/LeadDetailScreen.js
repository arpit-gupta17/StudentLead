
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'student_leads';

export default function LeadDetailScreen({ route, navigation }) {
  const { lead } = route.params;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-US', options);
  };

  const handleCall = () => {
    const phoneNumber = `tel:${lead.phone}`;
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'Cannot make phone calls on this device');
        }
      })
      .catch(err => console.error('Error opening phone:', err));
  };

  const handleEmail = () => {
    const emailUrl = `mailto:${lead.email}`;
    Linking.canOpenURL(emailUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'Cannot open email on this device');
        }
      })
      .catch(err => console.error('Error opening email:', err));
  };

  const handleDelete = () => {
    Alert.alert('Delete Lead', `Are you sure you want to permanently delete "${lead.name}"?\n\nThis action cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const storedLeads = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedLeads) {
              const leads = JSON.parse(storedLeads);
              const updatedLeads = leads.filter(l => l.id !== lead.id);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
              Alert.alert('Deleted', 'Lead has been deleted successfully', [
                { text: 'OK', onPress: () => navigation.navigate('LeadList') },
              ]);
            }
          } catch (error) {
            console.error('Error deleting lead:', error);
            Alert.alert('Error', 'Failed to delete lead. Please try again.');
          }
        },
      },
    ], { cancelable: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{lead.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{lead.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{lead.course}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>✉️</Text>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📧</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={styles.detailValue}>{lead.email}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📱</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{lead.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Information</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🎓</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Course Interest</Text>
                <Text style={styles.detailValue}>{lead.course}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🔗</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Lead Source</Text>
                <Text style={styles.detailValue}>{lead.source}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Created On</Text>
                <Text style={styles.detailValue}>{formatDate(lead.createdAt)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🆔</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Lead ID</Text>
                <Text style={styles.detailValueSmall}>{lead.id}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteButtonText}>Delete Lead</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  headerCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatar: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 12, textAlign: 'center' },
  badge: { backgroundColor: '#6366f1', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  actionButton: { backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, alignItems: 'center', flex: 0.45, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: { fontSize: 24, marginRight: 12 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: '600' },
  detailValue: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  detailValueSmall: { fontSize: 12, color: '#6b7280', fontWeight: '400' },
  deleteButton: { backgroundColor: '#ef4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 8, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  deleteIcon: { fontSize: 20, marginRight: 8 },
  deleteButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  bottomPadding: { height: 40 },
});