import React from 'react';
import {  FlatList,View, Text, TouchableOpacity, Image } from 'react-native';import styles from './Style';
import {IMG_SERVER} from './constants';

const bg_cie = require('./Img/cie.png');


const TypePatient = ({ posts,next_step }) => {
    
    const Item = ({title,id,logo,statut_logo,beneficiare_total}) => (
        <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(id)}>
            <Image source={{uri:IMG_SERVER+"beneficiaire/"+logo+""}}   resizeMode='contain' style={styles.image_logo} />
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
            renderItem={({item}) => <Item title={item.lib_type_patient} id={item.id_type_patient} logo={item.icon_type_patient} statut_logo={item.statut_img}  beneficiare_total={posts.length}/>}
            keyExtractor={item => item.id_type_patient}
            contentContainerStyle={{
           /*  paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 18,
            paddingTop: 16, */
            alignItems:'center',


            }}
        />
        
       
      </View> 
  );
};



export default TypePatient;

