import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import style from '../ChangeMobileNumber/style';
import Header from '../Headers/SettingsHeader';
import THEME from '../../config/theme';
import Mci from 'react-native-vector-icons/MaterialCommunityIcons'
import Ant from 'react-native-vector-icons/AntDesign';
import Oct from 'react-native-vector-icons/Octicons';
import Loader from '../modals/loaders';

import database from '@react-native-firebase/database';
import moment from 'moment';

export default class MemberShip extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false
        }
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    _upgrade = () => {
        this._isMounted && this.setState({loading: true});
        let {user} = this.props.context
        database().ref(`Users/${user.uid}`).child('prem').update({
            up: true,
            tp: database.ServerValue.TIMESTAMP
        }).then(() => {
            this._isMounted && this.setState({loading: false});
        }).catch(err => console.log("_upgrade err: ", err))
    }

    render() {
        let {user} = this.props.context;
        if(user.prem && user.prem.up) {
            let dt = new Date(user.prem.tp);
            let newDt = new Date(dt.setMonth(dt.getMonth()+1));
            return(
                <View style={styles.container}>
                <Header title={"MEMBERSHIP"} {...this.props}/>
                <View style={styles.membershipCon}>
                <Text style={styles.memberShipTxt}>
                        You are a Premium member.
                    </Text>
                    <Text style={{...styles.memberShipTxt, marginTop: 30}}>
                        Membership valid till <Text style={{color: '#0066cc'}}>{moment(newDt).calendar()}</Text>
                    </Text>
                </View>
                </View>
            )
        }
        return(
            <View style={styles.container}>
                <Header title={"MEMBERSHIP"} {...this.props}/>
                <View style={styles.membershipCon}>
                    <Text style={styles.memberShipTxt}>
                        Become a premium member to chat, send messages and connect with interesting profiles instantly!
                    </Text>
                    <View style={styles.upgradeCon}>
                        <Text style={styles.upgradeTxt}>₹299 for 1 month</Text>
                        <TouchableOpacity style={styles.upgradeBtn} onPress={this._upgrade}>
                            <Text style={styles.upgradeBtnTxt}>UPGRADE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.benefitCon}>
                        <Text style={styles.benefitConTxt}>
                            PREMIUM MEMBERSHIP BENEFITS
                        </Text>
                        <View style={styles.benefits}>
                            <View style={styles.benefit}>
                                <Icon>
                                    <Mci name={'message-processing'} color={"#fff"}size={21} />
                                </Icon>
                                <Text style={styles.benefitTxt}>Send unlimited chat messages</Text>
                            </View>
                            <View style={styles.benefit}>
                                <Icon>
                                    <Mci name={'heart'} color={"#fff"}size={21} />
                                </Icon>
                                <Text style={styles.benefitTxt}>Send unlimited Likes</Text>
                            </View>
                            <View style={styles.benefit}>
                                <Icon>
                                    <Ant name={'search1'} color={"#fff"}size={21} />
                                </Icon>
                                <Text style={styles.benefitTxt}>Appear on top of search results</Text>
                            </View>
                            <View style={styles.benefit}>
                                <Icon style={{backgroundColor: '#0066cc'}}>
                                    <Oct name={'zap'} color={"#fff"}size={21} />
                                </Icon>
                                <Text style={styles.benefitTxt}>10x higher chance of match</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Loader isVisible={this.state.loading} />
            </View>
        )
    }
}

function Icon(props) {
    return(
        <View style={styles.iconCon}>
           <View style={{...styles.icon, ...props.style}}>
            {props.children}
        </View> 
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    membershipCon: {
        flex:1,
        backgroundColor: '#ffffff',
        elevation: 3,
        padding: 10,
        margin: 10,
    },
    memberShipTxt: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    upgradeCon: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    upgradeTxt: {
        color: '#0066cc',
        fontWeight: 'bold',
        fontSize: 27
    },
    upgradeBtn: {
        marginTop: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        backgroundColor: THEME.GRADIENT_BG.END_COLOR,
        alignItems: 'center',
        paddingVertical: 10,
    },
    upgradeBtnTxt: {
        color: '#fff',
        fontWeight: 'bold',
    },
    benefitCon: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    benefitConTxt: {
        color: '#0066cc',
        fontWeight: 'bold',
        fontSize: 18
    },
    benefits: {
        paddingVertical: 20
    },
    benefit: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    benefitTxt: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 5
    },
    iconCon: {
        padding: 5
    },
    icon: {
        backgroundColor: THEME.GRADIENT_BG.END_COLOR,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
})