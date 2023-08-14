import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Paginate from './Paginate';
import PrestationData from './PrestationData';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {SETTING_SERVER} from './constants';
import Tts from 'react-native-tts';



const bg = require('./Img/background_green.png');


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Prestation = ({route, navigation }) => {
  const { id_beneficiaire,id_entreprise,IdInfirmerie,Infirmerie} = route.params;
  const [Screen,SetScreen]=useState('prestation');

  const [listePrestation, setListePrestation] = useState(['']);
  const [choixEntreprise, setChoixEntreprise] = useState(['']);
  const [choixBeneficiare, setChoixBeneficiare] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listePrestation.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    voix();
  }, [])


  useEffect(() => {
    console.log("PAGE : "+Screen);
    les_prestations();
    entrepriseSelect();
    beneficiareSelect();
  }, [currentPage,Screen])

  const voix = () => {
    Tts.stop();
    const TEXTE_1_2 = "Veuillez selectionner une prestation";
    Tts.speak(TEXTE_1_2, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });

  }

  const les_prestations=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM prestations WHERE deleted='faux'", [], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setListePrestation(data);
      }, null);
    })
  }

  const entrepriseSelect=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM entreprises WHERE id_entreprise=? ", [id_entreprise], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setChoixEntreprise(data);
      }, null);
    })
  }

  const beneficiareSelect=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM type_patient WHERE id_type_patient=? ", [id_beneficiaire], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setChoixBeneficiare(data);
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
    if (currentPage !== Math.ceil(listePrestation.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    } 
  };

 const next_step=(id_benef)=>{
  /* console.log("BENEFICIAIRE :"+id_benef);
  navigation.navigate('Operation',{
    id_beneficiaire:id_benef,
    id_entreprise:id_entreprise,
    IdInfirmerie:IdInfirmerie,
    Infirmerie:Infirmerie
  }); */
}
const imprimer = (prefixe, name_ope, id_op) => {
  const today = dyn_date();

  let operation_id = id_op;
  let operation_nom = name_ope;
  let operation_prefixe = prefixe;
  let un_zero = '0';
  let deux_zero = '00';


  ////IMPRESSION
  db.transaction((tx) => {
    tx.executeSql("select *,(SELECT count(id_ticket) FROM ticket where id_operation=? and date_ticket=? and statut_ticket='en attente')as attente FROM ticket where  id_operation=? and date_ticket=? order by seq desc limit 1", [operation_id, today, operation_id, today], function (tx, results) {
      var tt_ligne = results.rows.length;
      if (tt_ligne > '0') {
        var work = results.rows.item(0);
        var seq = parseInt(work.seq);
        var en_attente = work.attente;
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
        var en_attente = 0;
        var pluriel_attente = '';


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
        tx.executeSql('INSERT INTO ticket (date_ticket,heure_queue,agence,id_entreprise,id_type_usage,id_operation,pref,seq,statut_ticket,last_modified,statut_send) VALUES (?,?,?, ?, ?, ?, ? ,? ,? ,? ,?)', [today, time, agence, id_entreprise, id_beneficiaire, operation_id, operation_prefixe, sequence, statut_ticket, time_date, statut_send]);
      });

      ////END IMPRESSION





    });

  });


}

const Retour=()=>{
  navigation.navigate('Beneficiaire', {
    id_entreprise:id_entreprise,
    IdInfirmerie:IdInfirmerie,
    Infirmerie:Infirmerie
  });
}

  



  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.bg_image}>
      <SafeAreaView style={styles.contain_beneficiaire}>
        <View style={styles.divSelect}>
          {choixEntreprise.map((item,i) => (
            <View style={styles.ViewSelect}>
               <Image source={{uri:"file:///storage/emulated/0/Pictures/"+item.logo_entreprise+""}}   style={styles.image_select} />
            </View>  
              
          ))}

          {choixBeneficiare.map((item,i) => (
            <TouchableOpacity style={styles.ViewSelect} onPress={()=>Retour()}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
               <Image source={{uri:"file:///storage/emulated/0/Pictures/"+item.icon_type_patient+""}}   style={styles.image_select} />
               <Text style={styles.TextSelect}>{item.lib_type_patient}</Text>
               </View> 
              <View>
                <Text style={styles.TextSelect}>X</Text>
              </View>
            </TouchableOpacity>  
              
          ))}

        </View>  
        
        <View >
          <PrestationData posts={currentPosts} imprimer={imprimer} />
          <Paginate postsPerPage={postsPerPage} totalPosts={listePrestation.length} paginate={paginate} previousPage={previousPage}
                  nextPage={nextPage} currentPage={currentPage}/>
        </View>          
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Prestation;

