import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Animated,
} from 'react-native';
import blocked from '../../assets/settings/ic_blocked.png';
import help from '../../assets/settings/ic_help.png';
import inviteF from '../../assets/settings/ic_invitefriend.png';
import matches from '../../assets/settings/ic_matches.png';
import safety from '../../assets/settings/ic_trust_copy_7.png';
import about from '../../assets/settings/ic_about.png';
import policy from '../../assets/settings/ic_policy.png';
import terms from '../../assets/settings/ic_termscondition.png';
import del from '../../assets/settings/ic_delete.png';
import update from '../../assets/settings/ic_update.png';
import edit_mobile from '../../assets/settings/ic_edit_copy.png';
import THEME from '../../config/theme';

import auth from '@react-native-firebase/auth';
import {Loader} from '../modals';
import DEFAULT_BUTTON from '../general/button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SettingsHeader from '../Headers/SettingsHeader';

const data = [
  [
    'Your Contact Details',
    edit_mobile,
    function () {
      this.props.navigation.navigate('Change Mobile Number');
    },
  ],
  [
    'Blocked Profile',
    blocked,
    function () {
      this.props.navigation.navigate('Blocked');
    },
  ],
  [
    'Help',
    help,
    function () {
      this.props.navigation.navigate('Help Screen', {hideHeader: true});
    },
  ],
  [
    'Invite Friends',
    inviteF,
    function () {
      this.shareLink();
    },
  ],
  [
    'How to get better matches',
    matches,
    function () {
      this.navigateTo('BetterMatches');
    },
  ],
  [
    'Safety Guidelines',
    safety,
    function () {
      this.navigateTo('Safety Guidelines');
    },
  ],
  [
    'About',
    about,
    function () {
      this.navigateTo('About');
    },
  ],
  [
    'Privacy Policy',
    policy,
    function () {
      this.navigateTo('PrivacyPolicy');
    },
  ],
  [
    'Terms & Condition',
    terms,
    function () {
      this.navigateTo('TermsofUse');
    },
  ],
  // [
  //   'Delete',
  //   del,
  //   function () {
  //     this.props.navigation.navigate('Delete');
  //   },
  // ],
  // [
  //   'Check for updates',
  //   update,
  //   function() {
  //     CodePush.sync({
  //       updateDialog: true,
  //       installMode: CodePush.InstallMode.IMMEDIATE,
  //     });
  //   },
  // ],
];

class SettingsJSX extends React.Component {
  state = {
    loading: false,
  };

  navigateTo = (obj) => {
    this.props.navigation.navigate(obj);
  };

  renderItems = (item) => {
    return (
      <TouchableOpacity style={style.items} onPress={() => item[2].call(this)}>
        {item[0] === 'Your Contact Details' ?
            <Icon name={'cellphone'} color={THEME.GRADIENT_BG.END_COLOR} size={25} />
            :
            <Image source={item[1]} style={style.image} />
        }
        <Text style={style.text}>{item[0]}</Text>
      </TouchableOpacity>
    );
  };

  shareLink = () => {
    Share.share(
      {
        message:
          'Derma Cupid – dating and matchmaking app for people with skin conditions. http://dermacupid.com/',
        title: 'Derma Cupid',
      },
      {
        // Android only:
        dialogTitle: 'Derma Cupid',
      },
    );
  };

  logout = () => {
    this.setState({loading: true}, () => {
      auth()
        .signOut()
        .then((res) => {
          this.setState({loading: false}, () => {
            // this.props.navigation.navigate('Login');
            this.props.context._logout();
          });
        });
    });
  };

  render() {
    return (
      <View>
        <SettingsHeader title={'Settings'} type={1} {...this.props} />
        <FlatList
          data={data}
          renderItem={({item}) => this.renderItems(item)}
          keyExtractor={(item, index) => index.toString()}
          style={{flexGrow: 1}}
          onEndReached={this.nextPage}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          ListFooterComponent={
            <>
              <DEFAULT_BUTTON
                text={'LOG OUT'}
                style={{alignSelf: 'center', marginTop: 20}}
                _onPress={this.logout}
              />
              <TouchableOpacity
                style={{
                  marginTop: 45,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.props.navigation.navigate('Delete')}>
                <Text
                  style={{
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                    textDecorationColor: '#0066cc',
                    color: '#0066cc',
                    fontSize: 17,
                  }}>
                  DELETE PROFILE
                </Text>
              </TouchableOpacity>
            </>
          }
        />
        {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  items: {
    flexDirection: 'row',
    padding: 20,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  text: {
    color: THEME.GRAY,
    marginLeft: 20,
    fontSize: 16,
  },
});

const Settings = (props) => {
  return <SettingsJSX {...props} />;
};

export default Settings;
