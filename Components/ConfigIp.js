import React, { useState, useEffect } from 'react';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {IP_SERVER} from './constants';
import axios from 'axios';

import { View, Text, Image, ActivityIndicator,Button } from 'react-native';
import styles from './Style';

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);
const load = require('./Img/loading-o2ci.gif');

const ConfigIp = ({ navigation }) => {
  const [Screen, SetScreen] = useState('config');

  const [connexion, setconnexion] = useState('oui');
  const [tentative, settentative] = useState(1);
  const [message, setmessage] = useState('Tentative de connexion au serveur en cours ...');
  const [TotalImgDownload, setTotalImgDownload] = useState(0);
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

  useEffect(()=>{
    
    if(connexion=='oui'){
      const timer_connexion = setInterval(() => {
        Send_connexion();
      }, 5000);
      return () => {
        clearInterval(timer_connexion);
  
      }
    }
  },[connexion,tentative])

  useEffect(() => {
    console.log("Screen :"+ Screen +" / downloadData : "+downloadData );
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
    if(Screen=='accueil'){
      console.log("IdInfirmerie : "+IdInfirmerie+" / Infirmerie : "+Infirmerie);
      db.transaction(function(tx){
        tx.executeSql('INSERT into module (id_infirmerie,infirmerie) VALUES (?,?)', [IdInfirmerie,Infirmerie]);
        navigation.navigate('Accueil',{
          IdInfirmerie:IdInfirmerie,
          Infirmerie:Infirmerie,
    
        }); 
      });
    }
    
    
  }, [Screen,downloadData])

  useEffect(() => {
    if(checkDownloadImgEntreprise==true){
      CheckFileExist("entreprises");
    }
  }, [checkDownloadImgEntreprise])

  useEffect(() => {
    if(checkDownloadImgpatient==true){
      CheckFileExist("type_patient");
    }
  }, [checkDownloadImgpatient])

  useEffect(() => {
    if(checkDownloadImgprestation==true){
      CheckFileExist("prestations");
    }
  }, [checkDownloadImgprestation])
  

  const CheckFileExist=(table)=>{
    if(table=='entreprises'){
      var Image=PictureEntreprise;
    }

    if(table=='type_patient'){
      var Image=PicturePatient;
    }

    if(table=='prestations'){
      var Image=PicturePrestation;
    }
    
    var PATH_OF_FILE="file:///storage/emulated/0/Pictures/"+Image+"";
    //console.log("PATH_OF_FILE: file:///storage/emulated/0/Pictures/"+Image);
    RNFetchBlob.fs.exists(PATH_OF_FILE)
    .then((exist) => {
      var result=exist;
      //console.warn("result : "+exist);
      console.log(`file ${exist ? '' : 'not'} exists`)
      ////IMAGE EXISTE
      if(result==true){
        if(table=='entreprises'){
          db.transaction(function(tx){
            tx.executeSql("UPDATE entreprises SET statut_img='1' WHERE id_entreprise=?", [IdpictureEntreprise]);
            SetIdpictureEntreprise('');
            SetPictureEntreprise('');
            setcheckDownloadImgEntreprise(false);
          });

        }
    
        if(table=='type_patient'){
          db.transaction(function(tx){
            tx.executeSql("UPDATE type_patient SET statut_img='1' WHERE id_type_patient=?", [IdpicturePatient]);
            SetIdpicturePatient('');
            SetPicturePatient('');
            setcheckDownloadImgpatient(false);
          });
    
        }
    
        if(table=='prestations'){
          db.transaction(function(tx){
            tx.executeSql("UPDATE prestations SET statut_img='1' WHERE id_prestation=?", [IdpicturePrestation]);
            SetIdpicturePrestation('');
            SetPicturePrestation('');
            setcheckDownloadImgprestation(false);
          });
    
        }
        
        console.log('Image Downloaded Successfully.');
      }
      ////IMAGE EXISTE PAS
      else{
        if(table=='entreprises'){
          startdownload_imgEntreprise();
        }
    
        if(table=='type_patient'){
          startdownload_imgPatient();
        }
    
        if(table=='prestations'){
          startdownload_imgPrestation();
        }
      }
        
    })
    .catch(() => { 
      console.error("Error vérification d'existance");
    })

  }



  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };

  const Send_connexion = () => {
    let url= IP_SERVER+"/check_appel.php?connexion";
    console.log(url);
    axios.get(url)
    .then(res => {
      const data = res.data;
      //console.log(data.length);
      if(data.length=='0'){
        settentative(()=>tentative+1);
        //console.log("Impossible d'associer la borne au serveur. Serveur non configurer");
        if(tentative==10){
          setconnexion('non');
          settentative(0);
          setmessage("Impossible d'associer la borne au serveur. Serveur non configurer.");
        }
        
      }
      else{
        console.log(data[0].infirmerie);
        setconnexion('non');
        setDownloadData(true);
        setIdInfirmerie(data[0].id_infirmerie);
        setInfirmerie(data[0].infirmerie);
        
      }
      
    })
    .catch(err=>{
      settentative(()=>tentative+1)
      //console.log("Adresse du serveur est incorrect.");
      if(tentative==10){
        setconnexion('non');
        settentative(0);
        setmessage("Impossible de se connecter au serveur.");
      }
      
    })
    
  }

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

        setTotalImgDownload(tt_logo_entreprise+tt_icon_prestation+tt_icon_type_patient);

        if(tt_logo_entreprise==0 && tt_icon_prestation==0 && tt_icon_type_patient==0){
          console.log("FIN DE LA MISE A JOUR");
          //SetScreen('config');
          SetScreen('accueil');
        }
                     
      });

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
            let statut_img=0;
            db.transaction(function(tx){
                tx.executeSql('INSERT OR REPLACE into prestations (id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img) VALUES (?,?,?,?,?,?,?)', [id_prestation,lib_prestation,prefixe_prestation,icon_prestation,deleted,last_modified,statut_img]);
            });
            
          }) 
        })
              
      });

                                           
    });

  }

  const checkDownloadImgEntreprise_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM entreprises WHERE logo_entreprise!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data!='0'){
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

  const checkDownloadImgpatient_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM type_patient WHERE icon_type_patient!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data!='0'){
        
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

  const startdownload_imgEntreprise=()=>{
    var liste = PictureEntreprise.split(".");
    console.log("img dowload: "+PictureEntreprise);
    let date = new Date();
    // Image URL which we want to download
    let image_URL = IP_SERVER+"/img/logo/"+PictureEntreprise+"";    
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
      CheckFileExist("entreprises");
      


    })

    
  }

  const checkDownloadImgprestation_process=()=>{
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM prestations WHERE icon_prestation!='non defini' and deleted='faux' and statut_img='0' limit 1 ", [], function(tx, results){
          
        var nb_data= results.rows.length;
        
        if(nb_data!='0'){
        
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
    let image_URL = IP_SERVER+"/img/logo/"+PicturePatient+"";    
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
      CheckFileExist("type_patient");

    })
    
  }

  const startdownload_imgPrestation=()=>{
    var liste = PicturePrestation.split(".");
    console.log("img dowload: "+PicturePrestation);
    let date = new Date();
    // Image URL which we want to download
    let image_URL = IP_SERVER+"/img/logo/"+PicturePrestation+"";    
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
      CheckFileExist("prestations");


    })


    
  }

  const Reessayer=()=>{
    setconnexion('oui');
    setmessage("Tentative de connexion au serveur en cours ...");
    settentative(1);
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
    <View style={styles.centeredView}>
      <Text style={styles.ConfigText}>Interface de configuration</Text>
      {downloadData==false
      ?
      <>
        {connexion=='oui'
        ?
        <>
          <Text style={styles.Textconf}>{message} {tentative}</Text>
          <Image source={load} style={styles.img_operation}  /> 
        </>
        :
        <>
          <Text style={styles.Textconf}>{message}</Text>
          <Button
            title="réessayer"
            onPress={() => Reessayer()}
          />
        </>

        }
      </>
      :
      <>
          <Text style={styles.modalText}>Préparation de la borne </Text>
          <Text style={styles.Textconf}>Nombre d'image à télécharger : {TotalImgDownload} </Text>
          <Text >Cela peut prendre quelques minutes </Text>
          <Image source={load} style={styles.img_operation}  /> 
      </>
      }
      
      
      
    </View>
  );
};


export default ConfigIp;

