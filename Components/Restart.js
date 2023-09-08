import React from 'react';

import {  StyleSheet, View,Image,Dimensions,Text } from "react-native";
const DEVICE_HEIGHT = Dimensions.get('screen').height;



const Restart = ({ route }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <Image source={require('./Img/error.png')} style={styles.set}/>
        <View>
            <Text></Text>
        </View>
        <View>
            <Text style={styles.text1}>La borne à ticket n'est plus alimentée en électricité</Text>
        </View>
        <View>
            <Text></Text>
        </View>
        <View>
            <Text style={styles.text2}>Veuillez vérifier l'alimentation puis redémarrer.</Text>
        </View>
        
      </View>
      
  </View>
  );
};

const styles = StyleSheet.create({
  
    container: {
      flex: 3
      
    },
    horizontal: {
      flexDirection: "column",
      alignItems:'center',
      justifyContent:'center',
      height:DEVICE_HEIGHT
    },
    
    set:{
      width:200,
      height:200
    },
    text1:{
        fontSize:30,
        fontWeight:'bold'    
    },
    text2:{
        fontSize:20,
    }


  });
  




export default Restart;
