import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';import styles from './Style';

const bg_cie = require('./Img/cie.png');


const Entreprise = ({ posts,next_step }) => {
    
    const Item = ({title,id,logo,statut_logo}) => (
        <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(id)}>
            <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image_entreprise} />
        </TouchableOpacity>
      );
    

  
  return (
    <View>
        <FlatList
            data={posts}
            numColumns={3}
            horizontal={false}
            renderItem={({item}) => <Item title={item.nom_entreprise} id={item.id_entreprise} logo={item.logo_entreprise} statut_logo={item.statut_img}/>}
            keyExtractor={item => item.id_entreprise}
            contentContainerStyle={{
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 18,
            paddingTop: 16,
            alignItems:'center',


            }}
        />
        
       
      </View> 
  );
};



export default Entreprise;

