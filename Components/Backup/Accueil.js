import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text} from 'react-native';
import Paginate from './Paginate';
import Entreprise from './Entreprise';
import Synchronisation from './Synchronisation';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {IP_SERVER} from './constants';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import Bottom from './Bottom';

const bg = require('./Img/background_white.png');

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Accueil = ({route, navigation }) => {
  const { IdInfirmerie,Infirmerie} = route.params;
  const [Screen,SetScreen]=useState('accueil');

  const [connexion, setConnexion] = useState('oui');
  const [connexion_printer, setConnexionPrinter] = useState('oui');
  const [reloadNow, setReloadNow] = useState(0);
  const [StatutDevice,setStatutDevice]=useState('');
  const [StatutBattery,setStatutBattery]=useState('');
  const [Niveau,SetNiveau]=useState();

  const vendor_id = 1155;
  const product_id = 22304;

  const [printers, setPrinters] = useState([]);
  //////
  const [listeEntreprise, setListeEntreprise] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listeEntreprise.slice(indexOfFirstPost, indexOfLastPost);


   useEffect(() => {
    /* db.transaction((tx) => {
      tx.executeSql('DELETE FROM ticket ', []);
    }); */
    
    console.log("PAGE : "+Screen);
    les_entreprises();
  }, [currentPage,Screen])

  useEffect(()=>{
    detect_printer();
    //console.log('STATUT DEVICE : '+StatutDevice);
    //console.log('STATUT BATTERY : '+StatutBattery);
    if(StatutDevice=='HorsService' && StatutBattery=='En charge'){
      //setLe_modal('restart');
    }
  },[reloadNow])

  useEffect(() => {
    const timer_maj_1 = setInterval(() => {
        send_data();
        test_connexion();
        Niveaubattery();
      }, 2000);
      return () => {
        clearInterval(timer_maj_1);
        console.log('fin');
  
    }
  }, [])

  const detect_printer=()=>{
    USBPrinter.init().then(() => {
      //list printers
      USBPrinter.getDeviceList().then(setPrinters);
      
      const total_connected = printers.length;
      //setTotal_printer(parseInt(total_connected))
      //console.log("total_connected :" + total_connected)
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

  const Niveaubattery=()=>{
    DeviceInfo.getBatteryLevel().then((batteryLevel) => {
      SetNiveau(parseInt(batteryLevel*100));
      EtatBattery(parseInt(batteryLevel*100));

    });
    
  }

  const EtatBattery=(Niveau_1)=>{
    DeviceInfo.isBatteryCharging().then((isCharging) => {
      //console.log('Niveau :'+Niveau_1);
            
      if(isCharging==true){
        setStatutBattery('En charge')
        
      }
      else{
        if(Niveau_1!='100'){
          setStatutBattery('Debranche');
          setStatutDevice('HorsService');
          navigation.navigate('Restart');
        }
      }
      
    });
    
  }
  

  const test_connexion = () => {
    setReloadNow((reloadNow) => reloadNow + 1);
    let url= IP_SERVER+"/check_appel.php?demande_connexion";
    //console.log(url);
    axios.get(url)
    .then(res => {
      const data = res.data;
      if (data == 'ok') {
        setConnexion('oui');
      }
    })
    .catch(err=>{
      setConnexion('non');
    })

  }

  

  const les_entreprises=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM entreprises WHERE deleted='faux'", [], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
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
  const send_data=()=> {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM ticket WHERE statut_send=0 ORDER BY id_ticket ASC limit 1', [], function (tx, results) {
        var nb_data = results.rows.length;

        ///SI LA TABLE EST VIDE
        if (nb_data == '0') {
          console.log('no data send');
        }
        else {
          var work = results.rows.item(0);
          var id_ticket = work.id_ticket; 
          var id_infirmerie = work.id_infirmerie; 
          var date_ticket = work.date_ticket;
          var heure_ticket = work.heure_ticket;
          var id_entreprise = work.id_entreprise;
          var id_type_usage = work.id_type_usage;
          var id_operation = work.id_operation;
          var pref = work.pref;
          var seq = work.seq;
          var last_modified = work.last_modified;
          var sexe = work.sexe;
          var annee_naissance = work.annee_naissance;

          var url=IP_SERVER+"/check_appel.php?id_ticket="+id_ticket+"&date_ticket="+date_ticket+"&heure_ticket="+heure_ticket+"&id_entreprise="+id_entreprise+"&pref="+pref+"&seq="+seq+"&last_modified="+last_modified+"&id_type_usage="+id_type_usage+"&id_operation="+id_operation+"&sexe="+sexe+"&annee_naissance="+annee_naissance+"&send_ticket";

          console.log(url);
          axios.get(url)
          .then(res => {
            const data = res.data;
            if (data == 'ok') {
              db.transaction((tx) => {
                tx.executeSql('UPDATE ticket SET statut_send=1 where id_ticket=?', [id_ticket]);
              });
            }
          })
          .catch(err=>{
            console.log("Une erreur de connexion");
          })

        }

      });
    });
  }

  return (
    <ImageBackground source={bg}  style={styles.bg_accueil}>
      <View style={styles.contain}>
        <View>
          <Synchronisation les_entreprises={les_entreprises} />
        </View>
        <View>
          <Entreprise posts={currentPosts} next_step={next_step} />
        </View>
        <View>
          <Bottom/>
        </View>
        
        
        
      </View>
        
          
           
    </ImageBackground>
  );
};

export default Accueil;

