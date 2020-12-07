import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
// import {MainContext} from '../../context/app';
import database from '@react-native-firebase/database';

class MessageBoxJSX extends React.Component {
  state = {
    message: '',
    sending: false,
  };

  sendMessage = async () => {
    this.setState({sending: true});

    let id = this.props.uid;
    let message = this.state.message;

    let nid = this.props.context && this.props.context.user_data.nid;
    let uid = this.props.context && this.props.context.user_data.uid;

    await database()
      .ref('/dermaAndroid/users/' + id)
      .child('rf')
      .child(nid.toString())
      .set(uid);

    await database()
      .ref('/dermaAndroid/users/' + id)
      .child('rm')
      .child(nid.toString())
      .set(message);

    this.setState({sending: false, message: ''}, () => {
      this.props.toggleModal();
    });
  };

  handleChange = (message) => {
    this.setState({message});
  };
  render() {
    const {props} = this;
    return (
      <Modal
        isVisible={props.isVisible}
        backdropOpacity={0.5}
        onBackdropPress={props.toggleModal}>
        <View style={style.container}>
          <LinearGradient
            colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
            style={[style.header]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={style.heading}> Say hi to {props.user} !!</Text>
          </LinearGradient>
          <View style={{backgroundColor: THEME.WHITE}}>
            <TextInput
              placeholder={'Type Message'}
              style={style.message}
              multiline={true}
              onChangeText={this.handleChange}
            />
            {!this.state.sending ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginVertical: 20,
                }}>
                <BUTTON_WITH_PARAM
                  text={'Cancel'}
                  style={{width: '40%'}}
                  _onPress={props.toggleModal}
                />
                <DEFAULT_BUTTON
                  text={'Send'}
                  style={{width: '40%'}}
                  _onPress={this.sendMessage}
                />
              </View>
            ) : (
              <View style={{marginVertical: 10}}>
                <ActivityIndicator
                  size={'small'}
                  color={THEME.GRADIENT_BG.END_COLOR}
                  animating
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const MessageBox = (props) => (
  // <MainContext.Consumer>
  //   {(context) => <MessageBoxJSX context={context} {...props} />}
  // </MainContext.Consumer>
  <MessageBoxJSX {...props} />
);

const style = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
  },
  heading: {
    marginLeft: 10,
    color: THEME.WHITE,
  },
  message: {
    borderWidth: 1,
    marginTop: 20,
    width: '95%',
    height: 100,
    alignSelf: 'center',
    borderColor: THEME.BORDERCOLOR,
    textAlignVertical: 'top',
    padding: 10,
  },
  container: {},
});

export default MessageBox;
