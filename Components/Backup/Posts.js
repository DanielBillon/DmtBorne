import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList,SafeAreaView, Modal, Pressable, View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';import styles from './Style';

const bg_cie = require('./Img/cie.png');


const Posts = ({ posts }) => {
    
    const Item = ({title}) => (
        <TouchableOpacity style={styles.container}>
      
            <Image source={bg_cie} resizeMode='contain' style={styles.image} />
            
            <View style={styles.name_price_container}>
                <Text style={styles.price}>Rs. {title}</Text>
            </View>
      
        </TouchableOpacity>
      );
    

  
  return (
    <View>
        <FlatList
            data={posts}
            numColumns={3}
            horizontal={false}
            renderItem={({item}) => <Item title={item.title} />}
            keyExtractor={item => item.id}
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



export default Posts;

