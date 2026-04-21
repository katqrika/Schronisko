import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, Alert, Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function AddAnimalScreen({ navigation }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Pies');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('Samiec');
  const [age, setAge] = useState('');
  const [sick, setSick] = useState('nie');
  const [other, setOther] = useState('');
  const [box, setBox] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const speciesOptions = ['Pies', 'Kot', 'Inne'];
  const genderOptions = ['Samiec', 'Samica'];
  const sickOptions = ['tak', 'nie'];

  // --- WYBÓR ZDJĘCIA ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Błąd', 'Brak uprawnień do zdjęć.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- ZAPIS DO BAZY + UPLOAD ZDJĘCIA ---
  const handleSave = async () => {
    if (!name || !breed || !age || !box || !image) {
      Alert.alert("Błąd", "Wypełnij dane i dodaj zdjęcie!");
      return;
    }

    setLoading(true);
    const targetUrl = `http://studenthub.ukw.edu.pl/~Student_800/add_animal.php`;

    try {
      const fileName = name.toLowerCase().trim().replace(/\s+/g, '') + '.jpg';

      const formData = new FormData();
      formData.append('photo', {
        uri: image,
        name: fileName,
        type: 'image/jpeg',
      });
      formData.append('Name', name);
      formData.append('Species', species);
      formData.append('Breed', breed);
      formData.append('Gender', gender);
      formData.append('Age', age);
      formData.append('Sick', sick);
      formData.append('Status', 'dostępny');
      formData.append('Other', other);
      formData.append('Box', box);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const resText = await response.text();
      const result = JSON.parse(resText);

      if (result.status === 'success') {
        Alert.alert("Sukces", "Podopieczny dodany!", [
          { text: "Super", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Błąd bazy", result.message);
      }
    } catch (error) {
      Alert.alert("Błąd połączenia", "Sprawdź XAMPP i IP.\n" + error.message);
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
        <Text style={styles.brandText}>Nowy Podopieczny</Text>
        <View style={styles.avatarMini} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Dodaj Zwierzaka</Text>

        {/* ZDJĘCIE */}
        <TouchableOpacity style={styles.imageUploadBox} activeOpacity={0.8} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#0f5238" />
              <Text style={styles.uploadText}>Dodaj zdjęcie</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* IMIĘ */}
        <View style={styles.bentoInput}>
          <Text style={styles.inputLabel}>Imię</Text>
          <TextInput style={styles.textInput} placeholder="np. Ahmed" value={name} onChangeText={setName} />
        </View>

        {/* GATUNEK */}
        <Text style={styles.sectionLabel}>Gatunek</Text>
        <View style={styles.pillRow}>
          {speciesOptions.map((item) => (
            <TouchableOpacity key={item} style={[styles.pill, species === item && styles.pillActive]} onPress={() => setSpecies(item)}>
              <Text style={[styles.pillText, species === item && styles.pillTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RASA I WIEK */}
        <View style={[styles.row, { marginTop: 5 }]}>
          <View style={[styles.bentoInput, { flex: 2 }]}>
            <Text style={styles.inputLabel}>Rasa</Text>
            <TextInput style={styles.textInput} placeholder="np. Dachowiec" value={breed} onChangeText={setBreed} />
          </View>
          <View style={[styles.bentoInput, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Wiek</Text>
            <TextInput style={styles.textInput} placeholder="np. 3" value={age} onChangeText={setAge} keyboardType="numeric" />
          </View>
        </View>

        {/* PŁEĆ I CHOROBA */}
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.sectionLabel}>Płeć</Text>
            <View style={styles.pillRowSmall}>
              {genderOptions.map((item) => (
                <TouchableOpacity key={item} style={[styles.pillSmall, gender === item && styles.pillActive]} onPress={() => setGender(item)}>
                  <Text style={[styles.pillTextSmall, gender === item && styles.pillTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.sectionLabel}>Chory?</Text>
            <View style={styles.pillRowSmall}>
              {sickOptions.map((item) => (
                <TouchableOpacity key={item} style={[styles.pillSmall, sick === item && styles.pillActive]} onPress={() => setSick(item)}>
                  <Text style={[styles.pillTextSmall, sick === item && styles.pillTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* BOX */}
        <View style={[styles.bentoInput, { marginTop: 20 }]}>
          <Text style={styles.inputLabel}>Numer Boxu</Text>
          <TextInput style={styles.textInput} placeholder="np. 12" value={box} onChangeText={setBox} keyboardType="numeric" />
        </View>

        {/* OPIS */}
        <View style={[styles.bentoInput, { marginTop: 12, minHeight: 100 }]}>
          <Text style={styles.inputLabel}>Opis</Text>
          <TextInput style={styles.textInput} placeholder="Dodatkowe informacje..." value={other} onChangeText={setOther} multiline />
        </View>

        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.submitWrapper}>
          <LinearGradient colors={['#0f5238', '#2d6a4f']} style={styles.submitBtn}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Zapisz w bazie</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  scrollPadding: { paddingHorizontal: 24, paddingBottom: 60 },
  header: { height: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ececff' },
  brandText: { fontSize: 18, fontWeight: '800', color: '#0f5238' },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#0f5238', marginTop: 20, marginBottom: 20 },
  imageUploadBox: { width: '100%', aspectRatio: 1.2, borderRadius: 30, backgroundColor: '#f4f2ff', borderWidth: 2, borderColor: '#ececff', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center' },
  uploadText: { fontSize: 14, fontWeight: '700', color: '#0f5238', marginTop: 10 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  bentoInput: { backgroundColor: '#fff', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#ececff', marginBottom: 4 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#0f5238', textTransform: 'uppercase', marginBottom: 4 },
  textInput: { fontSize: 16, fontWeight: '600', color: '#161a32' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#0f5238', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
  pillRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  pillRowSmall: { flexDirection: 'row', gap: 8 },
  pill: { flex: 1, paddingVertical: 12, borderRadius: 99, borderWidth: 1, borderColor: '#ececff', backgroundColor: '#fff', alignItems: 'center' },
  pillSmall: { flex: 1, paddingVertical: 12, borderRadius: 15, borderWidth: 1, borderColor: '#ececff', alignItems: 'center', backgroundColor: '#fff' },
  pillActive: { backgroundColor: '#0f5238', borderColor: '#0f5238' },
  pillText: { fontWeight: '700', color: '#404943' },
  pillTextSmall: { fontSize: 13, fontWeight: '700', color: '#404943' },
  pillTextActive: { color: '#fff' },
  submitBtn: { paddingVertical: 18, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  submitWrapper: { marginTop: 30 },
});