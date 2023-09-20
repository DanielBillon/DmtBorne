import React, { useState } from 'react';
import { TextInput,View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './Style';
import {calcule_age} from './constants';

//const bg = require('./Img/background_white.png');


const Annee_naissance = ({next_step}) => {
  const page='annee_naissance';

  const [annee, setAnnee] = useState('');
  const images = {
    homme: require("./Img/masculin.png"),
    femme: require("./Img/feminin.png"),
  };
  


  const add_annee=(numero)=>{
    if(annee.length<=3){
      setAnnee(annee + numero);
    }

  }


  return (
      <View  /* style={styles.contain_annee} */>
        <View>
          <View style={styles.modalView}>
                        
            <View style={styles.ViewAnnee}>

              <View style={{ width: '100%',alignItems:'center' }}>
                {annee.length>'0'
                  ?
                  <>
                    <TextInput style={styles.InputAnnee} editable={false} value={annee} />
                    {/* {calcule_age(annee)>0 && calcule_age(annee)<=100
                    ?
                      <Text>{calcule_age(annee)} ans</Text>
                    :
                      <Text>Année de naissance invalide</Text>

                    } */}
                    
                  </>  

                  : 
                    <TextInput style={styles.InputAnnee} editable={false} placeholder="Année de naissance" /> 
                }
                
              </View>
              {/* <View style={{ width: '5%' }}>
                {annee.length>'0'&&
                  <TouchableOpacity onPress={() => setAnnee(annee.substr(0, annee.length - 1))}>
                    <Image source={require('./Img/supp.png')}  />
                  </TouchableOpacity>
                }
                
              </View> */}
            </View>

            <View style={{ width: '100%' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("1")}>
                  <Text style={styles.TextNum}>1</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("2")}>
                  <Text style={styles.TextNum}>2</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("3")}>
                  <Text style={styles.TextNum}>3</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("4")}>
                  <Text style={styles.TextNum}>4</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("5")}>
                  <Text style={styles.TextNum}>5</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("6")}>
                  <Text style={styles.TextNum}>6</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("7")}>
                  <Text style={styles.TextNum}>7</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("8")}>
                  <Text style={styles.TextNum}>8</Text>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("9")}>
                  <Text style={styles.TextNum}>9</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.ViewNum} >
                  <TouchableOpacity onPress={() => setAnnee(annee.substr(0, annee.length - 1))}>
                      <Image source={require('./Img/supp_orange.png')}  />
                    </TouchableOpacity>
                </View>
                <View style={styles.ViewNum} onTouchStart={() => add_annee("0")}>
                  <Text style={styles.TextNum}>0</Text>
                </View>
                  {calcule_age(annee)>0 && calcule_age(annee)<=100

                    ?
                      <View style={styles.ViewNumValide} onTouchStart={() =>next_step(annee,page)}>
                        <Text style={styles.TextNumValide}>Valider</Text>
                      </View>
                    :
                      <View style={styles.ViewNumValide_off} >
                      </View>

                  }
              </View>


            </View>
          </View>

        </View>
          
      </View>
  );
};

export default Annee_naissance;

