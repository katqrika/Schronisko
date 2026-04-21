import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Image, ScrollView, 
  TouchableOpacity, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav'; 

// --- Komponent dla rozwijanego ogłoszenia ---
const AnnouncementItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => setExpanded(!expanded)} 
      style={[styles.infoCard, { marginBottom: 15 }]}
    >
      <View style={styles.infoTop}>
        <Text style={styles.infoTitle} numberOfLines={1}>{item.Title}</Text>
        {item.Status && item.Status.trim() !== "" && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>{item.Status.toUpperCase()}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.infoDesc} numberOfLines={expanded ? 0 : 2}>
        {item.Content}
      </Text>
      
      <View style={styles.expandRow}>
        <Text style={styles.expandText}>
          {expanded ? "Zwiń ▲" : "Czytaj więcej ▼"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Główny ekran HomeScreen ---
export default function HomeScreen({ navigation, route }) {
  const [userData, setUserData] = useState({ Name: '...', Login: '' });
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  
  const [visitCount, setVisitCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const IP_ADDRESS = '192.168.201.222'; 
  const userId = route.params?.userId || 1; 

  useEffect(() => {
    // 1. Dane użytkownika
    fetch(`https://studenthub.ukw.edu.pl/php/student_800/php_php/get_user.php?id=${userId}`)
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.log("Błąd user:", err));

    // 2. Ogłoszenia
    fetch(`https://studenthub.ukw.edu.pl/php/student_800/php_php/get_announcements.php`)
      .then(res => res.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(err => console.log("Błąd ogłoszeń:", err));

    // 3. Statystyki
    fetch(`https://studenthub.ukw.edu.pl/php/student_800/php_php/get_user_stats.php?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setVisitCount(data.visitCount || 0);
        setReportCount(data.reportCount || 0);
      })
      .catch(err => console.log("Błąd statystyk:", err));

    // 4. Ulubieńcy
    fetch(`https://studenthub.ukw.edu.pl/php/student_800/php_php/get_favourites.php?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setAnimals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Błąd zwierząt:", err);
        setLoading(false);
      });
  }, [userId]);

  // Funkcja wylogowania
  const handleLogout = () => {
    Alert.alert(
      "Wylogowanie",
      "Czy na pewno chcesz się wylogować?",
      [
        { text: "Anuluj", style: "cancel" },
        { 
          text: "Wyloguj", 
          onPress: () => navigation.navigate('Login'), // Upewnij się, że masz ekran 'Login' w nawigacji
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header z przyciskiem wylogowania (drzwiczki) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${userData.Name || 'U'}&background=0f5238&color=fff` }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.headerTitle}>{userData.Login || "Wolontariusz"}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeSub}>WITAJ, {userData.Name?.toUpperCase()}!</Text>
          <Text style={styles.welcomeTitle}>Idziemy na spacer?</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statCardMain}>
            <Ionicons name="time-outline" size={32} color="#0f5238" />
            <View>
              <Text style={styles.statNumBig}>{visitCount}</Text>
              <Text style={styles.statLabel}>Godziny</Text>
            </View>
          </View>

          <View style={styles.statColumn}>
            {/* Zielony bloczek - Wizyty */}
            <View style={styles.statSmallGreen}>
              <Ionicons name="heart" size={20} color="#fff" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statSmallNum} numberOfLines={1}>
                  {visitCount} {visitCount === 1 ? 'Wizyta' : 'Wizyt'}
                </Text>
              </View>
            </View>

            {/* Pomarańczowy bloczek - Raporty */}
            <View style={styles.statSmallOrange}>
              <Ionicons name="document-text" size={20} color="#663b00" />
              <View style={styles.statTextContainer}>
                <Text style={styles.statSmallNumOrange} numberOfLines={1}>
                  {reportCount} {reportCount === 1 ? 'Raport' : 'Raportów'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ulubieńcy */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ulubieńcy</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalRow}>
          {loading ? (
            <ActivityIndicator color="#0f5238" size="large" style={{ marginLeft: 20 }} />
          ) : animals.length > 0 ? (
            animals.map((animal) => (
              <TouchableOpacity 
                key={animal.ID} 
                style={styles.animalCard}
                onPress={() => navigation.navigate('Details', { petId: animal.ID })}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: `https://studenthub.ukw.edu.pl/php/student_800/php_php/${animal.Photo}` }} 
                    style={styles.cardImg} 
                    resizeMode="cover"
                  />
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Ulubiony</Text>
                  </View>
                </View>
                <Text style={styles.cardName}>{animal.Name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Nie masz jeszcze ulubionych zwierząt.</Text>
          )}
        </ScrollView>

        {/* Panel Informacyjny */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Panel Informacyjny</Text>
          {announcements.length > 0 ? (
            announcements.map((item, index) => (
              <AnnouncementItem key={index} item={item} />
            ))
          ) : (
            <View style={styles.infoCard}>
              <Text style={{ color: '#64748b', textAlign: 'center' }}>Brak nowych ogłoszeń</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#fff', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrapper: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f5238' },
  iconBtn: { 
    padding: 8, 
    backgroundColor: '#fff1f2', 
    borderRadius: 12 
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  welcomeBox: { marginVertical: 30 },
  welcomeSub: { fontSize: 13, fontWeight: '600', color: '#895100', letterSpacing: 1 },
  welcomeTitle: { fontSize: 34, fontWeight: '800', color: '#161a32' },
  
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 40 },
  statCardMain: { flex: 1.2, backgroundColor: '#f4f2ff', borderRadius: 20, padding: 20, justifyContent: 'space-between', minHeight: 140 },
  statNumBig: { fontSize: 32, fontWeight: '800', color: '#161a32' },
  statLabel: { color: '#404943', fontWeight: '500' },
  statColumn: { flex: 1, gap: 12 },
  
  statSmallGreen: { flex: 1, backgroundColor: '#0f5238', borderRadius: 15, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, overflow: 'hidden' },
  statSmallOrange: { flex: 1, backgroundColor: '#fd9d1a', borderRadius: 15, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, overflow: 'hidden' },
  
  statTextContainer: { flex: 1 }, 
  statSmallNum: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statSmallNumOrange: { color: '#663b00', fontWeight: '700', fontSize: 13 },

  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#161a32' },
  horizontalRow: { marginHorizontal: -20, paddingLeft: 20, marginBottom: 40 },
  animalCard: { width: 240, marginRight: 20 },
  imageContainer: { height: 300, borderRadius: 20, overflow: 'hidden', position: 'relative', backgroundColor: '#eee' },
  cardImg: { width: '100%', height: '100%' },
  statusBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#b1f0ce', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '800', color: '#002114' },
  cardName: { fontSize: 20, fontWeight: '700', color: '#161a32', marginTop: 10 },
  emptyText: { color: '#64748b', marginLeft: 20 },
  infoSection: { marginBottom: 20 },
  infoCard: { backgroundColor: '#f4f2ff', borderRadius: 20, padding: 20 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10 },
  infoTitle: { fontSize: 17, fontWeight: '700', color: '#0f5238', flex: 1 },
  urgentBadge: { backgroundColor: 'rgba(253, 157, 26, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  urgentText: { color: '#fd9d1a', fontSize: 10, fontWeight: '800' },
  infoDesc: { color: '#404943', fontSize: 14, lineHeight: 20 },
  expandRow: { marginTop: 8 },
  expandText: { fontSize: 10, color: '#0f5238', fontWeight: '800' }
});