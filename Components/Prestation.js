import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image,FlatList } from 'react-native';
import Paginate from './Paginate';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {IMG_SERVER} from './constants';

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Prestation = ({next_step,id_categorie}) => {
  const page='prestation';

  const [listePrestation, setListePrestation] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listePrestation.slice(indexOfFirstPost, indexOfLastPost);



  useEffect(() => {
    les_prestations();

  }, [currentPage])

  
  const les_prestations=()=>{
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM prestations WHERE id_categorie=? and deleted='faux'", [id_categorie], (tx, results) => {
        var len = results.rows.length;
        const data = [];
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push(row);
          //console.log(`id_prestation: ${row.id_prestation}`);
        }
        setListePrestation(data);
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
    if (currentPage !== Math.ceil(listePrestation.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    } 
  };


  const Item = ({title,id,logo,statut_logo,prefixe_prestation}) => (
    <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(id,page,prefixe_prestation,title)}>
        <Image source={{uri:IMG_SERVER+"icon_prestation/"+logo+""}}   resizeMode='contain' style={styles.image_logo} />
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
                <Text style={styles.text_20}>{title}</Text>
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
      <View >
        <Paginate 
          postsPerPage={postsPerPage} 
          totalPosts={listePrestation.length} 
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
          renderItem={({item}) => <Item title={item.lib_prestation} id={item.id_prestation} logo={item.icon_prestation} statut_logo={item.statut_img} prefixe_prestation={item.prefixe_prestation}/>}
          keyExtractor={item => item.id_prestation}
          contentContainerStyle={{
          alignItems:'center',
          }}
        />
      </View>
      
    </View>
  );
};

export default Prestation;

