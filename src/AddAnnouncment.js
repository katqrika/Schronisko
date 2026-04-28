import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddAnnouncement({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    // Walidacja pól
    if (!title.trim() || !content.trim()) {
      Alert.alert("Błąd", "Wypełnij tytuł i treść ogłoszenia!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://www.schronisko.w5.lt/add_announcment.php', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          priority: priority,
          pinned: 0 
        }),
      });

      const responseText = await response.text();
      
      try {
        const result = JSON.parse(responseText);
        if (result.status === 'success') {
          Alert.alert("Sukces", "Ogłoszenie zostało opublikowane!", [
            { text: "Super", onPress: () => navigation.goBack() }
          ]);
        } else {
          Alert.alert("Błąd serwera", result.message || "Coś poszło nie tak.");
        }
      } catch (e) {
  console.log("Surowa odpowiedź serwera:", responseText);
  // Dodaj to poniżej, aby zobaczyć błąd na telefonie:
  Alert.alert("DEBUG - Co wysłał serwer:", responseText.substring(0, 200)); 
  Alert.alert("Błąd", "Serwer zwrócił niepoprawny format danych.");
}

    } catch (error) {
      Alert.alert("Błąd", "Brak połączenia z internetem lub serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
          <Text style={styles.subtitle}>Wpisz szczegóły nowej wiadomości.</Text>
        </View>

        {/* Input Tytułu */}
        <View style={styles.editorCard}>
          <Text style={styles.inputLabel}>Tytuł</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Tytuł wiadomości..."
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Input Treści */}
        <View style={styles.editorCard}>
          <Text style={styles.inputLabel}>Treść</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="O czym chcesz poinformować?"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        {/* Wybór Priorytetu */}
        <View style={styles.bentoCard}>
          <Text style={styles.inputLabel}>Priorytet</Text>
          <View style={styles.priorityRow}>
            <TouchableOpacity 
              style={[styles.priorityBtn, priority === 'low' && {backgroundColor: '#b1f0ce'}]} 
              onPress={() => setPriority('low')}
            >
              <Text style={[styles.priorityBtnText, priority === 'low' && {color: '#002114'}]}>NORMALNY</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.priorityBtn, priority === 'high' && {backgroundColor: '#ffdad6'}]} 
              onPress={() => setPriority('high')}
            >
              <Text style={[styles.priorityBtnText, priority === 'high' && {color: '#93000a'}]}>PILNY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Przycisk Wysyłania */}
        <TouchableOpacity 
          style={styles.submitWrapper} 
          onPress={handlePublish} 
          disabled={loading}
        >
          <LinearGradient colors={['#0f5238', '#2d6a4f']} style={styles.submitBtn}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="send" size={20} color="#fff" style={{marginRight: 10}} />
                <Text style={styles.submitBtnText}>Opublikuj teraz</Text>
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
  mainTitle: { fontSize: 30, fontWeight: '900', color: '#161a32' },
  subtitle: { fontSize: 14, color: '#707973', marginTop: 5 },
  editorCard: { backgroundColor: '#f4f2ff', padding: 20, borderRadius: 28, marginBottom: 15 },
  inputLabel: { fontSize: 11, fontWeight: '900', color: '#0f5238', textTransform: 'uppercase', marginBottom: 10 },
  titleInput: { backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 17, fontWeight: '600' },
  contentInput: { backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 15, minHeight: 120 },
  bentoCard: { backgroundColor: '#f4f2ff', padding: 20, borderRadius: 28, marginBottom: 15 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: { flex: 1, backgroundColor: '#fff', paddingVertical: 15, borderRadius: 20, alignItems: 'center' },
  priorityBtnText: { fontSize: 11, fontWeight: '900' },
  submitWrapper: { marginTop: 10, borderRadius: 22, overflow: 'hidden' },
  submitBtn: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});