import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, 
  Alert, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav'; 

export default function ReportScreen({ navigation, route }) {
  const IP_ADDRESS = '192.168.201.222'; 
  const userId = route.params?.userId || 1; 

  const [animalSearch, setAnimalSearch] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const [myAnimals, setMyAnimals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch(`https://www.schronisko.w5.lt/get_user_animals.php?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Pobrane zwierzęta:", data); // DEBUG: Sprawdź to w konsoli!
        setMyAnimals(Array.isArray(data) ? data : []);
      })
      .catch(err => console.log("Błąd fetch animals:", err));
  }, [userId]);

  const handleSearch = (text) => {
    setAnimalSearch(text);
    
    if (text.length > 0) {
      // Szukamy pasujących zwierzaków
      const filtered = myAnimals.filter(a => 
        a.Name && a.Name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSelectedAnimal(null);
    }
  };

  const selectAnimal = (item) => {
    setAnimalSearch(item.Name);
    setSelectedAnimal(item);
    setShowSuggestions(false);
  };

  const sendReport = async () => {
    if (!selectedAnimal) {
      Alert.alert("Błąd", "Wybierz zwierzę z listy podpowiedzi!");
      return;
    }
    if (!title.trim() || !description.trim()) {
      Alert.alert("Błąd", "Uzupełnij wszystkie pola.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`https://www.schronisko.w5.lt/add_incident.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId: selectedAnimal.ID,
          userId: userId,
          title: title,
          content: description,
          priority: priority
        }),
      });

      const res = await response.json();
      if (res.success) {
        Alert.alert("Sukces", "Zgłoszenie zostało zapisane.");
        setAnimalSearch(''); 
        setSelectedAnimal(null); 
        setTitle(''); 
        setDescription('');
      } else {
        Alert.alert("Błąd", res.message || "Błąd bazy danych.");
      }
    } catch (e) {
      Alert.alert("Błąd", "Brak połączenia z serwerem.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <Text style={styles.brandTitle}>Zgłoś wydarzenie</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="always" // Ważne dla wyboru z dropdowna
        >
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Nowy Raport</Text>
            <Text style={styles.subTitle}>Opisz zdarzenie dla zwierzaka, z którym byłeś na spacerze.</Text>
          </View>

          <View style={styles.form}>
            
            {/* SEKCOJA WYBORU ZWIERZĘCIA - z wyższym zIndex */}
            <Text style={styles.label}>Wybierz Zwierzę</Text>
            <View style={styles.searchSection}>
              <View style={[
                styles.inputBox, 
                showSuggestions && suggestions.length > 0 && styles.activeInput
              ]}>
                <Ionicons name="paw" size={20} color="#0f5238" />
                <TextInput 
                  style={styles.input} 
                  placeholder="Zacznij wpisywać imię..." 
                  value={animalSearch}
                  onChangeText={handleSearch}
                  onFocus={() => { if(animalSearch.length > 0) setShowSuggestions(true); }}
                />
              </View>

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.dropdown}>
                  {suggestions.map(item => (
                    <TouchableOpacity 
                      key={item.ID} 
                      style={styles.dropItem} 
                      onPress={() => selectAnimal(item)}
                    >
                      <Ionicons name="paw-outline" size={16} color="#64748b" />
                      <Text style={styles.dropText}>{item.Name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* TYTUŁ */}
            <Text style={styles.label}>Tytuł raportu</Text>
            <View style={styles.inputBox}>
              <Ionicons name="create-outline" size={20} color="#0f5238" />
              <TextInput 
                style={styles.input} 
                placeholder="Np. Skaleczona łapa" 
                value={title} 
                onChangeText={setTitle} 
              />
            </View>

            {/* TREŚĆ */}
            <Text style={styles.label}>Treść zgłoszenia</Text>
            <TextInput 
              style={styles.textArea} 
              multiline 
              placeholder="Dokładny opis..." 
              value={description} 
              onChangeText={setDescription} 
              textAlignVertical="top"
            />

            {/* PRIORYTET */}
            <Text style={styles.label}>Priorytet</Text>
            <View style={styles.prioRow}>
              {['low', 'medium', 'high'].map(p => (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.prioBtn, priority === p && styles.prioActive]} 
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.prioText, priority === p && { color: '#fff' }]}>
                    {p === 'low' ? 'Niski' : p === 'medium' ? 'Średni' : 'Wysoki'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={sendReport} 
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Zapisz w bazie</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav navigation={navigation} activeRoute="Report" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  topNav: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  brandTitle: { fontSize: 22, fontWeight: '800', color: '#0f5238' },
  scroll: { padding: 25, paddingBottom: 130 },
  header: { marginBottom: 30 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#0f5238' },
  subTitle: { color: '#64748b', fontSize: 15, marginTop: 5 },
  form: { gap: 18 },
  label: { fontSize: 13, fontWeight: '800', color: '#895100', textTransform: 'uppercase', marginLeft: 5, marginBottom: -10 },
  
  // KLUCZOWE: searchSection musi mieć zIndex i elevation, by lista była na wierzchu
  searchSection: { 
    zIndex: 1000, 
    elevation: 1000, 
    position: 'relative' 
  },
  
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f4f2ff', 
    padding: 15, 
    borderRadius: 15, 
    gap: 12 
  },
  activeInput: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  input: { flex: 1, fontSize: 16, color: '#161a32', fontWeight: '600' },
  textArea: { backgroundColor: '#f4f2ff', padding: 15, borderRadius: 15, minHeight: 120, fontSize: 16, color: '#161a32', fontWeight: '600' },
  
  dropdown: { 
    position: 'absolute',
    top: 55, // tuż pod inputem
    left: 0,
    right: 0,
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 15, 
    borderBottomRightRadius: 15, 
    elevation: 10, 
    zIndex: 2000,
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  dropItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#fbf8ff', flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropText: { fontWeight: '700', color: '#161a32' },
  prioRow: { flexDirection: 'row', gap: 10 },
  prioBtn: { flex: 1, padding: 15, backgroundColor: '#f4f2ff', borderRadius: 12, alignItems: 'center' },
  prioActive: { backgroundColor: '#0f5238' },
  prioText: { fontWeight: '700', color: '#64748b' },
  submitBtn: { backgroundColor: '#0f5238', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 18 }
});