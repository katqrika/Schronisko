import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = ({ navigation, activeRoute }) => {
  const tabs = [
    { id: 'Home', label: 'Główna', icon: 'home-outline', activeIcon: 'home' },
    { id: 'Calendar', label: 'Kalendarz', icon: 'calendar-outline', activeIcon: 'calendar' },
    { id: 'Search', label: 'Zwierzęta', icon: 'paw-outline', activeIcon: 'paw' },
    { id: 'Report', label: 'Raport', icon: 'document-text-outline', activeIcon: 'document-text' },
  ];

  return (
    <View style={styles.navWrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigation.navigate(tab.id)}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22} // Powrót do mniejszej ikonki
                color={isActive ? '#0f5238' : '#64748b'}
              />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 25, // Odstęp od dołu ekranu
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 75, // Przywrócona Twoja oryginalna wysokość
    borderRadius: 35,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 22,
    minWidth: 65, // Mniejsza szerokość pastylki
  },
  navItemActive: {
    backgroundColor: '#dcfce7', // Zielone tło tylko dla aktywnego
  },
  navText: {
    fontSize: 10, // Mała czcionka jak na początku
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#0f5238',
    fontWeight: '800',
    fontSize: 10,
  },
});

export default BottomNav;