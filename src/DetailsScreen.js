import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Image, ScrollView, 
  TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DetailsScreen({ route, navigation }) {
  const { petId } = route.params;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // --- STANY DLA WYBORU CZASU ---
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date'); 
  const [showPicker, setShowPicker] = useState(false);

  const IP_ADDRESS = '192.168.201.222'; 
  const LOGGED_USER_ID = 1; 

  const API_URLS = {
    details: `http://studenthub.ukw.edu.pl/~Student_800/get_animal_details.php?id=${petId}`,
    toggle: `http://studenthub.ukw.edu.pl/~Student_800/toggle_favorite.php`,
    check: `http://studenthub.ukw.edu.pl/~Student_800/check_favorite.php?userId=${LOGGED_USER_ID}&animalId=${petId}`,
    addVisit: `http://studenthub.ukw.edu.pl/~Student_800/add_visit.php`,
    images: `http://studenthub.ukw.edu.pl/~Student_800/` 
  };

  useEffect(() => { loadData(); }, [petId]);

  const loadData = async () => {
    try {
      const [resPet, resFav] = await Promise.all([
        fetch(API_URLS.details),
        fetch(API_URLS.check)
      ]);
      const petData = await resPet.json();
      const favData = await resFav.json();
      setPet(Array.isArray(petData) ? petData[0] : petData);
      setIsFavorite(favData.isFavorite);
    } catch (error) { 
      console.error("Błąd ładowania danych:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- POMOCNICZA FUNKCJA FORMATOWANIA CZASU LOKALNEGO ---
  const formatToLocalMySQL = (dateObj) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
      dateObj.getFullYear() + '-' +
      pad(dateObj.getMonth() + 1) + '-' +
      pad(dateObj.getDate()) + ' ' +
      pad(dateObj.getHours()) + ':' +
      pad(dateObj.getMinutes()) + ':' +
      pad(dateObj.getSeconds())
    );
  };

  const toggleFavorite = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      let formData = new FormData();
      formData.append('userId', LOGGED_USER_ID);
      formData.append('animalId', petId);

      const res = await fetch(API_URLS.toggle, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setIsFavorite(!isFavorite);
      } else {
        Alert.alert("Błąd", result.message || "Nie udało się zmienić statusu ulubionych.");
      }
    } catch (e) {
      Alert.alert("Błąd", "Brak połączenia z API ulubionych.");
    } finally {
      setIsToggling(false);
    }
  };

  // --- LOGIKA WYBORU TERMINU ---
  const onDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || date;
    setDate(currentDate);

    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (mode === 'date') {
        setTimeout(() => {
          setMode('time');
          setShowPicker(true);
        }, 100);
      } else {
        finalConfirmation(currentDate);
      }
    } else {
      if (event.type === 'set') finalConfirmation(currentDate);
    }
  };

  const finalConfirmation = (finalDate) => {
    // Używamy formatowania lokalnego zamiast .toISOString()
    const startStr = formatToLocalMySQL(finalDate);
    
    // Obliczanie daty End: +1 godzina od Start (Lokalnie)
    const endDate = new Date(finalDate.getTime() + (60 * 60 * 1000));
    const endStr = formatToLocalMySQL(endDate);

    Alert.alert(
      "Potwierdź termin",
      `Czy zapisać wizytę u: ${pet?.Name}?\nRozpoczęcie: ${finalDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}`,
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Zapisz", onPress: () => sendVisitToDatabase(startStr, endStr) }
      ]
    );
  };

  const sendVisitToDatabase = async (startStr, endStr) => {
    try {
      const res = await fetch(API_URLS.addVisit, { 
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: LOGGED_USER_ID,
          animalId: petId,
          start: startStr,
          end: endStr
        }) 
      });

      const result = await res.json();

      if (result.status === "success") {
        Alert.alert("Sukces", "Wizyta zarezerwowana!");
      } else {
        Alert.alert("Błąd", result.message || "Ten termin jest już zajęty.");
      }
    } catch (e) { 
      console.error(e);
      Alert.alert("Błąd", "Brak połączenia z API wizyt."); 
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0f5238" style={{flex:1}} />;

  const cleanPhotoPath = pet?.Photo && pet.Photo.includes('uploads/') 
    ? pet.Photo 
    : `uploads/${pet.Photo}`;
  const finalImageUrl = `${API_URLS.images}${cleanPhotoPath}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f5238" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.circleBtn} 
          onPress={toggleFavorite}
          disabled={isToggling}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#e74c3c" : "#0f5238"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: finalImageUrl }} style={styles.heroImg} />
        
        <View style={styles.content}>
          <View style={styles.mainCard}>
            <Text style={styles.name}>{pet?.Name}</Text>
            <Text style={styles.subtitle}>Płeć: {pet?.Gender} • Wiek: {pet?.Age}</Text>
            
            <View style={styles.tags}>
              <View style={styles.tag}><Text style={styles.tagText}>{pet?.Species}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{pet?.Breed}</Text></View>
            </View>
          </View>

          <View style={styles.bento}>
            <Text style={styles.sectionTitle}>O mnie</Text>
            <Text style={styles.description}>{pet?.Other || "Brak dodatkowego opisu."}</Text>
          </View>

          <TouchableOpacity 
            style={styles.btn} 
            onPress={() => {
              setMode('date');
              setShowPicker(true);
            }}
          >
            <Text style={styles.btnText}>Zaplanuj wizytę</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    position: 'absolute', 
    zIndex: 10, 
    width: '100%',
    top: Platform.OS === 'ios' ? 50 : 30 
  },
  circleBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  heroImg: { width: '100%', height: 400 },
  content: { padding: 20, marginTop: -30 },
  mainCard: { backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  name: { fontSize: 32, fontWeight: '900', color: '#161a32' },
  subtitle: { color: '#895100', fontWeight: '600', marginBottom: 15 },
  tags: { flexDirection: 'row', gap: 10 },
  tag: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
  bento: { backgroundColor: '#f4f2ff', padding: 20, borderRadius: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f5238', marginBottom: 10 },
  description: { color: '#404943', lineHeight: 22 },
  btn: { backgroundColor: '#0f5238', padding: 18, borderRadius: 20, marginTop: 20, marginBottom: 40, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});