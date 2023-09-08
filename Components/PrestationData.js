import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';import styles from './Style';

//const PrestationData = ({ posts,imprimer }) => {
const PrestationData = ({ posts,next_step }) => {

    const Item = ({title,id,logo,statut_logo,prefixe_prestation}) => (
        <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(prefixe_prestation,title,id)}>
            <Image source={{uri:"file:///storage/emulated/0/Pictures/"+logo+""}}   resizeMode='contain' style={styles.image_logo} />
            <View style={styles.col_view}>
                { title 
                ? 
                    <>
                    {title.length <= 14 && (
                    <Text style={styles.text_view}>{title}</Text>
                    )}
                    {title.length > 14 && title.length <= 18 &&(
                    <Text style={styles.text_small}>{title}</Text>
                    )}
                    {title.length > 18 && title.length <= 46  &&(
                    <Text style={styles.text_22}>{title}</Text>
                    )}
                    {title.length > 46  && title.length <= 59  &&(
                    <Text style={styles.text_17}>{title}</Text>
                    )}
                    {title.length > 59  &&(
                    <Text style={styles.text_17}>{title. substring(0, 60) + '...'}</Text>
                    )}
                    </>
                :
                    <>
                    </>
                }
                {/* {title. substring(0, 18) + '...'} */}
            </View>
        </TouchableOpacity>
    );
    
    
  
  return (
    <View>
        <FlatList
            data={posts}
            numColumns={3}
            horizontal={false}
            renderItem={({item}) => <Item title={item.lib_prestation} id={item.id_prestation} logo={item.icon_prestation} statut_logo={item.statut_img} prefixe_prestation={item.prefixe_prestation}/>}
            keyExtractor={item => item.id_prestation}
            contentContainerStyle={{
            alignItems:'center',
            }}
        />
        
       
      </View> 
  );
};



export default PrestationData;

