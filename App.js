import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import HomeScreen from './src/HomeScreen';
import SearchScreen from './src/SearchScreen';
import CalendarScreen from './src/CalendarScreen';
import ReportScreen from './src/ReportScreen';
import DetailsScreen from './src/DetailsScreen';
import AdminPanel from './src/AdminPanel';
import AddAnimal from './src/AddAnimalScreen';
import AddAnnouncment from './src/AddAnnouncment';
import AdminVisitCard from './src/AdminVisitCard';  

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
        <Stack.Screen name="AddAnimal" component={AddAnimal} />
        <Stack.Screen name="AddAnnouncment" component={AddAnnouncment} />
        <Stack.Screen name="AdminVisitCard" component={AdminVisitCard} /> 
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}