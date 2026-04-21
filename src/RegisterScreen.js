import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !birthDate || !login || !password) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie wymagane pola.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są identyczne.");
      return;
    }

    // ZMIENIONY ADRES IP
    const API_URL = 'http://studenthub.ukw.edu.pl/~Student_800/register.php';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: firstName,
          Lastname: lastName,
          BirthDate: birthDate,
          Phone: phone,
          Login: login,
          Password: password
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        Alert.alert("Sukces", "Konto zostało utworzone!", [
          { text: "Zaloguj się", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert("Błąd", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd połączenia", "Nie udało się połączyć z serwerem. Sprawdź czy XAMPP działa i IP jest poprawne.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.decorCircle} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Twój pupil</Text>
          </View>
          <View style={styles.heroSection}>
            <Text style={styles.welcomeTitle}>Dołącz do nas</Text>
            {/* Tekst usunięty zgodnie z prośbą */}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Dane osobowe</Text>
            <View style={styles.inputRow}>
              <TextInput 
                style={[styles.input, { flex: 1, marginRight: 8 }]} 
                placeholder="Imię" 
                value={firstName} 
                onChangeText={setFirstName} 
              />
              <TextInput 
                style={[styles.input, { flex: 1 }]} 
                placeholder="Nazwisko" 
                value={lastName} 
                onChangeText={setLastName} 
              />
            </View>
            {/* POWIĘKSZONA RUBRYKA DATY */}
            <Text style={styles.sectionTitle}>Data urodzenia</Text>
            <TextInput 
              style={[styles.input, styles.inputBirthDate]} 
              placeholder="RRRR-MM-DD" 
              value={birthDate} 
              onChangeText={setBirthDate} 
            />
            <Text style={styles.sectionTitle}>Numer telefonu</Text>

            <TextInput 
              style={styles.input} 
              placeholder="+48123456789" 
              keyboardType="phone-pad" 
              value={phone} 
              onChangeText={setPhone} 
            />

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Dane konta</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Login" 
              autoCapitalize="none" 
              value={login} 
              onChangeText={setLogin} 
            />

            <TextInput 
              style={styles.input} 
              placeholder="Hasło" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />

            <TextInput 
              style={styles.input} 
              placeholder="Powtórz hasło" 
              secureTextEntry 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Stwórz konto</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Masz już konto? <Text style={styles.footerLink}>Zaloguj się</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbf8ff' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  decorCircle: {
    position: 'absolute', top: -50, right: -50, width: 200, height: 200,
    borderRadius: 100, backgroundColor: '#b1f0ce', opacity: 0.3,
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 35, gap: 8 },
  headerIcon: { fontSize: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0e5138' },
  heroSection: { marginBottom: 25 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: '#161a32' },
  formCard: {
    backgroundColor: '#f4f2ff', padding: 20, borderRadius: 24,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f5238', marginBottom: 10, marginLeft: 5 },
  label: { fontSize: 12, color: '#0f5238', fontWeight: '600', marginBottom: 4, marginLeft: 5 },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  input: { 
    backgroundColor: '#e5e6ff', borderRadius: 12, paddingHorizontal: 15, 
    paddingVertical: 12, fontSize: 16, color: '#161a32', marginBottom: 12 
  },
  // NOWY STYL DLA DATY
  inputBirthDate: {
    paddingVertical: 18, 
    fontSize: 16,
    color: '#161a32',
  },
  registerButton: { 
    backgroundColor: '#0f5238', paddingVertical: 16, borderRadius: 15, 
    alignItems: 'center', marginTop: 10, elevation: 4,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { marginTop: 25, alignItems: 'center' },
  footerText: { color: '#404943', fontSize: 14 },
  footerLink: { color: '#0f5238', fontWeight: 'bold' },
});