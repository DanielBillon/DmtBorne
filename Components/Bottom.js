import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Animated,Dimensions,Image  } from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';



let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Bottom = ({ Screen,id_entreprise,id_beneficiaire,id_prestation,lib_sexe,Home,Retour }) => {
    
    
    const [choixEntreprise, setChoixEntreprise] = useState(['']);
    const [choixBeneficiare, setChoixBeneficiare] = useState(['']);
    const [choixPrestation, setChoixPrestation] = useState(['']);

    useEffect(()=>{
        //console.log("+++++ "+Screen);
        if(Screen=='beneficiaire'){
            entrepriseSelect();
        }
        if(Screen=='prestation' || Screen=='categorie'){
            beneficiareSelect();
        }
        if(Screen=='sexe'){
            prestationSelect();
        }
        if(Screen=='annee_naissance'){
        }
    },[Screen])

    const entrepriseSelect=()=>{
        db.transaction((tx) => {
        tx.executeSql("SELECT * FROM entreprises WHERE id_entreprise=? ", [id_entreprise], (tx, results) => {
            var len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push(row);
            //console.log(`operation: ${row.nom_entreprise}`);
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

    const back=(screen)=>{
        if(screen=='beneficiaire'){
            setChoixBeneficiare(['']);
            setChoixPrestation(['']);
            Retour(screen);

        }
        if(screen=='categorie'){
            setChoixPrestation(['']);
            Retour(screen);

        }
        
    }

  
    return (
        <View style={styles.bg_bottom}>
            <TouchableOpacity style={styles.div_left}  onPress={()=>Home()} >
                <View >
                    <Image source={require('./Img/home.png')} width={60} height={60}/>
                </View>
            </TouchableOpacity>    
            {choixEntreprise.map((item,i) => (
                
                <View key={i} style={styles.div_success}>
                    {item.nom_entreprise
                    ?
                    <TouchableOpacity 
                        onPress={()=>Retour('accueil')}
                    >
                    {item.nom_entreprise.length<=16
                    ?
                    <Text style={styles.TextSelectOn}>{item.nom_entreprise}</Text>
                    :
                    <Text style={styles.TextSelectOn}>{item.nom_entreprise. substring(0, 16) + '...'}</Text>
                    }
                    </TouchableOpacity>
                    :
                    true
                    }
                </View>
                    
            ))}   
            {choixBeneficiare.map((item,i) => ( 
                
                <View key={i} style={[item.lib_type_patient?styles.div_success:styles.div_grey]}>
                    {item.lib_type_patient
                    ?
                    <TouchableOpacity 
                        onPress={()=>back('beneficiaire')}
                    >
                        {item.lib_type_patient.length<=16
                        ?
                        <Text style={styles.TextSelectOn}>{item.lib_type_patient}</Text>
                        :
                        <Text style={styles.TextSelectOn}>{item.lib_type_patient. substring(0, 16) + '...'}</Text>
                        }
                        </TouchableOpacity>
                    :
                    <Text style={styles.TextSelect}>BENEFICIAIRE</Text>
                    }
                </View>
                
            ))}    
            {choixPrestation.map((item,i) => ( 
                
                <View key={i} style={[item.lib_prestation?styles.div_success:styles.div_grey]}>
                    {item.lib_prestation
                    ?
                    <TouchableOpacity 
                        onPress={()=>back('categorie')}
                    >
                        {item.lib_prestation.length <= 14 && (
                        <Text style={styles.text_view}>{item.lib_prestation}</Text>
                        )}
                        {item.lib_prestation.length > 14 && item.lib_prestation.length <= 18 &&(
                        <Text style={styles.text_small}>{item.lib_prestation}</Text>
                        )}
                        {item.lib_prestation.length > 18 && item.lib_prestation.length <= 46  &&(
                        <Text style={styles.text_22}>{item.lib_prestation}</Text>
                        )}
                        {item.lib_prestation.length > 46  && item.lib_prestation.length <= 59  &&(
                        <Text style={styles.text_17}>{item.lib_prestation}</Text>
                        )}
                        {item.lib_prestation.length > 59  &&(
                        <Text style={styles.text_17}>{item.lib_prestation. substring(0, 60) + '...'}</Text>
                        )}


                        {/* {item.lib_prestation.length<=16
                        ?
                        <Text style={styles.TextSelectOn}>{item.lib_prestation}</Text>
                        :
                        <Text style={styles.TextSelectOn}>{item.lib_prestation. substring(0, 16) + '...'}</Text>
                        } */}
                        </TouchableOpacity>
                    :
                    <Text style={styles.TextSelect}>MOTIF</Text>
                    }
                </View>
                
            ))}  
            
                
            
            <View style={[lib_sexe?styles.div_success:styles.div_grey]}>
                {lib_sexe
                ?
                    <TouchableOpacity 
                    
                        onPress={()=>Retour('sexe')}
                    >
                    {lib_sexe.length<=16
                    ?
                    <Text style={styles.TextSelectOn}>{lib_sexe}</Text>
                    :
                    <Text style={styles.TextSelectOn}>{lib_sexe. substring(0, 16) + '...'}</Text>
                    }
                    </TouchableOpacity>
                :
                <Text style={styles.TextSelect}>SEXE</Text>
                }
            </View>
            
            
        </View>
    );
};
const styles = StyleSheet.create({
    bg_bottom: {
        flexDirection: 'row',
        backgroundColor: '#303030',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        height:70
    },
    ViewNum_select: {
        width: '10%',
        alignItems: 'center',
        backgroundColor: '#F78F1E',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        borderRadius:10,
        borderColor: '#F78F1E',
        borderBottomWidth: 2,
        margin:15
    },
    TextNum_select: {
        fontSize: 29,
        /* padding: 10, */
        color: 'white'
    },
    
    ViewNum: {
        width: '10%',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        borderRadius:10,
        borderColor: '#FFF',
        margin:15
    },
    TextNum: {
        fontSize: 29,
        /* padding: 10, */
        color: 'black'
    }, 
    div_left: {
        width:'5%',
        alignItems: 'center',
        justifyContent:'center',
        /* backgroundColor:'#3D4164', */
    },
    div_middle: {
        width: '23.2%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    div_success: {
        width: '23.2%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#8FCE49',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    div_grey: {
        width: '23.2%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#666666',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    TextSelect: {
        fontSize: 29,
        color: '#585858',
        textTransform:'uppercase',
        fontWeight:'bold'
    },
    TextSelectOn: {
        fontSize: 29,
        color: 'white',
        textTransform:'uppercase',
        fontWeight:'bold'
    },
    text_view: {
        color : "#FFFFFF",
        fontSize:29,
        fontWeight:'bold',
        textTransform:'uppercase',
        textAlign:'center'
    
      },
      text_small: {
        color : "#FFFFFF",
        fontSize:27,
        fontWeight:'bold',
        textTransform:'uppercase'
    
      },
      text_17: {
        color : "#FFFFFF",
        fontSize:17,
        fontWeight:'bold',
        textTransform:'uppercase',
        textAlign:'center'
    
      },
      text_22: {
        color : "#FFFFFF",
        fontSize:22,
        fontWeight:'bold',
        textTransform:'uppercase',
        textAlign:'center'
    
      },
})    


export default Bottom;

