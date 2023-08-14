import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';import styles from './Style';

const bg_cie = require('./Img/cie.png');


const PrestationData = ({ posts,imprimer }) => {
    
    const Item = ({title,id,logo,statut_logo,prestation_total,prefixe_prestation}) => {
        if(prestation_total<=3){
            return(
                <TouchableOpacity style={styles.container_hight} onPress={() => imprimer(prefixe_prestation,title,id)}>
                    <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image_hight} />
                    <View style={styles.name_price_container}>
                        <Text numberOfLines={2}  style={styles.name_entreprise}>{title}</Text>
                    </View>
                </TouchableOpacity>
            )

        }
        else{
            return(
                <TouchableOpacity style={styles.container} onPress={() => imprimer(prefixe_prestation,title,id)}>
                    <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image} />
                    <View  style={styles.name_price_container}>
                        <Text numberOfLines={2}   style={styles.name_entreprise}>{title}</Text>
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
            renderItem={({item}) => <Item title={item.lib_prestation} id={item.id_prestation} logo={item.icon_prestation} statut_logo={item.statut_img}  prestation_total={posts.length} prefixe_prestation={posts.prefixe_prestation}/>}
            keyExtractor={item => item.id_prestation}
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



export default PrestationData;

