import React from 'react';
import {View, Text, Modal, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import THEME from '../../config/theme';
import style from '../ChangeMobileNumber/style';

export default class MemberShipModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }


    render() {
        let {show, close, content} = this.props;
        return(
            <Modal visible={show} transparent>
                <Pressable style={styles.container} onPress={close}>
                    <View style={styles.popBox}>
                        <View style={styles.popTop}>
                            <Text style={styles.popTopTxt}>
                                MEMBERSHIP
                            </Text>
                        </View>
                        <View style={styles.popCon}>
                            <Text style={styles.popConTxt}>{content}</Text>

                            <TouchableOpacity style={styles.upgradeBtn} onPress={() => {
                                close();
                                this.props.navigation.navigate("Membership");
                                }}>
                                <Text style={styles.upgradeBtnTxt}>UPGRADE NOW</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    popBox: {
        width: '85%',
        backgroundColor: '#fff',
        elevation: 3
    },
    popTop: {
        width: '100%',
        backgroundColor: THEME.GRADIENT_BG.END_COLOR,
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    popTopTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    popCon: {
        padding:14,
        alignItems: 'center'
    },
    popConTxt: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    upgradeBtn: {
        backgroundColor: THEME.GRADIENT_BG.END_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 30
    },
    upgradeBtnTxt: {
        color: '#fff',
        fontWeight: 'bold'
    }
})