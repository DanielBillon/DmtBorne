import React, { useState, useEffect } from 'react';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {SETTING_SERVER} from './constants';

import { TextInput, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions,Modal, ActivityIndicator,Alert } from 'react-native';

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const load = require('./Img/loading-o2ci.gif');

const ConfigIp = ({ navigation }) => {
  const [Screen,SetScreen]=useState('config');

  const [adresse, setAdresse] = useState('');
  const [protocol, setProtocol] = useState('');
  const [serveur, setServeur] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [le_modal, setLe_modal] = useState('');
  const [downloadData, setDownloadData] = useState(false);
  const [IdInfirmerie, setIdInfirmerie] = useState('');
  const [Infirmerie, setInfirmerie] = useState('');

  const [checkDownloadImgEntreprise, setcheckDownloadImgEntreprise] = useState(false);
  const [checkDownloadImgpatient, setcheckDownloadImgpatient] = useState(false);
  const [checkDownloadImgprestation, setcheckDownloadImgprestation] = useState(false);

  const [PictureEntreprise, SetPictureEntreprise] = useState('');
  const [IdpictureEntreprise, SetIdpictureEntreprise] = useState('');
  const [PicturePatient, SetPicturePatient] = useState('');
  const [IdpicturePatient, SetIdpicturePatient] = useState('');
  const [PicturePrestation, SetPicturePrestation] = useState('');
  const [IdpicturePrestation, SetIdpicturePrestation] = useState('');

 


  useEffect(() => {
    console.log("PAGE : "+Screen);
    if(Screen=='config'){
      if(downloadData==true){
        console.log('DEBUT TELECHARGEMENT DATA');
        const timer_misej = setInterval(() => {
          synchro_bd();
  
          if(checkDownloadImgEntreprise==false){
            checkDownloadImgEntreprise_process();
          }
          if(checkDownloadImgpatient==false){
            checkDownloadImgpatient_process();
          }
          if(checkDownloadImgprestation==false){
            checkDownloadImgprestation_process();
          }
  
        }, 5000);
        return () => {
          clearInterval(timer_misej);
    
        }
      }

    }
    
    
  }, [serveur,Screen])

  useEffect(() => {
    if(checkDownloadImgEntreprise==true){
      startdownload_imgEntreprise();
    }
  }, [checkDownloadImgEntreprise])

  useEffect(() => {
    if(checkDownloadImgpatient==true){
      startdownload_imgPatient();
    }
  }, [checkDownloadImgpatient])

  useEffect(() => {
    if(checkDownloadImgprestation==true){
      startdownload_imgPrestation();
    }
  }, [checkDownloadImgprestation])



  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };

  

  const synchro_bd=()=>{
    console.log('synchronisation');
    db.transaction(function(tx){
      tx.executeSql("SELECT *,(SELECT COUNT(id_entreprise) FROM entreprises WHERE logo_entreprise!='non defini' and deleted='faux' and statut_img='0')AS tt_logo_entreprise, (SELECT COUNT(id_prestation) FROM prestations WHERE icon_prestation!='non defini' and deleted='faux' and statut_img='0')AS tt_icon_prestation,(SELECT COUNT(id_type_patient) FROM type_patient WHERE icon_type_patient!='non defini' and deleted='faux' and statut_img='0')AS tt_icon_type_patient FROM entreprises limit 1", [], function(tx, results){
          
        var work = results.rows.item(0);  
        var tt_logo_entreprise=work.tt_logo_entreprise;
        var tt_icon_prestation=work.tt_icon_prestation;
        var tt_icon_type_patient=work.tt_icon_type_patient;
        console.log("tt_logo_entreprise : "+tt_logo_entreprise);
        console.log("tt_icon_prestation : "+tt_icon_prestation);
        console.log("tt_icon_type_patient : "+tt_icon_type_patient);

        if(tt_logo_entreprise==0 && tt_icon_prestation==0 && tt_icon_type_patient==0){
          console.log("FIN DE LA MISE A JOUR");
          db.transaction(function(tx){
            tx.executeSql('select count(*) tt_ligne from ipserver ', [], function (tx, results) {
              var work = results.rows.item(0);
              var tt_ligne = work.tt_ligne;
              if (tt_ligne == '0') {
                tx.executeSql("INSERT INTO ipserver (protocole,ipserver) VALUES (?,?)", [protocol, adresse]);
              }
              else {
                tx.executeSql("UPDATE ipserver SET protocole=? , ipserver=?", [protocol, adresse]);
              }
            });

            tx.executeSql('INSERT into module (id_infirmerie,infirmerie) VALUES (?,?)', [IdInfirmerie,Infirmerie]);
            setDownloadData(false);
            setServeur(serveur);
            SetScreen('accueil');
            navigation.navigate('Accueil',{
              IdInfirmerie:IdInfirmerie,
              Infirmerie:Infirmerie,
        
            }); 
        });
          
        }
                     
      });

      ////SYNCHRO ENTREPRISES
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM entreprises  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        if(last_modified==null){
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_entreprise";
          //console.log("url 1:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
              //console.log(donnees);
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
          .catch((error) => {
              
          }); 

        }
        else{
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_entreprise";
          //console.log("url 2:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
              //console.log(donnees);
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
          .catch((error) => {
              
          }); 

        }
              
      });

      ////SYNCHRO TYPE PATIENT
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM type_patient  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        if(last_modified==null){
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_type_patient";
          //console.log("url 1:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
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
          .catch((error) => {
              
          }); 

        }
        else{
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_type_patient";
          //console.log("url 2:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
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
          .catch((error) => {
              
          }); 

        }
              
      });

      ////SYNCHRO PRESTATIONS
      tx.executeSql('SELECT MAX(last_modified)AS last_modified FROM prestations  limit 1', [], function(tx, results){
        var work = results.rows.item(0);  
        var last_modified=work.last_modified;
        //console.log("MAX DATE : "+last_modified );
        if(last_modified==null){
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_prestations";
          //console.log("url 1:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
              //console.log(donnees);
              let id_prestation=donnees.id_prestation;
              let lib_prestation=donnees.lib_prestation;
              let prefixe_prestation=donnees.prefixe_prestation;
              let icon_prestation=donnees.icon_prestation;
              let deleted=donnees.deleted;
              let last_modified=donnees.last_modified;
              let statut_img=0;
              db.transaction(function(tx){
                  tx.executeSql('INSERT OR REPLACE into prestations (id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img) VALUES (?,?,?,?,?,?,?)', [id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img]);
              });
              
            
            
            }) 
          
          })
          .catch((error) => {
              
          }); 

        }
        else{
          let url="" + serveur + "/"+SETTING_SERVER.dossier+"/check_appel.php?last_modified="+last_modified+"&get_data_prestations";
          //console.log("url 2:"+ url);
          fetch(url)
          .then((response) => response.json())
          .then(function(json) {
            return json.map(function(donnees) {
              //console.log(donnees);
              let id_prestation=donnees.id_prestation;
              let lib_prestation=donnees.lib_prestation;
              let prefixe_prestation=donnees.prefixe_prestation;
              let icon_prestation=donnees.icon_prestation;
              let deleted=donnees.deleted;
              let last_modified=donnees.last_modified;
              let statut_img=0;
              db.transaction(function(tx){
                  tx.executeSql('INSERT OR REPLACE into prestations (id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img) VALUES (?,?,?,?,?,?,?)', [id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img]);
              });
              
            
            
            }) 
          
          })
          .catch((error) => {
              
          }); 

        }
              
      });

                                           
    });

  }

  const checkDownloadImgEntreprise_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM entreprises WHERE logo_entreprise!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data=='0'){
        }
        else {
          var work = results.rows.item(0);  
          var image=work.logo_entreprise;
          var id_entreprise=work.id_entreprise;
          SetPictureEntreprise(image);
          SetIdpictureEntreprise(id_entreprise);
          setcheckDownloadImgEntreprise(true);
          
        }
      });                    
    });
  }

  const startdownload_imgEntreprise=()=>{
    var liste = PictureEntreprise.split(".");
    console.log("img dowload: "+PictureEntreprise);
    let date = new Date();
    // Image URL which we want to download
    let image_URL = "" + serveur + "/"+SETTING_SERVER.dossier+"/img/logo/"+PictureEntreprise+"";    
    console.log(image_URL);
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +'/'+ liste[0] + ext,
        description: 'Image',
      },
    };
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      // Showing alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      //console.log(JSON.stringify(res.data));
      db.transaction(function(tx){
        tx.executeSql("UPDATE entreprises SET statut_img='1' WHERE id_entreprise=?", [IdpictureEntreprise]);
        SetIdpictureEntreprise('');
        SetPictureEntreprise('');
        setcheckDownloadImgEntreprise(false);
      });
      

      console.log('Image Downloaded Successfully.');


    })
  }

  const checkDownloadImgpatient_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM type_patient WHERE icon_type_patient!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data=='0'){
        }
        else {
          var work = results.rows.item(0);  
          var image=work.icon_type_patient;
          var id_type_patient=work.id_type_patient;
          SetPicturePatient(image);
          SetIdpicturePatient(id_type_patient);
          setcheckDownloadImgpatient(true);
          
        }
      });                    
    });
  }

  const checkDownloadImgprestation_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM prestations WHERE icon_prestation!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data=='0'){
        }
        else {
          var work = results.rows.item(0);  
          var image=work.icon_prestation;
          var id_prestation=work.id_prestation;
          SetPicturePrestation(image);
          SetIdpicturePrestation(id_prestation);
          setcheckDownloadImgprestation(true);
          
        }
      });                    
    });

  }

  const startdownload_imgPatient=()=>{
    var liste = PicturePatient.split(".");
    console.log("img dowload: "+PicturePatient);
    let date = new Date();
    // Image URL which we want to download
    let image_URL = "" + serveur + "/"+SETTING_SERVER.dossier+"/img/logo/"+PicturePatient+"";    
    console.log(image_URL);
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +'/'+ liste[0] + ext,
        description: 'Image',
      },
    };
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      // Showing alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      //console.log(JSON.stringify(res.data));
      db.transaction(function(tx){
        tx.executeSql("UPDATE type_patient SET statut_img='1' WHERE id_type_patient=?", [IdpicturePatient]);
        SetIdpicturePatient('');
        SetPicturePatient('');
        setcheckDownloadImgpatient(false);
      });
      

      console.log('Image Downloaded Successfully.');


    })
  }

  const startdownload_imgPrestation=()=>{
    var liste = PicturePrestation.split(".");
    console.log("img dowload: "+PicturePrestation);
    let date = new Date();
    // Image URL which we want to download
    let image_URL = "" + serveur + "/"+SETTING_SERVER.dossier+"/img/logo/"+PicturePrestation+"";    
    console.log(image_URL);
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +'/'+ liste[0] + ext,
        description: 'Image',
      },
    };
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      // Showing alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      //console.log(JSON.stringify(res.data));
      db.transaction(function(tx){
        tx.executeSql("UPDATE prestations SET statut_img='1' WHERE id_prestation=?", [IdpicturePrestation]);
        SetIdpicturePrestation('');
        SetPicturePrestation('');
        setcheckDownloadImgprestation(false);
      });
      

      console.log('Image Downloaded Successfully.');


    })
  }




  const add_ip = (protocol, adresse) => {
    setLe_modal('loading');
    setModalVisible(true);
    console.log("" + protocol + adresse + "/"+SETTING_SERVER.dossier+"/check_appel.php?connexion");

    const controller = new AbortController();
    const options = {
      signal: controller.signal,
      
    };  
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    fetch("" + protocol + adresse + "/"+SETTING_SERVER.dossier+"/check_appel.php?connexion",options)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data.length);
      if(data.length!=0){
        return data.map(function(element) {
          console.log(element);
          setIdInfirmerie(element.id_infirmerie);
          setInfirmerie(element.infirmerie);
          setLe_modal('synchro');
          setDownloadData(true);
          setAdresse(adresse);
          setProtocol(protocol);
          setServeur(protocol + adresse);
        }) 
        
      }
      else{
        Alert.alert(
          "Attention",
          "Impossible d'associer la borne au serveur. Serveur non configurer",
          [
            
            { text: "OK" }
          ]
        )
      }
      /* if (data == 'ok') {
        console.log("Connecté au serveur");
      }
      for (var message of data) {
        var id_queue = message.id_ticket;
        var last_modified = message.last_modified;
        var statut_queue = message.statut_ticket;
        db.transaction((tx) => {
          tx.executeSql('INSERT OR REPLACE into dmt_ticket (id_queue,statut_queue,last_modified) VALUES (?,?,?)', [id_queue, statut_queue, last_modified]);
        });
      } */

    })
    .catch((error) =>
    {
      setModalVisible(false);
      Alert.alert(
        "Erreur",
        "Adresse du serveur est incorrect. ",
        [
          
          { text: "OK" }
        ]
      )
    }
    );

    /* db.transaction((tx) => {
      tx.executeSql('select count(*) tt_ligne from ipserver ', [], function (tx, results) {
        var work = results.rows.item(0);
        var tt_ligne = work.tt_ligne;
        if (tt_ligne == '0') {
          tx.executeSql("INSERT INTO ipserver (protocole,ipserver) VALUES (?,?)", [protocol, adresse]);
          setModalVisible(false);
        }
        else {
          tx.executeSql("UPDATE ipserver SET protocole=? , ipserver=?", [protocol, adresse]);
          setModalVisible(false);
        }
      });
    }) */
  }

  const Element_modal = () => {
    if (le_modal == 'synchro') {
      return (
        <View style={styles.centeredView_setting}>
          <View style={styles.modalView_setting}>
              <Text style={styles.modalText}>Préparation de la borne </Text>
              <Text >Cela peut prendre quelques minutes </Text>
            
            

            <View >
              <Image source={load} style={styles.img_operation}  /> 
            </View>


          </View>
        </View>
      );

    }
    else if(le_modal == 'loading'){
      return(
        <View style={styles.centeredView_loading}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )
    }
    
  }

  
  return (
    <View>
      <View>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          statusBarTranslucent={true}
        >
          {Element_modal()}
        </Modal>
      </View>
       <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
            <Text style={styles.modalText}>Paramètre de configuration</Text>
            {serveur != ''
              ?
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Serveur : {serveur} </Text>
              :
              <Text ></Text>
            }

            <View style={{ flexDirection: 'row',alignItems:'center' }}>

              <View style={{ width: '80%',alignItems:'center' }}>
                <TextInput style={styles.Input_1} editable={false} value={protocol + adresse} />
              </View>

              <View style={{ width: '20%' }}>
                {adresse.length>'0'&&
                  <TouchableOpacity onPress={() => setAdresse(adresse.substr(0, adresse.length - 1))}>
                    <Image source={require('./Img/supp.png')}  />
                  </TouchableOpacity>
                }
                
              </View>

              
            </View>

            <View style={{ flexDirection: 'row' }}>


              <View style=
                {protocol == "http://"
                  ? styles.ViewNumProtocol_on
                  : styles.ViewNumProtocol
                } onTouchStart={() => setProtocol("http://")}>
                <Text style={styles.TextNumProtocol}>http://</Text>
              </View>
              <View style={protocol == "https://"
                ? styles.ViewNumProtocol_on
                : styles.ViewNumProtocol
              } onTouchStart={() => setProtocol("https://")}>
                <Text style={styles.TextNumProtocol}>https://</Text>
              </View>
            </View>






            <View style={{ width: '100%' }}>



              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "1")}>
                  <Text style={styles.TextNum}>1</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "2")}>
                  <Text style={styles.TextNum}>2</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "3")}>
                  <Text style={styles.TextNum}>3</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "4")}>
                  <Text style={styles.TextNum}>4</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "5")}>
                  <Text style={styles.TextNum}>5</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "6")}>
                  <Text style={styles.TextNum}>6</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "7")}>
                  <Text style={styles.TextNum}>7</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "8")}>
                  <Text style={styles.TextNum}>8</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "9")}>
                  <Text style={styles.TextNum}>9</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + ".")}>
                  <Text style={styles.TextNum}>.</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + "0")}>
                  <Text style={styles.TextNum}>0</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => setAdresse(adresse + ":")}>
                  <Text style={styles.TextNum}>:</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum_cancel} onTouchStart={() => {setAdresse('');setProtocol('')}}>
                  <Text style={styles.TextNum}>Annuler</Text>
                </View>
                <View style={styles.ViewNum_submit} onTouchStart={() => add_ip(protocol, adresse)}>
                  <Text style={styles.TextNum}>Valider</Text>
                </View>
              </View>


            </View>
          </View>
          <View><Text>5555</Text></View>

        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main_def: {
    flexDirection: 'row'
  },

  main_img: {
    width: '33.3%',
    /* alignItems: 'center',
    justifyContent: 'center', */
    padding: 20,
  },
  shadow_box_img: {
    width: '100%',
    height:170,
    //backgroundColor: '#666',
    /* padding: 2, */
    borderRadius: 10,
    
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 1.84,
    elevation: 5

  },
  img_operation: {
    width:500,
    height:500
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around',
  },
  Input_1: {
    color: "#596643",
    fontWeight: 'bold',
    fontSize: 42,
  },
  setting: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    /* backgroundColor:'red', */
    width: 200

  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  child_inf: {
    //padding:10,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    alignItems: 'center',
    margin: 7,
    borderWidth: 1,
    width: DEVICE_WIDTH / 3 - 14, // ... DeviceWidth / 4 - (marginLeft + marginRight + borderLeft + borderRight)
    borderRadius: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    borderColor: '#e3e3e3',
    borderBottomWidth: 2,
  },
  shadow_box: {
    width: '100%',
    /* backgroundColor: '#fff',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 2 */

  },

  operation_title_text: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'

  },
  container_1: {
    alignItems: 'center',
  },
  container_2: {
    alignItems: 'center',
  },
  container_3: {
    alignItems: 'flex-end',
  },
  main_inf: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  question_view_ticket: {
    alignItems: 'center',
    padding: 20
  },
  text_orange: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: 'bold',
    color: '#F90',
    //color:'#000',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,

  },
  modalView: {
    width: '100%',
    height: 700,
    padding: 35,
    alignItems: "center",
    

  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 50
  },

  ViewNum: {
    width: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3e3e3',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  ViewNum_cancel: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#grey',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  ViewNum_submit: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#grey',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },

  TextNum: {
    fontSize: 32,
    padding: 15,
    color: 'black'
  },

  ViewNumProtocol: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  ViewNumProtocol_on: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6600',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },

  TextNumProtocol: {
    fontSize: 32,
    padding: 15,
    color: 'white'
  },
  centeredView_loading: {
    flex: 1,
    justifyContent: "center",

  },
  centeredView_setting: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,

  },
  modalView_setting: {
    width: '80%',
    height: 700,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    
  },

});


export default ConfigIp;

