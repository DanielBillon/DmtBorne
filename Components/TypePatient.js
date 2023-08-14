import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';import styles from './Style';

const bg_cie = require('./Img/cie.png');


const TypePatient = ({ posts,next_step }) => {
    
    const Item = ({title,id,logo,statut_logo,beneficiare_total}) => {
        if(beneficiare_total<=3){
            return(
                <TouchableOpacity style={styles.container_hight} onPress={() => next_step(id)}>
                    <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image_hight} />
                    <View style={styles.name_price_container}>
                        <Text numberOfLines={2}  style={styles.name_entreprise}>{title}</Text>
                    </View>
                </TouchableOpacity>
            )

        }
        else{
            return(
                <TouchableOpacity style={styles.container} onPress={() => next_step(id)}>
                    <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image} />
                    <View style={styles.name_price_container}>
                        <Text numberOfLines={2}  style={styles.name_entreprise}>{title}</Text>
                    </View>
                </TouchableOpacity>
            )

        }   
    };
    

  
  return (
    <View>
        <FlatList
            data={posts}
            numColumns={3}
            horizontal={false}
            renderItem={({item}) => <Item title={item.lib_type_patient} id={item.id_type_patient} logo={item.icon_type_patient} statut_logo={item.statut_img}  beneficiare_total={posts.length}/>}
            keyExtractor={item => item.id_type_patient}
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



export default TypePatient;

