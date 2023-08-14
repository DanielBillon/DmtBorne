import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Paginate from './Paginate';
import Entreprise from './Entreprise';
import Synchronisation from './Synchronisation';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {SETTING_SERVER} from './constants';
import DeviceInfo from 'react-native-device-info';



const bg = require('./Img/background.png');


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Accueil = ({route, navigation }) => {
  const { IdInfirmerie,Infirmerie} = route.params;
  const [Screen,SetScreen]=useState('accueil');

  const [modalVisible, setModalVisible] = useState(false);
  const [le_modal, setLe_modal] = useState('');
  const [adresse, setAdresse] = useState('');
  const [protocol, setProtocol] = useState('');
  const [serveur, setServeur] = useState('');
  const [connexion, setConnexion] = useState('oui');
  const [connexion_printer, setConnexionPrinter] = useState('oui');
  const [reloadNow, setReloadNow] = useState(0);
  const [StatutDevice,setStatutDevice]=useState('');
  const [StatutBattery,setStatutBattery]=useState('');
  const [Niveau,SetNiveau]=useState();

  const vendor_id = 1155;
  const product_id = 22304;

  const [printers, setPrinters] = useState([]);

  useEffect(()=>{
    detect_printer();
    //console.log('STATUT DEVICE : '+StatutDevice);
    console.log('STATUT BATTERY : '+StatutBattery);
    if(StatutDevice=='HorsService' && StatutBattery=='En charge'){
      //console.log('RESTART');
      setLe_modal('restart');
    }
  },[reloadNow])

  useEffect(() => {
    const timer_maj_1 = setInterval(() => {
        //send_data();
        test_connexion();
        Niveaubattery();
        //client_attente();
      }, 2000);
      return () => {
        clearInterval(timer_maj_1);
        console.log('fin');
  
    }
  }, [])

  //////
  const [listeEntreprise, setListeEntreprise] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listeEntreprise.slice(indexOfFirstPost, indexOfLastPost);

  const [changePage, setchangePage] = useState(1);


  
  

   useEffect(() => {
    console.log("PAGE : "+Screen);
    les_entreprises();
  }, [currentPage,Screen])
  


  const detect_printer=()=>{
    USBPrinter.init().then(() => {
      //list printers
      USBPrinter.getDeviceList().then(setPrinters);
      
      const total_connected = printers.length;
      //setTotal_printer(parseInt(total_connected))
      console.log("total_connected :" + total_connected)
      if(total_connected!=4){
        setConnexionPrinter('non');
      }
      let newState = printers.map((e) =>
        {e.vendor_id===1155 && e.product_id===22304  &&
          //console.log("printer ok");
          USBPrinter.connectPrinter(vendor_id, product_id);
          setConnexionPrinter('oui');
        }
      );   

    })
  }

  const test_connexion = () => {
    setReloadNow((reloadNow) => reloadNow + 1);

    db.transaction((tx) => {
      tx.executeSql('select count(*) total_ip,protocole,ipserver from ipserver ', [], function (tx, results) {
        var work = results.rows.item(0);
        var total_ip = work.total_ip;
        //console.log("total_ip: ", total_ip);
        if (total_ip != '0') {
          let work = results.rows.item(0);
          let protocole = work.protocole;
          let ipserver = work.ipserver;
          let server_ip = protocole + "" + ipserver;
          console.log("server_ip :"+server_ip);
          fetch("" + server_ip + "/"+SETTING_SERVER.dossier+"/check_appel.php?demande_connexion")
            .then((resp) => resp.json())
            .then(function (data) {
              //console.log(data);
              if (data == 'ok') {
                //console.log("Connecté au serveur");
                setConnexion('oui');
              }

            })
            .catch((error) =>
              setConnexion('non')
            );


        }
        else {
          //console.log("Adresse du serveur non definie");
          setConnexion('non');
        }
      });

    })

  }

  const Niveaubattery=()=>{
    //setReloadNow((reloadNow) => reloadNow + 1);
    //console.log("ETAT :"+Etat+"\n"+"NIVEAU :"+Niveau);
    DeviceInfo.getBatteryLevel().then((batteryLevel) => {
      //console.log('Niveau :'+parseInt(batteryLevel*100));
      SetNiveau(parseInt(batteryLevel*100));
      EtatBattery(parseInt(batteryLevel*100));

    });
    
  }

  const EtatBattery=(Niveau_1)=>{
    DeviceInfo.isBatteryCharging().then((isCharging) => {
      console.log('Niveau :'+Niveau_1);
            
      if(isCharging==true){
        //console.log('En charge');
        setStatutBattery('En charge')
        
        //setModalVisible(false);
      }
      else{
        if(Niveau_1!='100'){
          //console.log('Debranché');
          setStatutBattery('Debranche');
          setStatutDevice('HorsService');
          //navigation.navigate('Restart');
          
          /* setLe_modal('courant');
          setModalVisible(true); */

          //setConnexionPrinter('non');
        }
      }
      
    });
    
  }

  const les_entreprises=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM entreprises WHERE deleted='faux'", [], (tx, results) => {
        var len = results.rows.length;
        /* if(len=='0'){
            SetLoading(true);
        }
        else{
          SetLoading(false);
        } */
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setListeEntreprise(data);
      }, null);
    })
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    
  };

  const previousPage = () => {
    if (currentPage !== 1) {
       setCurrentPage(currentPage - 1);
    }
    
 };

 const nextPage = () => {
    if (currentPage !== Math.ceil(listeEntreprise.length / postsPerPage)) {
       setCurrentPage(currentPage + 1);
    }
    
 };
 const next_step = (id_entreprise) => {
  console.log("ID_ENTREPRISE :" + id_entreprise);
  SetScreen('beneficiaire');
  navigation.navigate('Beneficiaire', {
    id_entreprise: id_entreprise,
    IdInfirmerie:IdInfirmerie,
    Infirmerie:Infirmerie
  });
}


  



  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.bg_image}>
      <SafeAreaView style={styles.contain}>
        <Synchronisation/>
        {/* <View style={styles.question_view_ticket}>
          <Text style={styles.text_orange}>Veuillez selectionner une entreprise</Text>
        </View> */}
        
          <View style={[connexion == 'non' || connexion_printer == 'non'  ? {flex:0.9} : styles.notif_clean]}>
            <Entreprise posts={currentPosts} next_step={next_step} />
            <Paginate postsPerPage={postsPerPage} totalPosts={listeEntreprise.length} paginate={paginate} previousPage={previousPage}
                  nextPage={nextPage} currentPage={currentPage} />
          </View>

          
          <View style={styles.container_3}>
          
            <View style={connexion == 'non' || connexion_printer == 'non'  ? styles.notif_error : styles.notif_clean}>
              {
                connexion == 'non' 
                ? 
                    <Text style={styles.notif_text}>Aucune connexion au serveur </Text>
                : 
                  <View></View>
              }
              {
                connexion_printer == 'non' 
                ? 
                    <Text style={styles.notif_text}>Imprimante non connecté </Text>
                :
                  <View></View>
              }
            </View>
            
            

          </View>  
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Accueil;

