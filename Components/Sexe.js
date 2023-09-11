import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, Image,FlatList } from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import Tts from 'react-native-tts';
import {IP_SERVER,IMG_SERVER} from './constants';
import axios from 'axios';



const bg = require('./Img/background_white.png');

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Sexe = ({route, navigation }) => {
  const { id_beneficiaire,id_entreprise,IdInfirmerie,Infirmerie,prefixe_prestation,title,id_prestation} = route.params;

  const [Screen,SetScreen]=useState('sexe');

  const [choixEntreprise, setChoixEntreprise] = useState(['']);
  const [choixBeneficiare, setChoixBeneficiare] = useState(['']);
  const [choixPrestation, setChoixPrestation] = useState(['']);
  const images = {
    homme: require("./Img/masculin.png"),
    femme: require("./Img/feminin.png"),
  };
  const ListeSexe = [ 
                { "id_sexe": 1,"lib_sexe": "homme","sexe": "M"}, 
                { "id_sexe": 2,"lib_sexe": "femme","sexe": "F" }]

  useEffect(() => {
    voix();
  }, [])


  useEffect(() => {
    console.log("PAGE : "+Screen);
    entrepriseSelect();
    beneficiareSelect();
    prestationSelect();
  }, [Screen])

  const voix = () => {
    Tts.stop();
    Tts.setDucking(true);
    const TEXTE_1_2 = "veuillez selectionner votre genre";
    Tts.speak(TEXTE_1_2, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });

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

  const prestationSelect=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM prestations WHERE id_prestation=? ", [id_prestation], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.seq}`);
        }
        setChoixPrestation(data);
      }, null);
    })
  }

  const Retour=()=>{
    navigation.navigate('Prestation', {
      id_beneficiaire:id_beneficiaire,
      id_entreprise:id_entreprise,
      IdInfirmerie:IdInfirmerie,
      Infirmerie:Infirmerie
    });
  }


  const next_step=(pref_sexe,titre)=>{
    console.log("GENRE :"+pref_sexe);
    SetScreen('annee_naissance'),
    navigation.navigate('Annee_naissance',{
      prefixe_sexe:pref_sexe,
      lib_sexe:titre,
      title:title,
      id_prestation:id_prestation,
      id_beneficiaire:id_beneficiaire,
      id_entreprise:id_entreprise,
      IdInfirmerie:IdInfirmerie,
      Infirmerie:Infirmerie,    
      prefixe_prestation:prefixe_prestation,
    });
  }

  const Item = ({title,prefixe_sexe}) => (
    <TouchableOpacity style={styles.container_sexe} onPress={() => next_step(prefixe_sexe,title)}>
        <Image source={images[title]}   resizeMode='contain' style={styles.image_logo_sexe} />
        <View style={styles.col_view}>
            { title 
            ? 
                <Text style={styles.text_view}>{title}</Text>
            :
                <>
                </>
            }
            {/* {title. substring(0, 18) + '...'} */}
        </View>
    </TouchableOpacity>
);

  



  return (
    <ImageBackground source={bg} style={styles.bg_image}>
        <View  style={styles.contain}>
            <View style={styles.divSelect}>
                {choixEntreprise.map((item,i) => (
                    <View key={i} style={[styles.ViewSelect,{flexDirection:'row',alignItems:'center'}]}>
                        <Image source={{uri:IMG_SERVER+"logo/"+item.logo_entreprise+""}}   style={styles.image_select} />
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
                    
                ))}

                {choixBeneficiare.map((item,i) => (
                    <View key={i}  style={[styles.ViewSelect,{flexDirection:'row',alignItems:'center'}]}>
                    <Image source={{uri:IMG_SERVER+"beneficiaire/"+item.icon_type_patient+""}}   style={styles.image_select} />
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
                    
                ))}

                {choixPrestation.map((item,i) => (
                    <TouchableOpacity key={i} style={styles.ViewSelect} onPress={()=>Retour()}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={{uri:IMG_SERVER+"icon_prestation/"+item.icon_prestation+""}}   style={styles.image_select} />
                    {item.lib_prestation
                      ?
                      <>
                      {item.lib_prestation.length<=8
                      ?
                      <Text style={styles.TextSelect}>{item.lib_prestation}</Text>
                      :
                      <Text style={styles.TextSelect}>{item.lib_prestation. substring(0, 5) + '...'}</Text>
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
            
            <View >
                <FlatList
                    data={ListeSexe}
                    numColumns={2}
                    horizontal={false}
                    renderItem={({item}) => <Item title={item.lib_sexe} prefixe_sexe={item.sexe} />}
                    keyExtractor={item => item.id_sexe}
                    contentContainerStyle={{
                    alignItems:'center',
                    }}
                />
            </View>
            <View></View>
            
        </View>
    </ImageBackground>
  );
};

export default Sexe;

