import React, {useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullScreenChz from 'react-native-fullscreen-chz';

import Loading from './Components/Loading';
import ConfigIp from './Components/ConfigIp';
import Accueil from './Components/Accueil';
 
import Merci from './Components/Merci';
import Restart from './Components/Restart';
import { LogBox } from 'react-native';

// Ignore all log notifications:
LogBox.ignoreAllLogs();

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
        <Stack.Screen name="Merci" component={Merci} />  
        <Stack.Screen name="Restart" component={Restart} /> 
              
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;

