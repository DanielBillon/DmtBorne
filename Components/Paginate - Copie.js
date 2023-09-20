import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet,TouchableOpacity } from 'react-native';



const Paginate = ({ postsPerPage, totalPosts, paginate, previousPage, nextPage,currentPage }) => {
    
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
       pageNumbers.push(i);
    }

  
  return (
    <View style={{ flexDirection: 'row',justifyContent:'center' }}>
        {totalPosts>6 &&
        
            (
            <>
                {currentPage==1 
                ? 
                <>
                </> 
                :
                
                <TouchableOpacity style={styles.ViewNum} onPress={() => previousPage()}>
                    <View >
                        <Text style={styles.TextNum}>Retour</Text>
                    </View>
                </TouchableOpacity> 
                
                }
            
                {pageNumbers.map((number) => (
                    <View  
                        key={number} 
                        style={currentPage==number ? styles.ViewNum_select: styles.ViewNum} 
                        onTouchStart={() => paginate(number)}
                    >
                        <Text 
                            style={currentPage==number ? styles.TextNum_select: styles.TextNum} 
                        >{number} </Text>
                    </View>
                    
                ))}
                {currentPage==Math.ceil(totalPosts / postsPerPage) 
                    ? 
                    <>
                    </> 
                    :
                
                    <TouchableOpacity style={styles.ViewNum} onPress={() => nextPage()}>
                        <View >
                            <Text style={styles.TextNum}>Suivant</Text>
                        </View>
                    </TouchableOpacity>
                    
                }
            </>
            )
        
        }    

        
        
    </View>
  );
};
const styles = StyleSheet.create({
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
    
})    


export default Paginate;

