import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, Image, ActivityIndicator, RefreshControl 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function AdminPanel({ navigation }) {
  const [animalCount, setAnimalCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Twoja obecna konfiguracja IP

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Pobieranie zwierząt (zgodnie z Twoim PHP)
      const resAnim = await fetch(`https://www.schronisko.w5.lt/get_animals.php`);
      const dataAnim = await resAnim.json();
      // Jeśli Twoje PHP zwraca tablicę, a nie obiekt z polem animalCount, 
      // używamy dataAnim.length
      const count = Array.isArray(dataAnim) ? dataAnim.length : (dataAnim.animalCount || 0);
      setAnimalCount(count);

      // 2. Pobieranie statystyk (zgodnie z Twoim PHP)
      const resStats = await fetch(`https://www.schronisko.w5.lt/get_admin_stats.php`);
      const dataStats = await resStats.json();
      setVisitCount(dataStats.visitCount || 0);
      setReportCount(dataStats.reportCount || 0);

    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleLogout = () => {
        Alert.alert("Wylogowanie", "Czy na pewno chcesz się wylogować?", [
          { text: "Anuluj", style: "cancel" },
          { text: "Wyloguj", onPress: () => navigation.navigate('Login'), style: "destructive" }
        ]);
      };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=Admin&background=0f5238&color=fff' }} 
            style={styles.avatar} 
          />
          <Text style={styles.brandTitle}>Twój pupil</Text>
        </View>
        <TouchableOpacity onPress={fetchData}>
          <Ionicons name="refresh" size={24} color="#0f5238" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchData} />}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>DZIEŃ DOBRY,</Text>
          <Text style={styles.welcomeTitle}>Panel Administratora</Text>
          <Text style={styles.subtitle}>Statystyki Twojego schroniska w czasie rzeczywistym.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0f5238" style={{ marginTop: 50 }} />
        ) : (
          /* Bento Grid */
          <View style={styles.bentoGrid}>
            <View style={[styles.bentoCardLarge, { backgroundColor: '#f4f2ff' }]}>
              <MaterialCommunityIcons name="paw" size={32} color="#0f5238" />
              <View>
                <Text style={styles.statNumBig}>{animalCount}</Text>
                <Text style={styles.statLabel}>Podopiecznych</Text>
              </View>
            </View>

            <View style={styles.bentoColumn}>
              <View style={[styles.bentoCardSmall, { backgroundColor: '#0f5238' }]}>
                <Text style={styles.miniStatNum}>{visitCount}</Text>
                <Text style={styles.miniStatLabel}>WIZYTY</Text>
              </View>
              <View style={[styles.bentoCardSmall, { backgroundColor: '#fd9d1a' }]}>
                <Text style={styles.miniStatNum}>{reportCount}</Text>
                <Text style={styles.miniStatLabel}>RAPORTY</Text>
              </View>
            </View>
          </View>
        )}

        {/* Zarządzanie - Naprawiona siatka przycisków */}
        <Text style={styles.sectionSubtitle}>Zarządzanie</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('AddAnimal')}
          >
            <Ionicons name="add-circle" size={32} color="#0f5238" />
            <Text style={styles.cardText}>Dodaj Zwierzę</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('AddAnnouncment')}
          >
            <Ionicons name="megaphone" size={32} color="#fd9d1a" />
            <Text style={styles.cardText}>Ogłoszenie</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { width: '100%', marginTop: 12, flexDirection: 'row', gap: 15 }]} 
            onPress={() => navigation.navigate('AdminVisitCard')}
          >
            <Ionicons name="calendar" size={32} color="#0f5238" />
            <Text style={styles.cardText}>Harmonogram Wizyt</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  header: { 
    height: 70, flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#ececff'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  brandTitle: { fontSize: 18, fontWeight: '800', color: '#0f5238' },
  scrollContent: { padding: 24 },
  welcomeSection: { marginBottom: 25 },
  welcomeLabel: { fontSize: 12, fontWeight: '800', color: '#895100' },
  welcomeTitle: { fontSize: 28, fontWeight: '900', color: '#161a32' },
  subtitle: { color: '#707973', marginTop: 5, fontSize: 14 },
  bentoGrid: { flexDirection: 'row', gap: 12 },
  bentoCardLarge: { flex: 1.2, height: 160, borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  statNumBig: { fontSize: 48, fontWeight: '900', color: '#161a32' },
  statLabel: { fontSize: 14, fontWeight: '700', color: '#404943' },
  bentoColumn: { flex: 1, gap: 12 },
  bentoCardSmall: { flex: 1, borderRadius: 20, padding: 15, justifyContent: 'center' },
  miniStatNum: { fontSize: 22, fontWeight: '900', color: '#fff' },
  miniStatLabel: { fontSize: 10, color: '#fff', fontWeight: '800' },
  sectionSubtitle: { marginTop: 30, marginBottom: 15, fontWeight: '800', color: '#707973', textTransform: 'uppercase', fontSize: 11 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { 
    width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 24, 
    alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8
  },
  cardText: { marginTop: 10, fontWeight: '700', color: '#161a32' }
});