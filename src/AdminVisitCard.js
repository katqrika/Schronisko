import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView,
  SafeAreaView, StatusBar, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ✅ ZMIEŃ TYLKO TEN ADRES — wpisz IP swojego komputera (tego gdzie stoi XAMPP/PHP)
const API_URL = "http://studenthub.ukw.edu.pl/~Student_800/get_admin_visits.php";

export default function AdminScheduleScreen() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setScheduleData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatuj dzisiejszą datę po polsku
  const today = new Date().toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <Text style={styles.brand}>Twój pupil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleGap}>
          <Text style={styles.mainTitle}>Grafik Wizyt</Text>
          <Text style={styles.subTitle}>Dzisiaj, {today}</Text>
        </View>

        {/* Ładowanie */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0f5238" />
            <Text style={styles.loadingText}>Ładowanie wizyt...</Text>
          </View>
        )}

        {/* Błąd */}
        {!loading && error && (
          <View style={styles.center}>
            <MaterialIcons name="wifi-off" size={40} color="#895100" />
            <Text style={styles.errorText}>Nie udało się pobrać wizyt</Text>
            <Text style={styles.errorDetail}>{error}</Text>
            <Text style={styles.errorHint}>
              Sprawdź czy IP w API_URL jest poprawne i czy serwer PHP działa.
            </Text>
          </View>
        )}

        {/* Brak wizyt */}
        {!loading && !error && scheduleData.length === 0 && (
          <View style={styles.center}>
            <MaterialIcons name="event-busy" size={40} color="#b0b0b0" />
            <Text style={styles.emptyText}>Brak wizyt na dziś</Text>
          </View>
        )}

        {/* Lista wizyt */}
        {!loading && !error && scheduleData.length > 0 && (
          <View style={styles.timelineContainer}>
            {scheduleData.map((item, index) => (
              <View key={item.id} style={styles.row}>

                {/* Oś Czasu */}
                <View style={styles.timelineArt}>
                  <View style={[
                    styles.lineSegment,
                    { top: 0, height: '50%' },
                    index === 0 && { opacity: 0 }
                  ]} />
                  <View style={[
                    styles.lineSegment,
                    { bottom: 0, height: '50%' },
                    index === scheduleData.length - 1 && { opacity: 0 }
                  ]} />
                  <View style={styles.dot}>
                    <MaterialIcons name="pets" size={16} color="white" />
                  </View>
                </View>

                {/* Karta */}
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.time}>{item.time}</Text>
                    <Text style={styles.name}>{item.visitor}</Text>
                  </View>

                  <View style={styles.petSection}>
                    {item.img ? (
                      <Image
                        source={{ uri: item.img }}
                        style={styles.petImg}
                        />
                    ) : (
                      <View style={[styles.petImg, styles.petImgPlaceholder]}>
                        <MaterialIcons name="pets" size={24} color="#0f5238" />
                      </View>
                    )}
                    <View style={styles.petInfo}>
                      <Text style={styles.petLabel}>{item.petType}</Text>
                      <Text style={styles.petName}>{item.petName}</Text>
                      <Text style={styles.petBox}>Boks: {item.box}</Text>
                    </View>
                  </View>
                </View>

              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  topBar: { padding: 20, backgroundColor: '#fbf8ff' },
  brand: { fontSize: 16, fontWeight: '800', color: '#0f5238' },
  scroll: { padding: 20, paddingBottom: 50 },
  titleGap: { marginBottom: 30 },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#0f5238' },
  subTitle: { fontSize: 14, fontWeight: '600', color: '#895100' },

  center: { alignItems: 'center', paddingTop: 60, gap: 10 },
  loadingText: { marginTop: 12, fontSize: 15, color: '#707973' },
  emptyText: { fontSize: 16, color: '#b0b0b0', fontWeight: '600', marginTop: 8 },
  errorText: { fontSize: 16, color: '#895100', fontWeight: '700', marginTop: 8 },
  errorDetail: { fontSize: 12, color: '#b05000', textAlign: 'center', paddingHorizontal: 20 },
  errorHint: { fontSize: 11, color: '#aaa', textAlign: 'center', paddingHorizontal: 30, marginTop: 4 },

  timelineContainer: { width: '100%' },
  row: { flexDirection: 'row', minHeight: 140, marginBottom: 15 },

  timelineArt: { width: 40, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  lineSegment: { position: 'absolute', width: 2, backgroundColor: '#ececff', left: '50%', marginLeft: -1 },
  dot: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0f5238', alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: '#fbf8ff', zIndex: 2
  },

  card: {
    flex: 1, backgroundColor: 'white', borderRadius: 24,
    padding: 16, elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 10
  },
  cardTop: { marginBottom: 12 },
  time: { fontSize: 18, fontWeight: '800', color: '#0f5238' },
  name: { fontSize: 17, fontWeight: '700', color: '#161a32' },

  petSection: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#f4f2ff', padding: 12, borderRadius: 18
  },
  petImg: { width: 45, height: 45, borderRadius: 12 },
  petImgPlaceholder: { backgroundColor: '#e0f5ec', alignItems: 'center', justifyContent: 'center' },
  petInfo: { flex: 1 },
  petLabel: { fontSize: 10, fontWeight: '800', color: '#895100', textTransform: 'uppercase' },
  petName: { fontSize: 15, fontWeight: '700', color: '#161a32' },
  petBox: { fontSize: 11, color: '#707973' },
});