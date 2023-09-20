import React, { useState, useEffect } from 'react';
import { View, Text,FlatList, TouchableOpacity, Image } from 'react-native';
import Paginate from './Paginate';
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import styles from './Style';
import {IMG_SERVER} from './constants';

let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const Entreprise = ({next_step}) => {
    const page='accueil';
    const [listeEntreprise, setListeEntreprise] = useState(['']);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = listeEntreprise.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {        
        les_entreprises();
    }, [currentPage])

    const les_entreprises=()=>{
        db.transaction((tx) => {
          tx.executeSql("SELECT * FROM entreprises WHERE deleted='faux'", [], (tx, results) => {
            var len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              data.push(row);
            }
            setListeEntreprise(data);
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
        if (currentPage !== Math.ceil(listeEntreprise.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    
    };

    const Item = ({title,id,logo,statut_logo}) => {
        //const Sizetitle=title.length;
        
        return <TouchableOpacity style={styles.container_entreprise} onPress={() => next_step(id,page)}>
            <Image source={{uri:IMG_SERVER+"/logo/"+logo+""}}   resizeMode='contain' style={styles.image_entreprise} />
        </TouchableOpacity>
    };
    

  
  return (
    <View>
        <View>
            <Paginate 
            postsPerPage={postsPerPage} 
            totalPosts={listeEntreprise.length} 
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
            renderItem={({item}) => <Item title={item.nom_entreprise} id={item.id_entreprise} logo={item.logo_entreprise} statut_logo={item.statut_img}/>}
            keyExtractor={item => item.id_entreprise}
            contentContainerStyle={{
            /* paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 18,
            paddingTop: 16, */
            alignItems:'center',


            }}
        />
        </View>
        
       
      </View> 
  );
};



export default Entreprise;

