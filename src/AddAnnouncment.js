import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddAnnouncement({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('low');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Błąd", "Tytuł i treść ogłoszenia są wymagane!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://studenthub.ukw.edu.pl/~Student_800/add_announcement.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          priority,
          pinned: pinned ? 1 : 0
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        Alert.alert("Sukces", "Ogłoszenie opublikowane!", [{ text: "OK", onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert("Błąd", result.message || "Błąd serwera");
      }
    } catch (error) {
      Alert.alert("Błąd", "Brak połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0f5238" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="pets" size={24} color="#0f5238" />
          <Text style={styles.brandText}>Twój Pupil</Text>
        </View>
        <View style={styles.avatarMini} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Nowe Ogłoszenie</Text>
          <Text style={styles.subtitle}>Stwórz nową wiadomość dla zespołu.</Text>
        </View>

        <View style={styles.editorCard}>
          <Text style={styles.inputLabel}>Tytuł Ogłoszenia</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Wpisz tytuł..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.editorCard}>
          <Text style={styles.inputLabel}>Treść Ogłoszenia</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Opisz szczegóły..."
            multiline
            value={content}
            onChangeText={setContent}
          />
        </View>

        <View style={styles.bentoCard}>
          <Text style={styles.inputLabel}>Typ ogłoszenia</Text>
          <View style={styles.priorityRow}>
            <TouchableOpacity style={[styles.priorityBtn, priority === 'low' && {backgroundColor: '#b1f0ce'}]} onPress={() => setPriority('low')}>
              <Text style={[styles.priorityBtnText, priority === 'low' && {color: '#002114'}]}>NORMALNE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.priorityBtn, priority === 'high' && {backgroundColor: '#ffdad6'}]} onPress={() => setPriority('high')}>
              <Text style={[styles.priorityBtnText, priority === 'high' && {color: '#93000a'}]}>PILNY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitWrapper} onPress={handlePublish} disabled={loading}>
          <LinearGradient colors={['#0f5238', '#2d6a4f']} style={styles.submitBtn}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="send" size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.submitBtnText}>Opublikuj Ogłoszenie</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  header: { height: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ececff' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { fontSize: 18, fontWeight: '800', color: '#0f5238' },
  backBtn: { padding: 4 },
  avatarMini: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#f4f2ff' },
  scrollPadding: { paddingHorizontal: 24, paddingBottom: 40 },
  titleSection: { marginTop: 24, marginBottom: 25 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f4f2ff', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#895100', letterSpacing: 1 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#161a32' },
  subtitle: { fontSize: 14, color: '#707973', marginTop: 5 },
  editorCard: { backgroundColor: '#f4f2ff', padding: 20, borderRadius: 28, marginBottom: 15 },
  inputLabel: { fontSize: 11, fontWeight: '900', color: '#0f5238', textTransform: 'uppercase', marginBottom: 12 },
  titleInput: { backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 18, fontWeight: '700' },
  contentInput: { backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 15, minHeight: 150 },
  bentoCard: { backgroundColor: '#f4f2ff', padding: 20, borderRadius: 28, marginBottom: 15 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: { flex: 1, backgroundColor: '#fff', paddingVertical: 15, borderRadius: 20, alignItems: 'center' },
  priorityBtnText: { fontSize: 10, fontWeight: '900' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingText: { fontSize: 14, fontWeight: '600' },
  submitWrapper: { marginTop: 10, borderRadius: 22, overflow: 'hidden' },
  submitBtn: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' }
});