import {StyleSheet} from "react-native";
import THEME from "../../config/theme";

export const STYLE = StyleSheet.create({
    cardsContainer: {
        // flex:1,
        width: '90%',
        alignSelf: 'center',
        marginTop: 5,
        borderBottomWidth: 1,
    },
    text: {
        color: THEME.WHITE,
        fontSize: 14,
        padding: 5,
    },
    name: {
        fontSize: 16,
    },
    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    buttonLike: {
        backgroundColor: THEME.WHITE,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderRadius: 20,
    },

    reply: {
        backgroundColor: THEME.WHITE,
    },

    decline: {
        borderWidth: 1,
        borderColor: THEME.WHITE,
    },
    button: {
        width: '40%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    border: {
        borderBottomWidth: 1,
        borderColor: 'red',
    },
    milk: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    productname: {
        fontSize: 16,
        color: 'black',
    },
    margin_style: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    image_view: {
        marginTop: 10, flexDirection: 'row', alignItems:'center'
    }
});
