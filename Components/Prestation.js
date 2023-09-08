import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, Image } from 'react-native';
import Paginate from './Paginate';
import PrestationData from './PrestationData';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import Tts from 'react-native-tts';
import {IP_SERVER} from './constants';
import axios from 'axios';



const bg = require('./Img/background_white.png');

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
    Tts.setDucking(true);
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
          //console.log(`id_prestation: ${row.id_prestation}`);
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

 
  /* var date = new Date;
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
      //console.log('eeee' +data);
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
          tx.executeSql('INSERT INTO ticket (id_infirmerie,date_ticket,heure_ticket,id_entreprise,id_type_usage,id_operation,pref,seq,statut_ticket,last_modified,statut_send) VALUES (?,?,?, ?, ?, ?, ? ,? ,? ,?, ? )', [IdInfirmerie,today, time, id_entreprise, id_beneficiaire, operation_id, operation_prefixe, sequence, statut_ticket, time_date, statut_send]);
          navigation.navigate('Merci', {
            IdInfirmerie:IdInfirmerie,
            Infirmerie:Infirmerie
          });
        });

        ////END IMPRESSION





      });

    });
  } */

  const Retour=()=>{
    navigation.navigate('Beneficiaire', {
      id_entreprise:id_entreprise,
      IdInfirmerie:IdInfirmerie,
      Infirmerie:Infirmerie
    });
  }
  const next_step=(prefixe_prest,titre,id_prest)=>{
    console.log("PRESTATION :"+id_prest);
    SetScreen('sexe'),
    navigation.navigate('Sexe',{
      prefixe_prestation:prefixe_prest,
      title:titre,
      id_prestation:id_prest,
      id_beneficiaire:id_beneficiaire,
      id_entreprise:id_entreprise,
      IdInfirmerie:IdInfirmerie,
      Infirmerie:Infirmerie
    });
  }

  



  return (
    <ImageBackground source={bg} style={styles.bg_image}>
      <View style={styles.contain}>
        <View style={styles.divSelect}>
          {choixEntreprise.map((item,i) => (
            <View key={i} style={styles.ViewSelect}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image source={{uri:"file:///storage/emulated/0/Pictures/"+item.logo_entreprise+""}}   style={styles.image_select} />
                {item.nom_entreprise
                  ?
                  <>
                  {item.nom_entreprise.length<=9
                  ?
                  <Text style={styles.TextSelect}>{item.nom_entreprise}</Text>
                  :
                  <Text style={styles.TextSelect}>{item.nom_entreprise. substring(0, 6) + '...'}</Text>
                  }
                  </>
                  :
                  true
                }
              </View> 
            </View>  
              
          ))}

          {choixBeneficiare.map((item,i) => (
            <TouchableOpacity key={i} style={styles.ViewSelect} onPress={()=>Retour()}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
               <Image source={{uri:"file:///storage/emulated/0/Pictures/"+item.icon_type_patient+""}}   style={styles.image_select} />
                {item.lib_type_patient
                  ?
                  <>
                  {item.lib_type_patient.length<=9
                  ?
                  <Text style={styles.TextSelect}>{item.lib_type_patient}</Text>
                  :
                  <Text style={styles.TextSelect}>{item.lib_type_patient. substring(0, 6) + '...'}</Text>
                  }
                  </>
                  :
                  true
                }
               </View> 
              <View>
                <Image source={require('./Img/del.png')} style={styles.image_delete}/>
              </View>
            </TouchableOpacity>  
              
          ))}

        </View> 
        
        <View>
          <PrestationData posts={currentPosts} /* imprimer={imprimer} */ next_step={next_step} />
        </View>
        <View>
          <Paginate 
            postsPerPage={postsPerPage} 
            totalPosts={listePrestation.length} 
            paginate={paginate} 
            previousPage={previousPage}
            nextPage={nextPage} 
            currentPage={currentPage}
          />
          
        </View>
        
        
        
      </View>
    </ImageBackground>
  );
};

export default Prestation;

