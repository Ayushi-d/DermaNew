import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../config/theme';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import Select from '../Fields/Select';
import TextArea from '../Fields/TextArea';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Loader from './loaders';

const reasons = [
  {value: 'Fake / Misleading Profile Info'},
  {value: 'Photos are fake or obscene'},
  {value: 'Has Sent abusive/ offensive messages'},
  {value: 'Using multiple profile'},
  {value: 'Already Married'},
  {value: 'Asking for money / scammer'},
  {value: 'Other Misuse reason'},
];

/**
 * @param isVisible -> visibility of modal
 * @param reportToggle -> to toggle the modal
 */
class ReportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      desc: '',
      error: {},
      loading: false,
    };
  }

  pushChange = (name, val) => {
    this.setState({[name]: val, error: {}});
  };

  validateValue = () => {
    let error = {...this.state.error};
    if (this.state.reason == '') error['reason'] = 'Field Required';
    if (this.state.desc == '') error['desc'] = 'Field Required';
    return error;
  };

  reportUser = () => {
    let {userToReport} = this.props;
    let user = auth().currentUser;
    this.setState({loading: true});

    let error = this.validateValue();
    this.setState({error}, () => {
      if (Object.keys(error).length != 0) {
        this.setState({loading: false});
        return;
      }
      let {reason, desc} = this.state;
      let reportsRef = database().ref('Reports').push();

      reportsRef
        .set(
          {
            id: reportsRef.key,
            info: desc,
            read: 0,
            ru: userToReport,
            su: user.uid,
            sub: reason,
            tp: new Date().getTime() / 1000,
          },
          (err) => {
            console.log(err);
          },
        )
        .then(() => {
          alert(`Thanks for your feedback. \nWe shall get back to you soon.`);
          this.setState({loading: false});
          this.props.reportToggle();
        })
        .catch((err) => {
          console.log('report.js: err: ', err);
          this.setState({loading: false});
          ToastAndroid.show(
            'Something went wrong. Please try again.',
            ToastAndroid.SHORT,
          );
        });
    });
  };

  render() {
    let {loading} = this.state;
    // console.log(this.props)
    return (
      <ReactNativeModal
        isVisible={this.props.isVisible}
        style={{margin: 0, alignItems: 'center'}}
        onBackdropPress={this.props.reportToggle}>
        <View style={style.container}>
          <LinearGradient
            colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
            style={[style.header]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={style.heading}>REPORT</Text>
          </LinearGradient>
          <ScrollView
            style={{backgroundColor: THEME.WHITE, padding: 10}}
            keyboardShouldPersistTaps={'handled'}>
            <View>
              <Select
                data={reasons}
                placeholder={'Select Reason'}
                name={'reason'}
                value={this.state.reason}
                pushChange={this.pushChange}
                error={this.state.error['reason']}
              />
              <TextArea
                placeholder={'Please provide more details'}
                name={'desc'}
                value={this.state.desc}
                pushChange={this.pushChange}
                error={this.state.error['desc']}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 30,
              }}>
              <BUTTON_WITH_PARAM
                text={'CANCEL'}
                style={{width: '40%'}}
                _onPress={() => this.props.reportToggle()}
              />
              <DEFAULT_BUTTON
                text={'REPORT'}
                style={{width: '40%', marginLeft: 10}}
                _onPress={this.reportUser}
              />
            </View>
          </ScrollView>
        </View>
        {loading ? <Loader isVisible={loading} /> : null}
      </ReactNativeModal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: '90%',
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    color: THEME.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReportModal;
