import React from 'react';
import { StyleSheet, Dimensions,StatusBar } from 'react-native';
import { COLORS, SIZES,  FONTS } from './constants' 


const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  imagecontainer: {
    flex: 1,
    justifyContent: "center"
  },
  container_loading: {
    flex: 1,
    justifyContent: "center",
    alignItems:'center',
  },
  contain:{
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-between',
    
  },
  contain_annee:{
    flex: 1,
    flexDirection: "column",
    
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
  centeredView: {
    flex:1,
    alignItems: "center",
    marginTop: 10,

  },
  modalView: {
    width: '100%',
    height: 700,
    padding: 35,
    alignItems: "center",
    

  },
  ConfigText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 60,
    textTransform:'uppercase',
    color:'#FF6600'
  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 50
  },
  Input_1: {
    color: "#596643",
    fontWeight: 'bold',
    fontSize: 42,
  },
  ViewNumProtocol_on: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6600',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },

  TextNumProtocol: {
    fontSize: 32,
    padding: 15,
    color: 'white'
  },
  ViewNumProtocol: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  TextNum: {
    fontSize: 64,
    padding: 15,
    color: '#F60',
    fontWeight:'bold',
  },
  Textconf: {
    fontSize: 32,
    padding: 15,
    color: 'black'
  },

  TextNumValide: {
    fontSize: 64,
    padding: 15,
    color: 'black'
  },

  ViewAnnee: {
    flexDirection: 'row',
    alignItems:'center',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
    marginBottom:20
  },
  ViewNum: {
    width: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  ViewNumValide: {
    width: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  
  ViewNum_cancel: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#grey',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  ViewNum_submit: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#grey',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderColor: '#ddd',
    borderBottomWidth: 2,
  },
  centeredView_loading: {
    flex: 1,
    justifyContent: "center",

  },
  centeredView_setting: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,

  },
  modalView_setting: {
    width: '80%',
    height: 700,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    
  },
  bg_image: {
    flex: 1,
    justifyContent: "center",

  },
  bg_accueil: {
    width:DEVICE_WIDTH,
    height:DEVICE_HEIGHT

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
  container_3: {
    alignItems: 'flex-end',
  },
  col_view: {
    padding : 5,
    height:65,
    justifyContent:'center',
    alignItems:'center'
  },
  text_view: {
    color : "#FFFFFF",
    fontSize:35,
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

  
  text_23: {
    color : "#FFFFFF",
    fontSize:23,
    fontWeight:'bold',
    textTransform:'uppercase'

  },
  

  imagess: {
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
  },
  
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
  container_sexe: {
    margin: 8,
    width: (SIZES.width * 0.5 - 24),
    /* width: (SIZES.width * 0.5 - 24), */
    alignItems: 'center',
    justifyContent:'center',
    height: 520,
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
  image_logo_sexe: {
    height: 450,
    width: '100%',
    backgroundColor: "#FFF",
    borderRadius: 20
  },
  image_logo: {
    height: 250,
    width: '100%',
    backgroundColor: "#FFF",
    borderRadius: 20
  },
  divSelect: {
    width: '100%',
    backgroundColor: '#303030',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    flexDirection:'row'
  },
  ViewSelect: {
    width: '24.5%',
    height:50,
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderRadius:10,
    borderColor: '#FFF',
    margin:3,
    flexDirection:'row',
    justifyContent:'space-around'
    
},
TextSelect: {
  fontSize: 29,
  color: 'black',
  textTransform:'uppercase',
  marginLeft:10,
  fontWeight:'bold'
}, 
image_delete: {
  width: 30,
  height: 30,
},
image_select: {
  width: 100,
  height: 47,
  resizeMode:'contain',
  borderColor: 'black',
  borderWidth:1,
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
image_hight: {
  width: '100%',
  height: '100%',
},
name_entreprise: {
  fontSize:20,
  color: COLORS.black,
  textTransform:'uppercase',
  fontWeight:'bold',
},
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


});
export default styles;