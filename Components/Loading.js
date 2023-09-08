import React, { useState,useEffect } from 'react';
//import { useNavigation } from '@react-navigation/native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import { StatusBar, View,Image,PermissionsAndroid } from "react-native";
import styles from './Style';

const load = require('./Img/loading-o2ci.gif');
let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Loading = ({navigation }) => {
  //const navigation = useNavigation();
  const [Screen,SetScreen]=useState('loading');

  useEffect(() => {
    
    console.log("PAGE : "+Screen);
    requestPermission();
    if(Screen=='loading'){
      const timer_maj = setInterval(() => {
        CreationBd();
      }, 5000);
      return () => {
        clearInterval(timer_maj);
  
      }
    }
  }, [Screen])

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

  const CreationBd=()=>{
    console.log("creation db");
    db.transaction((tx) => {
      //////////////CREATION DIFFERENTES TABLE MODULE
      tx.executeSql('create table if not exists module (id integer primary key autoincrement, id_infirmerie integer, infirmerie text)');

      tx.executeSql('create table if not exists ticket (id_ticket integer primary key autoincrement,id_infirmerie integer, date_ticket date, heure_ticket time, id_entreprise integer, id_type_usage integer, id_operation integer, pref text, seq text, statut_ticket text, sexe text, annee_naissance text, last_modified datetime, statut_send integer)');

      tx.executeSql('create table if not exists entreprises (id_entreprise integer primary key autoincrement, nom_entreprise text, logo_entreprise text, deleted text, last_modified datetime, statut_img integer)');

      tx.executeSql('create table if not exists prestations (id_prestation integer primary key autoincrement, lib_prestation text, prefixe_prestation text,  icon_prestation text, deleted text, last_modified datetime, statut_img integer)');

      tx.executeSql('create table if not exists type_patient (id_type_patient integer primary key autoincrement, lib_type_patient text, icon_type_patient text, deleted text, last_modified datetime , statut_img integer)');

      ////VERIFICATION DE CONFIG EXISTANTE
      tx.executeSql('select count(*) total_config,id_infirmerie,infirmerie from module ', [], function (tx, results) {
        var work = results.rows.item(0);
        var total_config = work.total_config;
        console.log("total_config: ", total_config);
        if (total_config == 0) {

          console.log('CONFIGURATION NON DEFINIE');
          SetScreen('config');
          navigation.navigate('ConfigIp');
        }
        else {
          console.log(work.infirmerie);
          SetScreen('accueil');
          navigation.navigate('Accueil',{
            IdInfirmerie:work.id_infirmerie,
            Infirmerie:work.infirmerie,
          });
        }
      });

    })
  }
  
  
  
  
  
  return (
    <View style={styles.container_loading}>
      <StatusBar
        animated={true}
        hidden={true} 
      />
      <Image source={load} style={styles.img_operation}  /> 
    </View>
  );
};
export default Loading;
