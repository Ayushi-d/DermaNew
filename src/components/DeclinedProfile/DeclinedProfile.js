import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {HeaderMain} from '../general/Header';

import database from '@react-native-firebase/database';
import Cards from '../cards/cards';
import {BUTTON_WITH_PARAM, UNBLOCK_BUTTON} from '../general/button';
import Header from '../Headers/SettingsHeader';

import moment from 'moment';

import Loader from '../modals/loaders';

import {CommonActions} from '@react-navigation/native';
import DateHelpers from "../../helpers/datehelpers";
import THEME from "../../config/theme";
import {STYLE} from "../commonStyle";
import {ShimmerLoader} from '../ShimmerLoader/ShimmerLoader';
import CardShimmer from '../cards/cardShimmer';
class DeclinedProfileJSX extends React.Component {
  state = {
    declinedUsers: [],
    tab: 0,
    loading: false,
  };

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue});
  };

  filterShimmer = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ShimmerLoader
          styles={{
            height: 55,
            width: '35%',
            borderRadius: 30,
            marginHorizontal: 20,
          }}
        />
        <ShimmerLoader
          styles={{
            height: 55,
            width: '35%',
            borderRadius: 30,
            marginHorizontal: 20,
          }}
        />
      </View>
    );
  };

  componentDidMount() {
    this._getDec();
    this.didFocusSubscription = this.props.navigation.addListener(
        'focus',
        (payload) => {
            this.setState({loading : false})
          let {route} = this.props;
          if (route.params && route.params.from === 'ref') {
            this._getDec();
            console.log('declinedProfile return!');
          }
        },
    );
    this.didBlurSubscription = this.props.navigation.addListener(
        'blur',
        (payload) => {
            this.setState({loading : true})
          this.props.navigation.dispatch(CommonActions.setParams({from: ''}));
        },
    );
  }

  _getDec = () => {
    if (this.dtRef) {
      this.dtRef.off('value');
    }

    let {user} = this.props.context;

    this.setState({loading: true});

    this.uid = this.props.context.user.uid;
    this.dtRef = database()
        .ref('Users/' + this.uid)
        .child('con')
        .orderByChild('lT');

    if (!user.con) {
      this.setState({loading: false});
      return;
    }

    this.dtRef.on(
        'value',
        async (snap) => {
          // console.log(snap.val());
          let allChats = [];
          let chats = snap.val();
          let dKeys = Object.keys(chats);
          for (let dk of dKeys) {
            let c = chats[dk];
            let cht = await database().ref(`conversation/${dk}`).once('value');
            if (!cht.exists || cht.val() === null) {
              continue;
            }
            let chat = cht.val();
            if (!chat.isAcc || (chat.isAcc && chat.isAcc !== -1)) {
              continue;
            }
            let ouid = dk.split(this.uid).join('');
            let cUser = await database().ref(`Users/${ouid}`).once('value');
            if (!cUser.exists || cUser.val() === null) {
              continue;
            }
            let ouser = cUser.val();

            chat['cUser'] = ouser;

            if (ouser.bb && ouser.bb[user.uid]) {
              continue;
            }
            // check if blocked by user!
            if (ouser.bt && ouser.bt[user.uid]) {
              continue;
            }
            allChats.push(chat);
          }
          allChats.sort((a, b) => {
            return b.dlT * 1000 - a.dlT * 1000;
          });
          this.setState({declinedUsers: allChats, loading: false});
          // this.fetchData(snap.key, snap.val());
        },
        (err) => {
          this.setState({loading: false});
          console.log('DeclinedProfile.js err: ', err);
        },
    );
  };

  renderMessageReq = () => {
    let {declinedUsers, tab} = this.state;
    // let {dKeys} = this.state;
    // console.log(dKeys);

    if (declinedUsers.length == 0) return null;

    // console.log(tab);

    if (!tab) {
      declinedUsers = declinedUsers.filter(
          (u) => u.inR && u.inR.uid !== this.uid,
      );
    } else {
      declinedUsers = declinedUsers.filter(
          (u) => u.inR && u.inR.uid === this.uid,
      );
    }

    console.log('this.state.tab', this.state.tab)
    // let {user} = this.props.appContext;
    return (
        <FlatList
            data={declinedUsers}
            renderItem={({item}) => {
              let chat = item;
              return (
                  this.state.tab === 1 ?
                      <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Member Profile', {
                              data: chat.cUser,
                              fromPage: 'Decline Profile',
                              fromPageHistory: 'Decline Profile',
                              hideMessage: false,
                              likesMe: this.LikesMe(chat.cUser)
                            })
                          }}
                          disabled={this.state.tab == 1 ? true : false}>
                        <View style={STYLE.cardsContainer}>
                          <View style={STYLE.image_view}>
                            <Image
                                source={{uri: chat.cUser.dp}}
                                style={STYLE.milk}
                            />
                            <View style={STYLE.margin_style}>
                              <View>
                                <View style={{flexDirection: 'row'}}>
                                  <Text style={[STYLE.productname, {fontWeight: 'bold'}]}>
                                    {chat.cUser['sn']}
                                  </Text>
                                  <Text
                                      style={[STYLE.productname, {width: '59%', marginLeft: 5, fontWeight:'bold'}]}>
                                    {`${DateHelpers.getAge(chat.cUser.dob)}`}
                                  </Text>
                                </View>
                                <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style={STYLE.productname}>
                                    {chat.cUser.ct}
                                  </Text>
                                  <Text style={[STYLE.productname, {marginLeft: 5}]}>
                                    {chat.cUser.c}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{marginLeft: 'auto', marginBottom: 30, width: 100}}>
                              {chat.dlT &&
                              <Text style={STYLE.productname}>
                                {moment(new Date(chat.dlT * 1000)).calendar()}
                              </Text>
                              }
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      :
                      <Cards
                          data={chat.cUser}
                          hideButton={true}
                          sent={this.state.tab == 1}
                          message={chat.lm.mg}
                          fromDeclined={true}
                          declinedRef={tab}
                          navigation={this.props.navigation}
                          likesMe={this.LikesMe(chat.cUser)}
                          dateToShow={moment(new Date(chat.dlT * 1000)).calendar()}
                          messageRefKey={chat.refKey}
                          fromPage={'Decline Profile'}
                      />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            style={{flexGrow: 1}}
        />
    );
  };

  LikesMe = (data) => {
    let lt = this.props.context.user.lt;
    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
    }
    return false;
  };

  componentWillUnmount() {
    if (this.dtRef) {
      this.dtRef.off('value');
      // this.dtRef.off('child_removed');
    }
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  renderTab = () => {
    return (
        <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 20,
            }}>
          <BUTTON_WITH_PARAM
              text={'BY ME'}
              style={{width: '40%'}}
              checked={this.state.tab == 0}
              _onPress={this._onTabPress}
              pressParam={0}
          />
          <BUTTON_WITH_PARAM
              style={{width: '40%'}}
              text={'BY OTHERS'}
              checked={!(this.state.tab == 0)}
              _onPress={this._onTabPress}
              pressParam={1}
          />
        </View>
    );
  };

  render() {
    let {loading} = this.state;
    return (
        // <View style={{flex: 1}}>
        //   <Header title="Declined Profile" type {...this.props} />
        //   {this.renderTab()}
        //   {this.renderMessageReq()}
        //   {loading ? <Loader isVisible={loading} /> : null}
        // </View>
      <View style={{flex: 1}}>
        <Header title="Declined Profile" type {...this.props} />
        {loading ? (
          <>
            {this.filterShimmer()}
            <CardShimmer request={true} blocked={true} />
          </>
        ) : (
          <>
            {this.renderTab()}
            {this.renderMessageReq()}
          </>
        )}
      </View>
    );
  }
}

const DeclinedProfile = (props) => <DeclinedProfileJSX {...props} />;

export default DeclinedProfile;
