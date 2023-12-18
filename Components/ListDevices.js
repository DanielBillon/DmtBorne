import React, { useState, useEffect,useRef  } from 'react';
import { View, TouchableOpacity, Text, Modal,FlatList} from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';

import styles from './Style';
import {IP_SERVER} from './constants';


let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const ListDevices = ({printers,ConnecterPrinter,connexion,connexion_printer,VendorId,ProductId}) => {
    const [modalVisible, setModalVisible] = useState(false);
    
    //console.log(printers.length);
    //console.log("VendorId :"+VendorId + "| ProductId :"+ProductId);

    const SelectPrinter=(product_id,vendor_id)=>{
        //console.log(product_id,vendor_id);
       
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM printer limit 1", [], function (tx, results) {
              var tt_ligne = results.rows.length;
              if (tt_ligne > '0') {
                var work = results.rows.item(0);
                var id_printer = parseInt(work.id_printer);
                tx.executeSql('UPDATE printer SET product_id=?, vendor_id=? where id_printer=?', [product_id,vendor_id,id_printer]);
                setModalVisible(false);
                ConnecterPrinter();
              }
              else{
                tx.executeSql('INSERT INTO printer (product_id,vendor_id) VALUES (?,?)', [product_id,vendor_id]);
                setModalVisible(false);
                ConnecterPrinter();
              }
            })
        })         

    }


    const Item = ({product_id,vendor_id}) => (
        <>
        {product_id==ProductId && vendor_id==VendorId
            ?
            <TouchableOpacity style={styles.item_select} onPress={() => SelectPrinter(product_id,vendor_id)}>    
                <Text style={styles.title_select}>
                    <Text style={{fontWeight:'bold'}} >Product id</Text>
                    : {product_id} | ======= | <Text style={{fontWeight:'bold'}} >Vendor id</Text> : {vendor_id} 
                </Text>
            </TouchableOpacity> 
            :
            <TouchableOpacity style={styles.item} onPress={() => SelectPrinter(product_id,vendor_id)}>    
                <Text style={styles.title}>
                    <Text style={{color:'red'}} >Product id</Text>
                    : {product_id} | ======= | <Text style={{color:'red'}} >Vendor id</Text> : {vendor_id} 
                </Text>
            </TouchableOpacity> 

        }
        </>
        

           
    );

    return (
        <View >
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <View style={{justifyContent:'space-between',flexDirection:'row',width:'80%'}} >
                    <Text style={[styles.modalText,{textTransform:'uppercase'}]}>Périphériques détectés</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>  
                        <Text style={{fontSize:25,color:'red'}} >X</Text>
                    </TouchableOpacity>

                </View>
                
                <FlatList
                    data={printers}
                    renderItem={({item}) => <Item product_id={item.product_id} vendor_id={item.vendor_id} />}
                    keyExtractor={item => item.device_id}
                />
                
            </View>
            </View>
        </Modal>
        
            <View 
                style={connexion == 'non' || connexion_printer == 'non'  ? styles.notif_error : styles.notif_clean}
                onTouchStart={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                {
                connexion == 'non' 
                ? 
                    <Text style={styles.notif_text}>Aucune connexion au serveur </Text>
                : 
                    <View></View>
                }
                {
                connexion_printer == 'non' 
                ? 
                    <Text style={styles.notif_text}>Imprimante non connecté </Text>
                :
                    <View></View>
                }
            </View>
        
            
        </View>
    );
};

export default ListDevices;

