import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    // Upewnij się, że ten adres IP to adres IPv4 Twojego komputera!
    const API_URL = 'https://www.schronisko.w5.lt/login.php';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (e) {
  // Najpierw wypisujemy to, co faktycznie przyszło z serwera
  console.log("To co przyszło z serwera:", rawText); 
  
  // Dopiero potem rzucamy błąd, który przerwie działanie i pokaże Alert
  throw new Error("Serwer nie zwrócił poprawnego JSON-a.");
}

      if (result.status === "success") {
        Alert.alert("Sukces", "Witaj " + result.user.name);
        
        // Zmiana: Przekierowanie na podstawie roli użytkownika
        if (result.user.role === 'admin') {
          navigation.replace('AdminPanel', { userId: result.user.id });
        } else {
          navigation.replace('Home', { userId: result.user.id });
        }
        
      } else {
        Alert.alert("Błąd", result.message);
      }
    } catch (error) {
      Alert.alert("Błąd krytyczny", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Dekoracyjne tła (odpowiednik Twoich blurów z HTML) */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header - Brand Identity */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Twój Pupil</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.imageShadow}>
              <Image 
                source={require('../assets/t_dog-cat2825.jpg')} 
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.welcomeTitle}>Witaj z powrotem</Text>
          </View>

          {/* Login Card Container */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Login</Text>
              <TextInput 
                style={styles.input} 
                placeholder="nowak123" 
                placeholderTextColor="#707973"
                value={login}
                onChangeText={setLogin}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hasło</Text>
              <TextInput 
                style={styles.input} 
                placeholder="••••••••" 
                placeholderTextColor="#707973"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fbf8ff' 
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  // Dekoracyjne kółka w tle
  decorCircle1: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#b1f0ce',
    opacity: 0.2,
  },
  decorCircle2: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffdcbc',
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 35,
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e5138', // primary-fixed-variant
    letterSpacing: -0.5,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 4,
    marginBottom: 20,
  },
  logoImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
  },
  welcomeTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#161a32', // on-surface
    marginBottom: 8,
  },
  welcomeSubtitle: { 
    fontSize: 15, 
    color: '#404943', // on-surface-variant
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: { 
    width: '100%', 
    backgroundColor: '#f4f2ff', // surface-container-low
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404943',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: { 
    fontSize: 16, 
    backgroundColor: '#e5e6ff', // surface-container-high
    borderRadius: 16, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#161a32',
  },
  loginButton: { 
    backgroundColor: '#0f5238', // primary
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: "#0f5238",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  signUpButton: { 
    paddingVertical: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(15, 82, 56, 0.1)', 
    backgroundColor: '#e5e6ff',
    alignItems: 'center',
    marginTop: 12,
  },
  signUpButtonText: { 
    color: '#0f5238', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#404943',
    fontWeight: '500',
  },
  footerLink: {
    color: '#0f5238',
    fontWeight: 'bold',
  }
});