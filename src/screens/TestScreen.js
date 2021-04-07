import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {SENDGRID_API_KEY} from 'react-native-dotenv';
import sendGridEmail from '../helpers/sendgrid';
import WelcomeEmail from '../assets/data/welcomeEmail.js';

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _sendWelcomEmail = () => {
    let email = 'nitish@shapeman.co';
    let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      alert('This is not a valid email address.');
      return;
    }

    let TheEmail = WelcomeEmail.replace('{name}', 'Nitish');

    sendGridEmail(
      SENDGRID_API_KEY,
      email,
      'verification@dermacupid.com',
      'Welcome to Derma Cupid',
      TheEmail,
      'text/html',
    )
      .then((res) => {
        console.log('email sent!: ', res);
      })
      .catch((err) => console.log('Test email err: ', err));
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._sendWelcomEmail}>
          <Text style={{fontSize: 18}}>SEND EMAIL</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
