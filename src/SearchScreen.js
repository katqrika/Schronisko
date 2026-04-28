import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav'; 

export default function SearchScreen({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = `https://www.schronisko.w5.lt/get_animal.php`;
  const BASE_IMAGE_URL = `https://www.schronisko.w5.lt/uploads/`; 

  const fetchAnimals = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setAnimals(list);
      setFilteredAnimals(list);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchAnimals(); }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = animals.filter(a => 
      a.Name.toLowerCase().includes(text.toLowerCase()) ||
      (a.Breed && a.Breed.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredAnimals(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <Text style={styles.brandTitle}>Lista Zwierząt</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput 
          placeholder="Szukaj imienia lub rasy..." 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchAnimals();}} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {loading ? <ActivityIndicator size="large" color="#0f5238" style={{ marginTop: 50 }} /> : (
          <View style={styles.grid}>
            {filteredAnimals.map((item) => (
              <TouchableOpacity key={item.ID} style={styles.card} onPress={() => navigation.navigate('Details', { petId: item.ID })}>
                <Image source={{ uri: `${BASE_IMAGE_URL}${item.Photo}` }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.petName}>{item.Name}</Text>
                  <Text style={styles.petBreed}>{item.Species}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>


      <BottomNav navigation={navigation} activeRoute="Search" />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  topNav: { padding: 20, backgroundColor: '#fff' },
  brandTitle: { fontSize: 22, fontWeight: '800', color: '#0f5238' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 15, alignItems: 'center', elevation: 2 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  grid: { paddingHorizontal: 20 },
  card: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  cardImage: { width: '100%', height: 200 },
  cardContent: { padding: 15 },
  petName: { fontSize: 20, fontWeight: '800' },
  petBreed: { color: '#64748b' },
  navWrapper: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 16, paddingBottom: 25 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', height: 75, borderRadius: 35, elevation: 20 },
  navItem: { alignItems: 'center', padding: 10 },
  navItemActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 22, gap: 8 },
  navText: { fontSize: 10, color: '#64748b', marginTop: 4 },
  navTextActive: { fontSize: 12, color: '#0f5238', fontWeight: '800' }
});