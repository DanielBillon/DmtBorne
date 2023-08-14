import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Paginate from './Paginate';
import TypePatient from './TypePatient';
import { USBPrinter } from "react-native-thermal-receipt-printer-image-qr";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {SETTING_SERVER} from './constants';
import Tts from 'react-native-tts';



const bg = require('./Img/background_green.png');


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Beneficiaire = ({route, navigation }) => {
  const { id_entreprise,IdInfirmerie,Infirmerie} = route.params;
  const [Screen,SetScreen]=useState('beneficiaire');

  const [listeBeneficiaire, setListeBeneficiaire] = useState(['']);
  const [choixEntreprise, setChoixEntreprise] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listeBeneficiaire.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    voix();
  }, [])

  useEffect(() => {
    console.log("PAGE : "+Screen);
    les_beneficiaire();
    entrepriseSelect();
  }, [currentPage,Screen])

  const voix = () => {
    Tts.stop();
    const TEXTE_1_2 = "Veuillez selectionner un bénéficiaire";
    Tts.speak(TEXTE_1_2, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });

  }

  const les_beneficiaire=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM type_patient WHERE deleted='faux'", [], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setListeBeneficiaire(data);
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(listeBeneficiaire.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    } 
  };

 const next_step=(id_benef)=>{
  console.log("BENEFICIAIRE :"+id_benef);
  SetScreen('prestation'),
  navigation.navigate('Prestation',{
    id_beneficiaire:id_benef,
    id_entreprise:id_entreprise,
    IdInfirmerie:IdInfirmerie,
    Infirmerie:Infirmerie
  });
}

const Retour=()=>{
  navigation.navigate('Accueil', {
    IdInfirmerie:IdInfirmerie,
    Infirmerie:Infirmerie
  });
}

  



  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.bg_image}>
      <SafeAreaView style={styles.contain_beneficiaire}>
        <View style={styles.divSelect}>
          {choixEntreprise.map((item,i) => (
            <TouchableOpacity style={styles.ViewSelect} onPress={()=>Retour()}>
               <Image source={{uri:"file:///storage/emulated/0/Pictures/"+item.logo_entreprise+""}}   style={styles.image_select} />
              <View>
                <Text style={styles.TextSelect}>X</Text>
              </View>
            </TouchableOpacity>  
              
          ))}
        </View>  
        
        <View >
          <TypePatient posts={currentPosts} next_step={next_step}/>
          <Paginate postsPerPage={postsPerPage} totalPosts={listeBeneficiaire.length} paginate={paginate} previousPage={previousPage}
                  nextPage={nextPage} currentPage={currentPage}/>
        </View>          
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Beneficiaire;

