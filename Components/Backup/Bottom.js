import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Animated,Dimensions,Image  } from 'react-native';



const Bottom = ({ postsPerPage, totalPosts, paginate, previousPage, nextPage,currentPage }) => {
    
  
  return (
    <View style={styles.bg_bottom}>
        <View style={styles.div_left}>
            <Image source={require('./Img/back.png')} width={60} height={60}/>
        </View>
        <View style={styles.div_success}>
            <Text style={styles.TextSelectOn}>ENTREPRISE</Text>
        </View>
        <View style={styles.div_grey}>
            <Text style={styles.TextSelectOn}>BENEFICIAIRE</Text>
        </View>
        <View style={styles.div_grey}>
            <Text style={styles.TextSelectOn}>CATEGORIE</Text>
        </View>
        <View style={styles.div_grey}>
            <Text style={styles.TextSelectOn}>SEXE</Text>
        </View>
        <View style={styles.div_grey}>
            <Text style={styles.TextSelectOn}>ANNEE NAISS.</Text>
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
        width: '18.5%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    div_success: {
        width: '18.5%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#8FCE49',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    div_grey: {
        width: '18.5%',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#666666',
        borderColor: '#FFF',
        borderRadius:10,
        margin:3,
    },
    TextSelect: {
        fontSize: 29,
        color: 'black',
        textTransform:'uppercase',
        fontWeight:'bold'
    },
    TextSelectOn: {
        fontSize: 29,
        color: 'white',
        textTransform:'uppercase',
        fontWeight:'bold'
    },
})    


export default Bottom;

