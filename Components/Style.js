import React from 'react';
import { StyleSheet, Dimensions,StatusBar } from 'react-native';
import {SETTING_SERVER} from './constants';
import { COLORS, SIZES,  FONTS } from './constants' 


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  contain:{
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-between',
    
  },
  contain_beneficiaire:{
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-between',
    
  },
  img_operation: {
    width:300,
    height:300
  },
  centeredView_loading: {
    flex: 1,
    justifyContent: "center",

  },
  /* 
  container_entreprise: {
    margin: 8,
    width: (SIZES.width * 0.3 - 24),
    height: 200,
    elevation: 3,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white
  },
   */
  container_entreprise: {
    margin: 8,
    width: (SIZES.width * 0.3 - 24),
    /* width: (SIZES.width * 0.5 - 24), */
    alignItems: 'center',
    justifyContent:'center',
    height: 320,
    backgroundColor: '#ff9900',
    padding: 10,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 1.84,
    elevation: 5
  },
  image_entreprise: {
    height: 300,
    width: '100%',
    backgroundColor: "#FFF",
    borderRadius: 20
  },
  /* image_entreprise: {
    width: '90%',
    height: '90%',
  }, */
  container: {
    margin: 8,
    width: (SIZES.width * 0.3 - 24),
    /* width: (SIZES.width * 0.5 - 24), */
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 10,
    borderColor:'#ff9900',

    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 1.84,
    elevation: 5
  },
  container_hight: {
    margin: 8,
    width: (SIZES.width * 0.3 - 24),
    /* width: (SIZES.width * 0.5 - 24), */
    height: 500,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 10,
    borderColor:'#ff9900',

    shadowColor: "#000",
    shadowOffset: { width: 3, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 1.84,
  },
  

  image: {
      width: '100%',
      height: '70%',
    borderRadius: 10
  },
  image_hight: {
      width: '100%',
      height: '100%',
  },
  image_select: {
    width: 100,
    height: 50,
    resizeMode:'contain'
},
  bg_image: {
    flex: 1,
    justifyContent: "center",

  },

  favorite_icon: {
      position: 'absolute',
      top: 14,
      right: 14
  },

  name_price_container: {
      padding: SIZES.padding,
      position: 'absolute',
      bottom: 0,
      height: 70,
      width: '100%',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
  },

  name: {
      ...FONTS.body4,
      color: COLORS.black,
      textAlign: 'center'
  },

  name_entreprise: {
      fontSize:20,
      color: COLORS.black,
      textTransform:'uppercase',
      fontWeight:'bold',
  },
  heading: {
      ...FONTS.h3,
      paddingLeft: 16,
      paddingBottom: 10
  },
  Applink: {
    color: '#61dafb',
  },
  question_view_ticket: {
    alignItems: 'center',
    padding: 20
  },
  text_orange: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: 'bold',
    color: '#F90',
    //color:'#000',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  text_white: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: 'bold',
    color: '#FFF',
    //color:'#000',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  text_green: {
    textAlign:'center',
    fontSize:70,
    fontWeight:'bold',
    color:'#0C3',
    textTransform:'uppercase',
    textShadowColor:'#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  ViewSelect: {
    width: '48%',
    height:50,
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderRadius:10,
    borderColor: '#FFF',
    margin:10,
    flexDirection:'row',
    justifyContent:'space-around'
    
},
TextSelect: {
    fontSize: 29,
    color: 'black',
    textTransform:'uppercase',
    marginLeft:10
}, 
divSelect: {
  width: '100%',
  backgroundColor: '#F18C00',
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
  flexDirection:'row'
},
container_3: {
  alignItems: 'flex-end',
},
notif_clean: {
    
},
notif_error: {
  flexDirection:'row',
  justifyContent:'space-evenly',
  backgroundColor: '#888888',
  width: DEVICE_WIDTH,
  opacity:0.4,
  padding: 2,
},
notif_text: {
  color: '#000',
  fontWeight:'bold',
  fontSize:20
},

});
export default styles;