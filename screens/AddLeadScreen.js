import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'student_leads';

export default function AddLeadScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', course: '', source: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course interest is required';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Lead source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const saveLead = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting', [{ text: 'OK' }]);
      return;
    }

    const newLead = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      course: formData.course.trim(),
      source: formData.source.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const storedLeads = await AsyncStorage.getItem(STORAGE_KEY);
      const leads = storedLeads ? JSON.parse(storedLeads) : [];
      leads.push(newLead);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

      setFormData({ name: '', email: '', phone: '', course: '', source: '' });
      setErrors({});

      Alert.alert('Success', 'Student lead added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error saving lead:', error);
      Alert.alert('Error', 'Failed to save lead. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Text style={styles.title}>Add New Student Lead</Text>
            <Text style={styles.subtitle}>Fill in the details below to add a new student lead</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student Name <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Enter student full name" placeholderTextColor="#9ca3af" value={formData.name} onChangeText={text => updateField('name', text)} autoCapitalize="words" />
              {errors.name && <Text style={styles.errorText}>⚠️ {errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="student@example.com" placeholderTextColor="#9ca3af" value={formData.email} onChangeText={text => updateField('email', text)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
              {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, errors.phone && styles.inputError]} placeholder="1234567890" placeholderTextColor="#9ca3af" value={formData.phone} onChangeText={text => updateField('phone', text)} keyboardType="phone-pad" maxLength={10} />
              {errors.phone && <Text style={styles.errorText}>⚠️ {errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course Interest <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, errors.course && styles.inputError]} placeholder="e.g., Computer Science, MBA, Engineering" placeholderTextColor="#9ca3af" value={formData.course} onChangeText={text => updateField('course', text)} autoCapitalize="words" />
              {errors.course && <Text style={styles.errorText}>⚠️ {errors.course}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lead Source <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, errors.source && styles.inputError]} placeholder="e.g., Website, Referral, Social Media, Event" placeholderTextColor="#9ca3af" value={formData.source} onChangeText={text => updateField('source', text)} autoCapitalize="words" />
              {errors.source && <Text style={styles.errorText}>⚠️ {errors.source}</Text>}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={saveLead} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>✓ Add Lead</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8 },
  required: { color: '#ef4444', fontSize: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 16, color: '#1f2937' },
  inputError: { borderColor: '#ef4444', borderWidth: 2 },
  errorText: { color: '#ef4444', fontSize: 13, marginTop: 6, marginLeft: 4 },
  submitButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  submitButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
});