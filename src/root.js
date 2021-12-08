import React from 'react';
import {View, StyleSheet} from 'react-native';
import RootNav from './navigator/rootNav';


export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginCheck: true,
            isLoggedIn: false,
        }
    }

    render() {
        let {isLoggedIn, loginCheck} = this.state;

        return(
            <View style={styles.container}>
                {loginCheck ? (
                   <RootNav isLoggedIn={isLoggedIn} />
                ) : <Splash />}

            </View>
        );
    }
}

function Splash() {
    return(
        <View style={{flex:1}}></View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1
    }
})
