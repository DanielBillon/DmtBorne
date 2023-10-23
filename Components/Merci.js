import React, {useEffect } from 'react';
import {ImageBackground} from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import Tts from 'react-native-tts';



let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const bg = require('./Img/merci_ticket.png');

const Merci = ({next_step}) => {
  const page='merci';

  setTimeout(
    function () {
      next_step('merci',page);

    }
      .bind(this),
    3000
  );

  


  /* return (
    <ImageBackground source={bg} resizeMode="stretch" style={styles.imagecontainer}>
    </ImageBackground>  
  ); */
};



export default Merci;

