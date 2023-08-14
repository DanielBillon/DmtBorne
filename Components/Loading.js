import React, { useState, useEffect } from 'react';
import { StatusBar, Modal,ActivityIndicator, StyleSheet, Text, View,PermissionsAndroid,Image } from "react-native";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';

const load = require('./Img/loading-o2ci.gif');
let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);



const Loading = ({ navigation }) => {
  const [Screen,SetScreen]=useState('loading');

  useEffect(() => {
    console.log("PAGE : "+Screen);
    requestPermission();
    if(Screen=='loading'){
      const timer_maj = setTimeout(() => {
        CreationBd();
      }, 5000);
      return () => {
        clearTimeout(timer_maj);
  
      }
    }

    
    
  }, [Screen])

  const CreationBd=()=>{
    console.log("creation db");
    db.transaction((tx) => {
      //////////////CREATION DIFFERENTES TABLE MODULE
      tx.executeSql('create table if not exists module (id integer primary key autoincrement, id_infirmerie integer, infirmerie text)');

      tx.executeSql('create table if not exists ticket (id_ticket integer primary key autoincrement,id_infirmerie integer, date_ticket date, heure_ticket time, id_entreprise integer, id_type_usage integer, id_operation integer, pref text, seq text, statut_ticket text, last_modified datetime, statut_send integer)');

      tx.executeSql('create table if not exists entreprises (id_entreprise integer primary key autoincrement, nom_entreprise text, logo_entreprise text, deleted text, last_modified datetime, statut_img integer)');

      tx.executeSql('create table if not exists prestations (id_prestation integer primary key autoincrement, lib_prestation text, prefixe_prestation text,  icon_prestation text, deleted text, last_modified datetime, statut_img integer)');

      tx.executeSql('create table if not exists type_patient (id_type_patient integer primary key autoincrement, lib_type_patient text, icon_type_patient text, deleted text, last_modified datetime , statut_img integer)');

      tx.executeSql('create table if not exists ipserver (id_ipipserver integer primary key autoincrement, protocole text, ipserver text)');

      ////VERIFICATION DE CONFIG EXISTANTE
      tx.executeSql('select count(*) total_config,id_infirmerie,infirmerie from module ', [], function (tx, results) {
        var work = results.rows.item(0);
        var total_config = work.total_config;
        //console.log("total_config: ", total_config);
        if (total_config == '0') {

          console.log('CONFIGURATION NON DEFINIE');
          SetScreen('config');
          navigation.navigate('ConfigIp');
        }
        else {
          let id_infirmerie = work.id_infirmerie;
          let infirmerie = work.infirmerie;
          SetScreen('accueil');
          navigation.navigate('Accueil',{
            IdInfirmerie:id_infirmerie,
            Infirmerie:infirmerie,
      
          });

        }
      });

    

    })
  }
  
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,

      ]);
      return granted;
      
    }
     catch (err) {
      console.warn(err);
    }
  };
  
  
  

  

  

  return (
    <View style={[le_styles.container]}>
      <StatusBar
        animated={true}
        hidden={true} 
      />
      <Image source={load} style={styles.img_operation}  /> 
    </View>
  );
};

const le_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:'center',
  },
  
});
export default Loading;
