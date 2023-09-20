import React from 'react';
import { View, Text, TouchableOpacity, Image,FlatList } from 'react-native';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';


let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Sexe = ({next_step}) => {
  const page='sexe';

  const images = {
    homme: require("./Img/masculin.png"),
    femme: require("./Img/feminin.png"),
  };
  const ListeSexe = [ 
    { "id_sexe": 1,"lib_sexe": "homme","sexe": "M"}, 
    { "id_sexe": 2,"lib_sexe": "femme","sexe": "F" }
  ]

  const Item = ({title,prefixe_sexe}) => (
    <TouchableOpacity style={styles.container_sexe} onPress={() => next_step('',page,prefixe_sexe,title)}>
        <Image source={images[title]}   resizeMode='contain' style={styles.image_logo_sexe} />
        <View style={styles.col_view}>
            { title 
            ? 
                <Text style={styles.text_view}>{title}</Text>
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
      <View >
          <FlatList
              data={ListeSexe}
              numColumns={2}
              horizontal={false}
              renderItem={({item}) => <Item title={item.lib_sexe} prefixe_sexe={item.sexe} />}
              keyExtractor={item => item.id_sexe}
              contentContainerStyle={{
              alignItems:'center',
              }}
          />
      </View>
      <View></View>
        
    </View>
  );
};

export default Sexe;

