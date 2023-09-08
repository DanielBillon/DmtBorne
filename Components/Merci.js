import React, { useState, useEffect } from 'react';
import {Alert,Dimensions,TextInput,StatusBar,Text, View,ImageBackground,TouchableOpacity,Image,Animated,Easing} from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import Tts from 'react-native-tts';



let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const bg = require('./Img/merci_ticket.png');

const Merci = ({route,navigation }) => {
  const { IdInfirmerie,Infirmerie} = route.params;
  

  useEffect(() => {
    voix_printer();
  }, [])

  const voix_printer = () => {
    Tts.stop();
    const TEXTE_1_2 = "Veuillez récupérer votre ticket";
    Tts.speak(TEXTE_1_2, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
    setTimeout(
      function () {
        navigation.navigate('Accueil',{
          IdInfirmerie:IdInfirmerie,
          Infirmerie:Infirmerie,
        });

      }
        .bind(this),
      3000
    );

  }


  return (
    <ImageBackground source={bg} resizeMode="stretch" style={styles.imagecontainer}>
    </ImageBackground>  
  );
};



export default Merci;

