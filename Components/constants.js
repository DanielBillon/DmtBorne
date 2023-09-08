import { Dimensions } from "react-native";
import SQLite, { openDatabase } from 'react-native-sqlite-storage';
import axios from 'axios';
const { width, height } = Dimensions.get("screen");
let db = SQLite.openDatabase("gfa.db", "1.0", "OXYGENECI", -1);

const current = new Date();
const dd = String(current.getDate()).padStart(2, '0');
const mm = String(current.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = current.getFullYear();

const hh = String(current.getHours());
const minute = String(current.getMinutes());
const seconds = String(current.getSeconds());

export const IP ="http://192.168.8.120" ;
export const IP_SERVER =IP+"/dmt" ;

export const calcule_age=(date_conv)=> {

    var now = new Date(date_conv);
    var age = yyyy - now.getFullYear();
    var mon_age = age;
    /* if (age <= 1) {
        var mon_age = age + " an"
    } else {
        var mon_age = age + " ans"
    } */


    return mon_age;
}

export const SETTING_SERVER = {
    dossier: "dmt", 
};

export const COLORS = {
    // base colors
    primary: "#E1AD01", // mustard
    secondary: "#CDCDD2",   // grey

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",

    lightGray: "#F5F5F6",
    lightGray2: "#F6F6F7",
    lightGray3: "#EFEFF1",
    lightGray4: "#F8F8F9",
    transparent: "transparent",
    darkgray: '#898C95',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Poppins-Regular", fontSize: SIZES.largeTitle, includeFontPadding: false, textAlignVertical: 'center' },
    h1: { fontFamily: "Poppins-Bold", fontSize: SIZES.h1, color: COLORS.black, includeFontPadding: false, textAlignVertical: 'center' },
    h2: { fontFamily: "Poppins-Medium", fontSize: SIZES.h2, color: COLORS.black, includeFontPadding: false, textAlignVertical: 'center' },
    h3: { fontFamily: "Poppins-Medium", fontSize: SIZES.h3, color: COLORS.black, includeFontPadding: false, textAlignVertical: 'center' },
    h4: { fontFamily: "Poppins-Medium", fontSize: SIZES.h4, color: COLORS.black, includeFontPadding: false, textAlignVertical: 'center' },
    body1: { fontFamily: "Poppins-Regular", fontSize: SIZES.body1, includeFontPadding: false, textAlignVertical: 'center' },
    body2: { fontFamily: "Poppins-Regular", fontSize: SIZES.body2, includeFontPadding: false, textAlignVertical: 'center' },
    body3: { fontFamily: "Poppins-Regular", fontSize: SIZES.body3, includeFontPadding: false, textAlignVertical: 'center' },
    body4: { fontFamily: "Poppins-Regular", fontSize: SIZES.body4, includeFontPadding: false, textAlignVertical: 'center' },
    body5: { fontFamily: "Poppins-Regular", fontSize: SIZES.body5, includeFontPadding: false, textAlignVertical: 'center' },
};