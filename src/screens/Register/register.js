import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  BackHandler,
} from 'react-native';
import DEFAULT_BUTTON from '../../components/general/button';
import THEME from '../../config/theme';
import RegistrationForm from '../../assets/data/form';
import Country from '../../helpers/country';
import Loader from '../../components/modals/loaders';
import {
  MemberHeaderForStac,
  CustomHeaderStack,
} from '../../components/general/Header';

import database from '@react-native-firebase/database';

import {SENDGRID_API_KEY} from 'react-native-dotenv';
import sendGridEmail from '../../helpers/sendgrid';
import WelcomeEmail from '../../assets/data/welcomeEmail';
// import {HeaderBackButton} from 'react-navigation-stack';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    let {user} = props.context;
    this.state = {
      step: 1,
      values: {
        g: '',
        dob: '',
        ht: '',
        sc: '',
        nm: user ? user.displayName : '',
        pnm: '',
        em: user ? user.email : '',
        c: '',
        s: '',
        ct: '',
        he: '',
        ef: '',
        p: '',
        dk: '',
        sk: '',
        ms: '',
        rl: '',
        cn: '',
        sn: '',
        cat: new Date().getTime() / 1000,
      },
      error: {},
      s: [],
      ct: [],
      loading: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    let {route} = this.props;

    let {phoneNumber} = route.params
      ? route.params
      : {phoneNumber: '+918894170554'};
    console.log('phone: ', phoneNumber);
    let values = {...this.state.values};
    values['cn'] = phoneNumber || '';
    this.setState({values}, () => {
      // console.log(this.state.values, 'values registration');
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler = () => {
    if (this.state.step == 1) {
      this.props.navigation.navigate('Login');
      return true;
    }
    this.setState({step: 1});
    return true;
  };

  validateValue = () => {
    let values = {...this.state.values};
    let error = {};
    for (let item of RegistrationForm[this.state.step - 1]) {
      if (values[item.name] == '') {
        error[item.name] = `${item.label} is required`;
      } else if (item.name == 'em') {
        let re = /\S+@\S+\.\S+/;
        if (!re.test(values[item.name])) {
          error[item.name] = 'This is not a valid email address.';
        }
      } else if (item.name == 'nm') {
        let re = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
        // let nmt = values[item.name].trim();
        console.log(values[item.name]);
        if (!re.test(values[item.name]) || values[item.name] == null) {
          error[item.name] = 'This is not a valid name';
        }
      }
    }

    return error;
  };

  validateSingleValue = (name, value) => {
    // regex
    let emailRegex = /\S+@\S+\.\S+/;
    let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;

    let error = {...this.state.error};

    delete error[name];

    if (value == '') error[name] = `This field is required`;

    if (name == 'em' && !emailRegex.test(value))
      error[name] = 'This is not a valid email address.';
    if (name == 'nm' && !nameRegex.test(value))
      error[name] = 'This is not a valid name';

    return error;
  };

  stateData = (data) => {
    Country.getStates(data)
      .then((res) => {
        this.setState({s: res, loading: false});
      })
      .catch((err) => {});
  };

  cityData = (data) => {
    Country.getCities(data)
      .then((res) => {
        this.setState({ct: res, loading: false});
      })
      .catch((err) => {});
  };

  formatData = (data) => {
    if (!Array.isArray(data)) return data;
    data = data ? data.map((item) => ({value: item})) : [];
    return data;
  };

  _renderProgress = () => {
    return (
      <View style={style.progress}>
        {/* step 1 */}
        <View style={[style.progressLine, {width: '45%'}]}>
          <Text style={[style.steps]}>1</Text>
        </View>
        <View
          style={[
            style.progressLine,
            {
              backgroundColor:
                this.state.step == 2
                  ? THEME.GRADIENT_BG.START_COLOR
                  : THEME.STEP_COLOR,
              width: '55%',
            },
          ]}>
          <Text
            style={[
              style.steps,
              {
                left: 20,
                backgroundColor:
                  this.state.step == 2
                    ? THEME.GRADIENT_BG.START_COLOR
                    : THEME.STEP_COLOR,
                color: this.state.step == 2 ? THEME.WHITE : THEME.STEP_TEXT,
              },
            ]}>
            2
          </Text>
        </View>
      </View>
    );
  };

  _sendWelcomEmail = () => {
    let email = this.state.values.em;
    let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      alert('This is not a valid email address.');
      return;
    }

    let TheEmail = WelcomeEmail.replace('{name}', this.state.values.nm);

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

  _nextStep = () => {
    let err = this.validateValue();
    this.setState(
      {
        error: err,
      },
      () => {
        if (Object.keys(err).length != 0) {
          if (Object.keys(err).length == 1) {
            alert(Object.values(err)[0]);
            return;
          }

          alert('Please fill all the fields correctly.');
          return;
        }

        if (this.state.step == 2) {
          this._saveData();
          this._sendWelcomEmail();
          return 0;
        }

        let usr = {...this.props.context.user, ...this.state.values};

        database()
          .ref(`SubFill/${usr.uid}`)
          .set(usr)
          .catch((err) => console.log('save half data! err!: ', err));

        this.setState({step: 2}, () => {
          this.scroll.scrollTo({x: 0, y: 0, animated: false});
        });
      },
    );
  };

  _saveData = () => {
    this.setState({loading: true});
    let usr = {...this.props.context.user, ...this.state.values};
    // console.log(usr);
    console.log(usr);
    this.props.reg
      .setRegistration({...this.props.context.user, ...this.state.values})
      .then((res) => {
        if (res) this.setState({loading: false});
        this.props.context._setLoginUser(usr);
        this.props.context._checkAuth();
        database()
          .ref(`SubFill/${usr.uid}`)
          .remove()
          .catch((err) => console.log('delete half saved data! err!: ', err));
        // this.props.navigation.navigate('Drawer');
      });
  };

  _pushChange = (name, value) => {
    let values = {...this.state.values};
    values[name] = value;

    if (name == 'c') {
      this.setState({loading: true});
      this.stateData(value);
      values['s'] = '';
    }

    if (name == 's') {
      this.setState({loading: true});
      this.cityData(value);
      values['ct'] = '';
    }

    this.setState({values}, () => {
      let err = this.validateSingleValue(name, value);
      this.setState({error: err});
    });
  };

  scrollToEnd = (y) => {
    this.scroll.scrollTo({animated: false, y});
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <CustomHeaderStack
          title={'Registration'}
          onPress={() => this.backHandler()}
        />
        <View style={style.parent}>
          <View style={style.registration}>
            <Text style={style.heading}>LET'S BUILD YOUR PROFILE</Text>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 1,
                borderRadius: 10,
                backgroundColor: THEME.WHITE,
              }}>
              {this._renderProgress()}
              <ScrollView
                style={style.form}
                keyboardShouldPersistTaps={'handled'}
                ref={(c) => {
                  this.scroll = c;
                }}>
                {RegistrationForm[this.state.step - 1].map((item, index) => (
                  <item.component
                    label={item.label}
                    data={this.formatData(
                      item.fetchFromServer ? this.state[item.name] : item.data,
                    )}
                    key={item.name}
                    name={item.name}
                    error={this.state.error[item.name]}
                    pushChange={this._pushChange}
                    value={this.state.values[item.name]}
                    dropDownPosition={item.dropDownPosition}
                    placeholder={item.placeholder}
                    scrollToEnd={this.scrollToEnd}
                  />
                ))}

                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <DEFAULT_BUTTON
                    text={'CONTINUE'}
                    _onPress={this._nextStep}
                    style={{marginTop: 20}}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      margin: 5,
                      padding: 5,
                      width: '100%',
                      lineHeight: 25,
                    }}>
                    By clicking continue, you agree to our {'\n'}
                    <Text
                      style={{color: THEME.BLUE}}
                      onPress={() =>
                        this.props.navigation.navigate('TermsofUse', {
                          from: 'Registration',
                        })
                      }>
                      Terms and Conditions
                    </Text>{' '}
                    &{' '}
                    <Text
                      style={{color: THEME.BLUE}}
                      onPress={() =>
                        this.props.navigation.navigate('PrivacyPolicy', {
                          from: 'Registration',
                        })
                      }>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
          <Loader isVisible={this.state.loading} />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  parent: {
    flex: 1,
    padding: 20,
  },
  registration: {
    flex: 1,
  },
  heading: {
    color: THEME.PARAGRAPH,
    marginBottom: 20,
    letterSpacing: 1,
  },
  form: {
    paddingHorizontal: 10,
  },
  progress: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  progressLine: {
    height: 2,
    backgroundColor: THEME.GRADIENT_BG.START_COLOR,
  },
  steps: {
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -10,
    right: 0,
    backgroundColor: THEME.GRADIENT_BG.START_COLOR,
    color: THEME.WHITE,
  },
});

export default Registration;
