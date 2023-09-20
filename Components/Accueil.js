import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text} from 'react-native';
import Tts from 'react-native-tts';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

import Entreprise from './Entreprise';
import Beneficiaire from './Beneficiaire';
import Synchronisation from './Synchronisation';
import styles from './Style';
import {IP_SERVER} from './constants';
import Bottom from './Bottom';
import Prestation from './Prestation';
import Sexe from './Sexe';
import Annee_naissance from './Annee_naissance';
import Categorie from './Categorie';

const bg = require('./Img/background_white.png');

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Accueil = ({route, navigation }) => {
  const { IdInfirmerie,Infirmerie} = route.params;
  const [Screen,SetScreen]=useState('accueil');
  const [id_entreprise,Setid_entreprise]=useState('');
  const [id_beneficiaire,Setid_beneficiaire]=useState('');
  const [id_prestation,Setid_prestation]=useState('');
  const [id_categorie,Setid_categorie]=useState('');
  const [prefixe_prestation,Setprefixe_prestation]=useState('');
  const [title,Settitle]=useState('');
  const [prefixe_sexe,Setprefixe_sexe]=useState('');
  const [lib_sexe,Setlib_sexe]=useState('');
  const [annee, setAnnee] = useState('');
  

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
  
  useEffect(()=>{
    console.log("++++++++++"+Screen+"++++++++++"+"\n"+"id_entreprise:"+id_entreprise+"\n"+"id_beneficiaire:"+id_beneficiaire+"\n"+"id_prestation:"+id_prestation+"\n"+"id_categorie:"+id_categorie+"\n"+"prefixe_prestation:"+prefixe_prestation+"\n"+"title:"+title+"\n"+"prefixe_sexe:"+prefixe_sexe+"\n"+"lib_sexe:"+lib_sexe+"\n"+"annee:"+annee);

    
    if(Screen=='beneficiaire'){
      voix("Veuillez selectionner un bénéficiaire");
    }
    if(Screen=='categorie'){
      voix("Veuillez selectionner un motif");
    }
    if(Screen=='prestation'){
      voix("Veuillez selectionner une prestation");
    }
    if(Screen=='sexe'){
      voix("veuillez selectionner votre genre");
    }
    if(Screen=='annee_naissance'){
      voix("Veuillez saisir votre année de naissance");
    }

  },[Screen])
  

  useEffect(()=>{
    detect_printer();
    //console.log('STATUT DEVICE : '+StatutDevice);
    //console.log('STATUT BATTERY : '+StatutBattery);
    if(StatutDevice=='HorsService' && StatutBattery=='En charge'){
      //setLe_modal('restart');
    }
  },[reloadNow])

  /* useEffect(() => {
    const timer_maj_1 = setInterval(() => {
        send_data();
        test_connexion();
        Niveaubattery();
      }, 2000);
      return () => {
        clearInterval(timer_maj_1);
        console.log('fin');
  
    }
  }, []) */

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

  const voix = (LeText) => {
    Tts.stop();
    Tts.setDucking(true);
    const TEXTE_1_2 = LeText;
    Tts.speak(TEXTE_1_2, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });

  }

  
  const next_step = (id,page,pref,titre,cat_pref,id_prest) => {

    console.log("PAGE :" + page);
    
    if(page=='accueil'){
      console.log("ID_ENTREPRISE :" + id);
      Setid_entreprise(id);
      SetScreen('beneficiaire');
    }
    if(page=='beneficiaire'){
      console.log("BENEFICIAIRE :"+id);
      Setid_beneficiaire(id);
      SetScreen('categorie');
    }
    if(page=='categorie'){
      ///sous_categorie=='oui'
      if(pref=='oui'){
        //console.log("PRESTATION :"+id);
        Setid_categorie(id);
        SetScreen('prestation');

      }
      else{
        Setid_prestation(id_prest);
        Setprefixe_prestation(cat_pref);
        Settitle(titre);
        SetScreen('sexe');

      }
      
    }
    if(page=='prestation'){
      console.log("PRESTATION :"+id);
      Setid_prestation(id);
      Setprefixe_prestation(pref);
      Settitle(titre);
      SetScreen('sexe');
    }
    if(page=='sexe'){
      console.log("GENRE :"+pref);
      Setprefixe_sexe(pref);
      Setlib_sexe(titre);
      SetScreen('annee_naissance');
    }
    if(page=='annee_naissance'){
      setAnnee(id);
      imprimer(prefixe_prestation, title, id_prestation)

    }
    
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

  const Home =()=>{
    SetScreen('accueil');
    Setid_entreprise('');
    Setid_beneficiaire('');
    Setid_prestation('');
    Setid_categorie('');
    Setprefixe_prestation('');
    Settitle('');
    Setprefixe_sexe('');
    Setlib_sexe('');
    setAnnee('');

  }

  const Retour=(map)=>{
    console.log("RETOUR :"+map);
    if(map=="accueil"){
      SetScreen('accueil');
      Setid_entreprise('');
      Setid_beneficiaire('');
      Setid_prestation('');
      Setid_categorie('');
      Setprefixe_prestation('');
      Settitle('');
      Setprefixe_sexe('');
      Setlib_sexe('');
      setAnnee('');

    }
    if(map=="beneficiaire"){
      SetScreen('beneficiaire');
      Setid_beneficiaire('');
      Setid_prestation('');
      Setid_categorie('');
      Setprefixe_prestation('');
      Settitle('');
      Setprefixe_sexe('');
      Setlib_sexe('');
      setAnnee('');

    }
    if(map=="categorie"){
      SetScreen('categorie');
      Setid_prestation('');
      Setid_categorie('');
      Setprefixe_prestation('');
      Settitle('');
      Setprefixe_sexe('');
      Setlib_sexe('');
      setAnnee('');

    }
    if(map=="sexe"){
      SetScreen('sexe');
      Setprefixe_sexe('');
      Setlib_sexe('');
      setAnnee('');

    }
  }

  var date = new Date;
  function dyn_time() {
    
    var h = date.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    var m = date.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    var s = date.getSeconds();
    if (s < 10) {
      s = "0" + s;
    }
    var le_time = h + ':' + m + ':' + s;
    return le_time;
  }

  function dyn_date() {
    var la_date = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return la_date;
  }
  function formatDate() {
    var monthNames = [
      "Janvier", "Fevrier", "Mars",
      "Avril", "Mai", "Juin", "Juillet",
      "Aout", "Septembre", "Octobre",
      "Novembre", "Decembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var j = date.getDate();
    var jour = date.getDay();
    var jours = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
    //resultat = ''+jours[jour]+' '+j+' '+mois[moi]+' '+annee;

    return jours[jour] + ' ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
  
  const imprimer = (prefixe, name_ope, id_op) => {
    //var id=1;
    ////NOMBRE DE PATIENT ATTENTE

    let url= IP_SERVER+"/check_appel.php?get_en_attente&id_prestation="+id_op;
    console.log(url);
    axios.get(url)
    .then(res => {
      const data = res.data[0].en_attente;
      console.log('eeee' +data);
      start_impression(data,prefixe, name_ope, id_op);
    })
    .catch(err=>{
      const data=0;
      start_impression(data,prefixe, name_ope, id_op);
    })

  }

  const start_impression=(en_attente,prefixe, name_ope, id_op)=>{
    const today = dyn_date();
    let operation_id = id_op;
    let operation_nom = name_ope;
    let operation_prefixe = prefixe;
    let un_zero = '0';
    let deux_zero = '00';

    ////IMPRESSION
    db.transaction((tx) => {
      tx.executeSql("select * FROM ticket where  id_operation=? and date_ticket=? order by id_ticket desc limit 1", [operation_id, today], function (tx, results) {
        var tt_ligne = results.rows.length;
        if (tt_ligne > '0') {
          var work = results.rows.item(0);
          var seq = parseInt(work.seq);
          if (en_attente > '1') {
            var pluriel_attente = 's';
          }
          else {
            var pluriel_attente = '';
          }
          //console.log(seq);
          var v_1 = seq + parseInt(1);

          //////////////002 and 009               
          if (v_1 > 1 && v_1 < 10) {
            var sequence = deux_zero + "" + v_1;
          }


          //////////////010 and 099               
          if (v_1 >= 10 & v_1 < 100) {
            var sequence = un_zero + "" + v_1;
          }


          //////////////100 and 999               
          if (v_1 >= 100) {
            var sequence = v_1;
          }
          var num_ticket = operation_prefixe + "" + sequence;


        }
        else if (tt_ligne == '0') {
          var sequence = "001";
          var num_ticket = operation_prefixe + "" + sequence;
          if (en_attente > '1') {
            var pluriel_attente = 's';
          }
          else {
            var pluriel_attente = '';
          }


        }
        console.log(num_ticket);


        ////BEGIN IMPRESSION
        var date_format = formatDate();
        const time = dyn_time();
        const today = dyn_date();
        const time_date = today + ' ' + time;
        const operation_majuscule = operation_nom.toUpperCase();
        const statut_send = '0';
        const statut_ticket = 'en attente';

        //Initializes the printer (ESC @)
        //USBPrinter.printImageBase64(Logo);
        var cmds = '\x1B' + '\x40';          // init
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += '\x1B' + '\x45' + '\x0D'; // bold on
        cmds += '\x1D' + '\x21' + '\x01'; // double font size
        cmds += "DIRECTION DE LA MEDECINE DU TRAVAIL";
        cmds += '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += '\x1B' + '\x45' + '\x0D'; // bold on
        cmds += '\x1D' + '\x21' + '\x11'; // double font size
        cmds += "" + operation_majuscule + "";
        cmds += '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x40';          // init
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += 'vous serez recu sous le numero';
        cmds += '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += '\x1B' + '\x45' + '\x0D'; // bold on
        cmds += '\x1D' + '\x21' + '\x77'; // TRES GRANDE TAILLE
        cmds += "" + num_ticket + "";
        cmds += '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x45' + '\x0A'; // bold off
        cmds += '\x1B' + '\x40';          // init
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += "" + date_format + ", " + time + " " + '\x0A';
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += "" + en_attente + " personne" + pluriel_attente + " avant vous" + '\x0A';
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += 'Veuillez patienter s\'il vous plait';
        cmds += '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        //cmds += '\x1B' + '\x45' + '\x0D'; // bold on
        cmds += '**********************************' + '\x0A';
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += 'MERCI DE PARTICIPER A' + '\x0A';
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += 'L\'ENQUETE DE SATISFACTION' + '\x0A';
        cmds += '\x1B' + '\x61' + '\x31'; // center align
        cmds += '**********************************' + '\x0A';
        //cmds += '\x1B' + '\x45' + '\x0A'; // bold off
        cmds += '\x0A';                   // line break


        cmds += '\x0A' + '\x0A' + '\x0A';                   // line break
        cmds += '\x1B' + '\x69';          // cut paper (old syntax)
        cmds += '\x10' + '\x14' + '\x01' + '\x00' + '\x05';
        USBPrinter.printText(cmds);
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO ticket (id_infirmerie,date_ticket,heure_ticket,id_entreprise,id_type_usage,id_operation,pref,seq,statut_ticket,sexe,annee_naissance,last_modified,statut_send) VALUES (?,?,?, ?, ?, ?, ? ,? ,? ,?, ?,?,? )', [IdInfirmerie,today, time, id_entreprise, id_beneficiaire, operation_id, operation_prefixe, sequence, statut_ticket,prefixe_sexe,annee, time_date, statut_send]);
          SetScreen('accueil');
          Setid_entreprise('');
          Setid_beneficiaire('');
          Setid_prestation('');
          Setid_categorie('');
          Setprefixe_prestation('');
          Settitle('');
          Setprefixe_sexe('');
          Setlib_sexe('');
          setAnnee('');
          navigation.navigate('Merci', {
            IdInfirmerie:IdInfirmerie,
            Infirmerie:Infirmerie
          });
        });

        ////END IMPRESSION





      });

    });
  }

  return (
    <ImageBackground source={bg}  style={styles.bg_accueil}>
      <View style={styles.contain}>
        <View>
          <Synchronisation /* les_entreprises={les_entreprises} */ />
        </View>
        <View>
          {Screen=='accueil'&&
            <Entreprise  next_step={next_step}/>
          }
          {Screen=='beneficiaire'&&
            <Beneficiaire  next_step={next_step}/>
          }
          {Screen=='categorie'&&
             <Categorie  next_step={next_step}/>
          }
          {Screen=='prestation'&&
             <Prestation  next_step={next_step} id_categorie={id_categorie}/>
          }
          {Screen=='sexe'&&
            <Sexe  next_step={next_step}/>
          }
          {Screen=='annee_naissance'&&
            <Annee_naissance next_step={next_step}/>
          }
          
        </View>
        <View>
          {Screen!='accueil'&&
            <Bottom 
              Screen={Screen}
              id_entreprise={id_entreprise}
              id_beneficiaire={id_beneficiaire}
              id_prestation={id_prestation}
              lib_sexe={lib_sexe}
              Home={Home}
              Retour={Retour}
            />
          }
        </View>
        
        
        
      </View>
        
          
           
    </ImageBackground>
  );
};

export default Accueil;

