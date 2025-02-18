import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image,FlatList } from 'react-native';
import Paginate from './Paginate';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {IMG_SERVER} from './constants';

const bg = require('./Img/background_white.png');

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Beneficiaire = ({next_step}) => {
  const page='beneficiaire';

  const [listeBeneficiaire, setListeBeneficiaire] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listeBeneficiaire.slice(indexOfFirstPost, indexOfLastPost);

  
  useEffect(() => {
    les_beneficiaire();
  }, [currentPage])

  const les_beneficiaire=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM type_patient WHERE deleted='faux'", [], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`operation: ${row.lib_type_patient}`);
        }
        setListeBeneficiaire(data);
      }, null);
    })
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(listeBeneficiaire.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    } 
  };

  const Item = ({title,id,logo,statut_logo,beneficiare_total}) => (
    <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(id,page)}>
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
    <View >
      
      <View>
        <Paginate 
          postsPerPage={postsPerPage} 
          totalPosts={listeBeneficiaire.length} 
          paginate={paginate} 
          previousPage={previousPage}
          nextPage={nextPage} 
          currentPage={currentPage}
        /> 
        
      </View>

      <View>
        <FlatList
          data={currentPosts}
          numColumns={3}
          horizontal={false}
          renderItem={({item}) => <Item title={item.lib_type_patient} id={item.id_type_patient} logo={item.icon_type_patient} statut_logo={item.statut_img}  beneficiare_total={currentPosts.length}/>}
          keyExtractor={item => item.id_type_patient}
          contentContainerStyle={{
            alignItems:'center',
          }}
        />
      </View>
      
      
      
    </View>
  );
};

export default Beneficiaire;

