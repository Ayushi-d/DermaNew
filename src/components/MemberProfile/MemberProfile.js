import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {MemberHeader} from '../general/Header';
import Cards from '../cards/cards';
import THEME from '../../config/theme';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import verFacebook from '../../assets/dashboard/ic_ver_facebook.png';
import verMobile from '../../assets/dashboard/ic_ver_mobile.png';
import verPhoto from '../../assets/dashboard/ic_ver_photo.png';
import verEmail from '../../assets/dashboard/ic_email.png';
import checked from '../../assets/MemberProfile/checked.png';
import {getData} from '../../config/parseuser';
import LinearGradient from 'react-native-linear-gradient';
import message from '../../assets/cards/ic_message.png';
import auth from '@react-native-firebase/auth';
import AboutMe from '../general/AboutMe';
import CustomBackAction from '../general/CustomBackAction';

import Header from '../Headers/msgHeader';

import {Chip} from 'react-native-paper';

const trustScoreObj = [
  ['em', verEmail, 'Email\nVerified'],
  ['f', verFacebook, 'Facebook\nLinked'],
  ['m', verMobile, 'Phone Number\nVerified'],
  ['pd', verPhoto, 'Photo ID\nVerified'],
];

const aboutUser = {
  'ABOUT ME': [
    {
      name: 'ABOUT ME',
      props: 'nae',
    },
  ],
  Location: [
    {
      name: 'City',
      props: 'ct',
    },
    {
      name: 'State',
      props: 's',
    },
    {
      name: 'Country',
      props: 'c',
    },
  ],
  Education: [
    {
      name: 'Education',
      props: 'edc',
    },
  ],
  Profession: [
    {
      name: 'Profession',
      props: 'p',
    },
  ],
  Personal: [
    {
      name: 'Children',
      props: 'ch',
    },
  ],
  Interest: [
    {
      name: 'Interest',
      props: 'in',
    },
  ],
  Smoke: [
    {
      name: 'Smoke',
      props: 'sk',
    },
    {
      name: 'Drink',
      props: 'dk',
    },
    {
      name: 'Diet',
      props: 'dt',
    },
  ],
};

class MemberProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let data = this.props.route.params.data;
  }

  renderTSIcon = () => {
    let data = this.props.route.params.data;
    if (!data) return null;
    let tsd = data ? data.ts : null;

    return (
      <View style={ts.tsIconContainer}>
        {trustScoreObj.map((item) => {
          if (tsd[item[0]] == 1) {
            return (
              <View
                key={item[0]}
                style={{marginRight: 30, alignItems: 'center'}}>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Image source={item[1]} style={ts.tsIconImage} />
                  <Image source={checked} style={ts.checked} />
                </View>
                <Text style={{textAlign: 'center'}}>{item[2]}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  };

  renderTrustScore = () => {
    let data = this.props.route.params.data;
    return (
      <View style={ts.container}>
        <View style={ts.circularProgress}>
          <AnimatedCircularProgress
            size={100}
            width={15}
            fill={data ? data.ts.ts : 0}
            tintColor={THEME.GRADIENT_BG.END_COLOR}
            backgroundColor={'#dedede'}
            rotation={270}
            arcSweepAngle={180}>
            {(fill) => <Text style={ts.ts}>{data ? `${data.ts.ts}%` : 0}</Text>}
          </AnimatedCircularProgress>
          <Text style={ts.tsText}>TRUST SCORE</Text>
        </View>
        {this.renderTSIcon()}
      </View>
    );
  };

  renderCard = () => {
    let data = this.props.route.params.data;
    let likesMe = this.props.route.params.likesMe;
    return (
      <Cards
        data={data}
        likesMe={likesMe}
        hideTrust={true}
        hideDOB={true}
        hideButton={true}
        fromMember={true}
        {...this.props}
      />
    );
  };

  renderInfo = () => {
    let user_data = this.props.route.params.data;
    if (!user_data) return null;
    return (
      <View style={tabContent.container}>
        {Object.keys(aboutUser).map((item, i) => (
          <View key={i} style={tabContent.block}>
            {aboutUser[item].map((obj) => {
              return getData(user_data, obj.name) == '' &&
                obj.name != 'ABOUT ME' &&
                obj.name != 'Interest' ? null : (
                <View key={obj.name} style={tabContent.blockItem}>
                  <Text style={tabContent.ch}>{obj.name}</Text>
                  {obj.name == 'ABOUT ME' ? (
                    <AboutMe
                      style={tabContent.value}
                      data={getData(user_data, 'About Me')}
                    />
                  ) : (
                    <>
                      {obj.name === 'Interest' ? (
                        <View
                          style={{
                            padding: 10,
                            width: '100%',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                          }}>
                          {getData(user_data, obj.name).map((d) => (
                            <Chip
                              style={{margin: 2, borderColor: '#222'}}
                              key={d}>
                              {d}
                            </Chip>
                          ))}
                        </View>
                      ) : (
                        <Text style={tabContent.value}>
                          {getData(user_data, obj.name)}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  renderFloatingMessageIcon = () => {
    return (
      <LinearGradient
        colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: THEME.WHITE,
            width: 100,
            height: 50,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this.navigateToMessageScreen}>
          <Image
            source={message}
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  navigateToMessageScreen = () => {
    let oUserData = this.props.route.params.data;
    let oUID = oUserData && oUserData.uid;
    let cUID = auth().currentUser.uid;

    let data = {
      otheruser: {...oUserData},
    };

    let fromPageHistory = this.props.route.params.fromPage;

    this.props.navigation.navigate('Message', {
      data: {
        ...data,
        refKey: cUID < oUID ? cUID + oUID : oUID + cUID,
        from: null,
        member: oUserData,
      },
      fromPage: 'Member Profile',
      fromPageHistory,
    });
  };

  render() {
    let data = this.props.route.params.data;
    this.hideMessage = this.props.route.params.hideMessage;
    // console.log(this.props.route.params.hideMessage);
    this.fromPageHistory = this.props.route.params.fromPageHistory;

    return (
      <View style={{flex: 1, paddingBottom: !this.hideMessage ? 100 : 0}}>
        <Header
          right
          hideRight={this.hideMessage}
          title={'Member Profile'}
          {...this.props}
          data={data}
          refr
        />
        <ScrollView style={{flex: 1}}>
          {this.renderCard()}
          {this.renderTrustScore()}
          {this.renderInfo()}
        </ScrollView>
        {!this.hideMessage ? this.renderFloatingMessageIcon() : null}
      </View>
    );
  }
}

const ts = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomColor: THEME.BORDERCOLOR,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  circularProgress: {},
  ts: {
    color: THEME.GRADIENT_BG.START_COLOR,
    fontSize: 18,
    position: 'absolute',
    top: 15,
  },
  tsText: {
    position: 'absolute',
    top: 60,
    width: 100,
    textAlign: 'center',
    color: THEME.GRADIENT_BG.END_COLOR,
    fontSize: 15,
    fontWeight: '800',
  },
  tsIconContainer: {
    width: '90%',
    borderColor: THEME.GRAY,
    flexDirection: 'row',
    flex: 1,
  },
  tsIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  checked: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 0,
  },
});

const tabContent = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
  },

  block: {
    borderBottomColor: THEME.BORDERCOLOR,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  edit: {
    position: 'absolute',
    width: 20,
    height: 20,
    resizeMode: 'contain',
    right: 10,
    top: 10,
  },
  ch: {
    color: THEME.PARAGRAPH,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 14,
    color: THEME.GRAY,
    marginTop: 2,
  },
  blockItem: {
    marginBottom: 10,
  },
});

export default CustomBackAction(MemberProfile);
