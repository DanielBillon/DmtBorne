import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import FullScreenChz from 'react-native-fullscreen-chz';

import Loading from './Components/Loading';
import ConfigIp from './Components/ConfigIp';
import Accueil from './Components/Accueil';
 
import Beneficiaire from './Components/Beneficiaire';
import Prestation from './Components/Prestation';

import { LogBox } from 'react-native';

// Ignore all log notifications:
LogBox.ignoreAllLogs();
let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    FullScreenChz.enable();
    //FullScreenChz.disable();
  }, [])

  
  return (
    <NavigationContainer>
      <Stack.Navigator  
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="Loading"
      >
        <Stack.Screen name="Loading" component={Loading} />  
        <Stack.Screen name="ConfigIp" component={ConfigIp} />  
        <Stack.Screen name="Accueil" component={Accueil} />  
        <Stack.Screen name="Beneficiaire" component={Beneficiaire} />  
        <Stack.Screen name="Prestation" component={Prestation} />  
              
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;

