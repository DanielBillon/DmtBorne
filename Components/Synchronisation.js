import React, { useState, useEffect } from 'react';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {IP_SERVER} from './constants';
import axios from 'axios';


let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Synchronisation = ({Retour,Screen}) => {
    /*DEBUT MISE A JOUR */
  useEffect(()=>{
    const timer_misej = setInterval(() => {
      synchro_DATA();
    }, 5000);
    return () => {
      clearInterval(timer_misej);

    }

  },[])


  const synchro_DATA=()=>{
    db.transaction((tx) => {
      ////SYNCHRO ENTREPRISES
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM entreprises  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        let url=IP_SERVER+"/check_appel.php?last_modified="+last_modified+"&get_data_entreprise";
        //console.log("url 1:"+ url);
        axios.get(url)
        .then(res => {
          const data = res.data;
          //console.log("ENTREPRISE DATA : " +data.length);
          return data.map(function(donnees) {
            let id_entreprise=donnees.id_entreprise;
            let nom_entreprise=donnees.nom_entreprise;
            let logo_entreprise=donnees.logo_entreprise;
            let deleted=donnees.deleted;
            let last_modified=donnees.last_modified;
            let statut_img=0;
            db.transaction(function(tx){
                tx.executeSql('INSERT OR REPLACE into entreprises (id_entreprise,nom_entreprise,logo_entreprise,deleted,last_modified,statut_img) VALUES (?,?,?,?,?,?)', [id_entreprise,nom_entreprise,logo_entreprise,deleted,last_modified,statut_img]);
            });
            
          }) 
        })        
              
      });
      
      ////SYNCHRO TYPE PATIENT
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM type_patient  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        let url=IP_SERVER+"/check_appel.php?last_modified="+last_modified+"&get_data_type_patient";
        //console.log("url 1:"+ url);
        axios.get(url)
        .then(res => {
          const data = res.data;
          return data.map(function(donnees) {
            //console.log(donnees);
            let id_type_patient=donnees.id_type_patient;
            let lib_type_patient=donnees.lib_type_patient;
            let icon_type_patient=donnees.icon_type_patient;
            let deleted=donnees.deleted;
            let last_modified=donnees.last_modified;
            let statut_img=0;
            db.transaction(function(tx){
                tx.executeSql('INSERT OR REPLACE into type_patient (id_type_patient,lib_type_patient,icon_type_patient,deleted,last_modified,statut_img) VALUES (?,?,?,?,?,?)', [id_type_patient,lib_type_patient,icon_type_patient,deleted,last_modified,statut_img]);
            });
            
          }) 
        })
              
      });

      ////SYNCHRO CATEGORIE
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM categorie limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        let url=IP_SERVER+"/check_appel.php?last_modified="+last_modified+"&get_data_categorie";
        //console.log("url 1:"+ url);
        axios.get(url)
        .then(res => {
          const data = res.data;
          return data.map(function(donnees) {
            //console.log(donnees);
            let id_categorie=donnees.id_categorie;
            let categorie=donnees.categorie;
            let sous_categorie=donnees.sous_categorie;
            let icon_categorie=donnees.icon_categorie;
            let deleted=donnees.deleted;
            let last_modified=donnees.last_modified;
            db.transaction(function(tx){
                tx.executeSql('INSERT OR REPLACE into categorie (id_categorie,categorie,sous_categorie,icon_categorie,deleted,last_modified) VALUES (?,?,?,?,?,?)', [id_categorie,categorie,sous_categorie,icon_categorie,deleted,last_modified]);
            });
            
          }) 
        })
              
      });

      ////SYNCHRO PRESTATIONS
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM prestations  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        let url=IP_SERVER+"/check_appel.php?last_modified="+last_modified+"&get_data_prestations";
        //console.log("url 1:"+ url);
        axios.get(url)
        .then(res => {
          const data = res.data;
          return data.map(function(donnees) {
            //console.log(donnees);
            let id_prestation=donnees.id_prestation;
            let lib_prestation=donnees.lib_prestation;
            let prefixe_prestation=donnees.prefixe_prestation;
            let icon_prestation=donnees.icon_prestation;
            let deleted=donnees.deleted;
            let last_modified=donnees.last_modified;
            let id_categorie=donnees.id_categorie;
            let statut_img=0;
            db.transaction(function(tx){
                tx.executeSql('INSERT OR REPLACE into prestations (id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img,id_categorie) VALUES (?,?,?,?,?,?,?,?)', [id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img,id_categorie]);
            });
            
          }) 
        })
              
      });
      
    });

  }
  

  /*FIN MISE A JOUR */
};


export default Synchronisation;

