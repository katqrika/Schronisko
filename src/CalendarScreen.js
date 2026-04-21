import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [allVisits, setAllVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const IP_ADDRESS = '192.168.201.222';
  const LOGGED_USER_ID = 1;
  const API_URL = `http://studenthub.ukw.edu.pl/~Student_800/get_user_visits.php?userId=${LOGGED_USER_ID}`;
  const BASE_URL = `http://studenthub.ukw.edu.pl/~Student_800/`;

  // Pobieramy dzisiejszą datę, aby zablokować kalendarz wstecz
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAllVisits(data);
    } catch (error) {
      console.error("Błąd fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = allVisits.filter(v => v.Start.startsWith(selectedDate));

  const markedDates = {};
  allVisits.forEach(v => {
    const dateKey = v.Start.split(' ')[0];
    markedDates[dateKey] = { marked: true, dotColor: '#0f5238' };
  });
  
  if (selectedDate) {
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: '#0f5238' };
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Twój Harmonogram</Text>
        <TouchableOpacity onPress={fetchVisits}>
          <Ionicons name="refresh" size={24} color="#0f5238" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.calendarCard}>
          <Calendar
            minDate={today} // BLOKADA DAT WSTECZ
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{ 
              todayTextColor: '#0f5238', 
              selectedDayBackgroundColor: '#0f5238', 
              arrowColor: '#0f5238',
              textDisabledColor: '#d9e1e8' 
            }}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDate ? `Wizyty: ${selectedDate}` : "Twoje zaplanowane wizyty"}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#0f5238" style={{ marginTop: 20 }} />
        ) : filteredVisits.length > 0 ? (
          filteredVisits.map((v) => {
            const cleanPhotoPath = v.Photo && v.Photo.includes('uploads/') 
              ? v.Photo 
              : `uploads/${v.Photo}`;
            const finalImageUrl = `${BASE_URL}${cleanPhotoPath}`;

            return (
              <View key={v.ID} style={styles.visitCard}>
                <Image 
                  source={{ uri: finalImageUrl }} 
                  style={styles.visitImg}
                />
                <View style={styles.visitInfo}>
                  <Text style={styles.visitName}>{v.Name}</Text>
                  <Text style={styles.visitTime}>
                    <Ionicons name="time-outline" size={14} /> {v.Start.split(' ')[1].substring(0, 5)} - {v.End.split(' ')[1].substring(0, 5)}
                  </Text>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeText}>{v.Species}</Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Brak wizyt w tym dniu.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} activeRoute="Calendar" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  brandTitle: { fontSize: 22, fontWeight: '900', color: '#0f5238' },
  calendarCard: { margin: 20, borderRadius: 20, overflow: 'hidden', elevation: 4, backgroundColor: '#fff' },
  sectionHeader: { paddingHorizontal: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#161a32' },
  visitCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 12, borderRadius: 20, alignItems: 'center', elevation: 2 },
  visitImg: { width: 70, height: 70, borderRadius: 15, backgroundColor: '#eee' },
  visitInfo: { marginLeft: 15, flex: 1 },
  visitName: { fontSize: 18, fontWeight: '800', color: '#161a32' },
  visitTime: { color: '#895100', fontWeight: '600', marginVertical: 2 },
  typeTag: { alignSelf: 'flex-start', backgroundColor: '#b1f0ce', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typeText: { fontSize: 10, fontWeight: '700', color: '#0f5238' },
  emptyState: { alignItems: 'center', marginTop: 30 },
  emptyText: { color: '#64748b', marginTop: 10 }
});