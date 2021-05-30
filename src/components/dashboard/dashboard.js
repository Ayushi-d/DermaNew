import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import THEME from '../../config/theme';
import {HeaderMain} from '../general/Header';
import photoLink from '../../assets/dashboard/ic_photo.png';
import profileLink from '../../assets/dashboard/ic_profile.png';
import partnerLink from '../../assets/dashboard/ic_partner.png';
import trust from '../../assets/dashboard/ic_trust.png';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import likes from '../../assets/dashboard/ic_like.png';
import filter from '../../assets/dashboard/ic_chatr.png';
import message from '../../assets/dashboard/ic_message.png';
import Cards from '../cards/cards';

// import my matches icon
import Matches from '../../assets/cards/ic_matches.png';
import DEFAULT_BUTTON from '../general/button';
import {Loader} from '../modals';
import TrustScore from '../general/trustScore';
import {NavigationActions} from 'react-navigation';
import PP from '../../helpers/pp';
import search from '../../assets/sidebar';

// import DHeader from '../../components/Headers/DrawerStackHeader';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: null,
      fetched: false,
    };
  }

  componentDidMount() {
    this.fetched = false;
    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        // this.fetchUsers();
      },
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    // this.props.navigation.removeListener(this.didFocusSubscription)
  }

  refreshList = async () => {
    this.setState({data: null}, async () => {
      // this.pp = new PP(2, this.props.context.user || {});
      // let users = await this.pp.getUsers();
      // if (users && Object.keys(users).length != 0) {
      //   this.setData(users);
      // }
    });
  };

  _onPressNavigate = (routeName, obj) => {
    if (obj) {
      this.props.navigation.navigate(
        routeName,
        obj.params,
        NavigationActions.navigate({routeName: obj.sub_view}),
      );
      return;
    } else {
      this.props.navigation.navigate(routeName);
    }
  };

  renderUserLinks = () => {
    return (
      <View style={userLinks.container}>
        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() => this.props.navigation.navigate('My Profile', {id: 0})}>
          <Image source={profileLink} style={userLinks.image} />
          <Text style={userLinks.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() =>
            this.props.navigation.navigate('Manage Photos', {
              fromPage: 'Dashboard',
            })
          }>
          <Image source={photoLink} style={userLinks.image} />
          <Text style={userLinks.text}>Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() => this.props.navigation.navigate('My Profile', {id: 1})}>
          <Image source={partnerLink} style={userLinks.image} />
          <Text style={[{textAlign: 'center'}, userLinks.text]}>
            {'Partner\nPreference'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderTrustScore = () => {
    return (
      <View>
        <View style={trustScore.container}>
          <View style={trustScore.circularProgress}>
            <AnimatedCircularProgress
              size={100}
              width={10}
              fill={this.props.context.user ? this.props.context.user.ts.ts : 0}
              tintColor={THEME.GRADIENT_BG.END_COLOR}
              backgroundColor={THEME.BORDERCOLOR}
              childrenContainerStyle={{padding: 20}}
              rotation={180}>
              {(fill) => (
                <Image
                  source={{
                    uri: this.props.context.user && this.props.context.user.ndp,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                  }}
                />
              )}
            </AnimatedCircularProgress>
          </View>

          <View style={trustScore.colorTrustScore}>
            <Image source={trust} style={trustScore.trustImage} />
            <Text>Trust Score</Text>
            <Text style={trustScore.trustScoreNumber}>
              {this.props.context.user
                ? this.props.context.user.ts.ts + '%'
                : ''}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: THEME.GRAY,
            textAlign: 'center',
            borderBottomWidth: 1,
            borderColor: THEME.BORDERCOLOR,
            padding: 5,
          }}>
          Trust score determines your profile credibility
        </Text>

        <TrustScore
          ts={this.props.context.user ? this.props.context.user.ts : {}}
          style={{padding: 10}}
          _onPress={() =>
            this.props.navigation.navigate('Trust Score', {
              fromPage: 'Dashboard',
            })
          }
        />
      </View>
    );
  };

  renderUserInterection = () => {
    let {user} = this.props.context;

    let chatRequestCount = 0;
    let msgsCount = 0;

    // let cons = user.con;
    // if (cons) {
    //   let con = Object.keys(user.con);
    //   con.forEach((c) => {
    //     if (!cons[c].sn && !cons[c].isAcc) {
    //       chatRequestCount += 1;
    //     } else {
    //       if (cons[c].uc && cons[c].isAcc === 1) {
    //         // console.log(c);
    //         msgsCount += 1;
    //       }
    //     }
    //   });
    // }

    let cons = user.con;
    if (cons) {
      let con = Object.keys(user.con);
      con.forEach((c) => {
        if (!cons[c].sn && cons[c].isAcc !== -1) {
          // chatRequestCount += 1;
          if (!cons[c].pref) {
            chatRequestCount += 1;
          }
        } else {
          if (cons[c].uc && cons[c].isAcc === 1) {
            // console.log(c);
            msgsCount += 1;
          }
        }
      });
    }

    let likesCount = 0;

    if (user && user.lf && user.lf.c) {
      let lf = user.lf;

      Object.keys(lf).forEach((lk) => {
        if (lk !== 'c') {
          if (!lf[lk].pref && !lf[lk].sn) {
            likesCount += 1;
          }
        }
      });
    }

    return (
      <View style={userLinks.container}>
        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() =>
            this.props.navigation.navigate('Likes', {
              id: 'Regular',
              from: 'ref',
            })
          }>
          <View>
            <Image source={likes} style={userLinks.image} />
            {likesCount ? (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -10,
                  right: -18,
                  backgroundColor: THEME.GRADIENT_BG.END_COLOR,
                  width: 30,
                  height: 24,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: THEME.WHITE,
                  }}>
                  {likesCount >= 100 ? '99+' : likesCount}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={userLinks.text}>Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() => {
            this.props.navigation.navigate('MessageBoard', {
              fromPage: 'Dashboard',
              from: 'ref',
            });
          }}>
          <View>
            <Image source={message} style={userLinks.image} />
            {msgsCount ? (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -10,
                  right: -18,
                  backgroundColor: THEME.GRADIENT_BG.END_COLOR,
                  width: 30,
                  height: 24,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: THEME.WHITE,
                  }}>
                  {msgsCount >= 100 ? '99+' : msgsCount}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={[{textAlign: 'center', lineHeight: 15}, userLinks.text]}>
            {'Messages'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[userLinks.link]}
          onPress={() => {
            this.props.navigation.navigate('Chat Request', {
              id: 'Regular',
              tab: 'Regular',
              from: 'ref',
            });
          }}>
          <View>
            <Image source={filter} style={userLinks.image} />
            {chatRequestCount ? (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -10,
                  right: -5,
                  backgroundColor: THEME.GRADIENT_BG.END_COLOR,
                  width: 30,
                  height: 24,
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: THEME.WHITE,
                  }}>
                  {chatRequestCount >= 100 ? '99+' : chatRequestCount}
                </Text>
              </View>
            ) : null}
            <Text style={[{textAlign: 'center'}, userLinks.text]}>
              {'Chat\nRequests'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  fetchUsers = async () => {
    if (this.props.context.user) {
      this.pp = new PP(2, this.props.context.user || {});
    } else {
      return;
    }

    let users = await this.pp.getUsers();
    if (users && Object.keys(users).length != 0) {
      this.setData(users);
    }
  };

  LikesMe = (data) => {
    let lf = this.props.context.user.lf;
    if (lf && data) {
      return Object.keys(lf).includes(data.uid);
    }

    return false;
  };

  likeOther = (data) => {
    let lt =
      this.props.context &&
      this.props.context.user &&
      this.props.context.user.lt;

    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
    }

    return false;
  };

  setData = (obj) => {
    let keys = Object.keys(obj);

    let data = {...this.state.data};

    let list = Object.keys(data); // 0

    let count = 0;
    keys.map((item) => {
      if (count < 3) {
        data[item] = obj[item];
        count += 1;
      }
    });

    this.setState({matches: data}); // if got minimum items then set it
  };

  renderMatchCards = (data, index) => {
    return (
      <Cards
        key={index}
        data={data}
        fromLike={true}
        sent={this.state.tab == 1}
        likesMe={this.LikesMe(data)}
        likeOther={this.likeOther(data)}
        navigateToMember={this.navigateToMember}
        fromPage={'Dashboard'}
        {...this.props}
      />
    );
  };

  renderViewAll = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 13,
            textAlign: 'left',
            paddingHorizontal: 20,
            marginVertical: 10,
          }}>
          View all the profiles who matches your partner preferences
        </Text>
        <DEFAULT_BUTTON
          text={'View Matching profiles'}
          style={{alignSelf: 'center', marginVertical: 20, width: 220}}
          _onPress={() =>
            this.props.navigation.navigate('My Matches', {from: 'ref'})
          }
        />
      </>
    );
  };

  renderViewSearch = () => {
    // console.log(this.props.root.navigation);
    return (
      <>
        <Text
          style={{
            fontSize: 13,
            textAlign: 'left',
            paddingHorizontal: 20,
            marginVertical: 10,
          }}>
          Search profiles of your choice
        </Text>
        <DEFAULT_BUTTON
          text={'Search Now'}
          style={{alignSelf: 'center', marginVertical: 20, width: 220}}
          _onPress={() => this.props.root.navigation.navigate('Search')}
        />
      </>
    );
  };

  renderMatches = () => {
    return (
      <View style={{marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Image
            source={Matches}
            style={{width: 30, height: 30, resizeMode: 'contain'}}
          />
          <Text style={{marginLeft: 8}}>My Matches</Text>
        </View>
        {this.renderViewAll()}
      </View>
    );
  };

  renderSearch = () => {
    return (
      <View style={{marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Image
            source={search.Search}
            style={{width: 30, height: 30, resizeMode: 'contain'}}
          />
          <Text style={{marginLeft: 8}}>Search</Text>
        </View>
        {this.renderViewSearch()}
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <HeaderMain routeName="Dashboard" {...this.props} />
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          // nestedScrollEnabled={true}
        >
          {this.renderUserLinks()}
          {this.renderTrustScore()}
          {this.renderUserInterection()}
          {this.renderMatches()}
          <View style={styles.line} />
          {this.renderSearch()}
          {/* {this.props.context.loading ? (
            <Loader isVisible={this.props.context.loading} />
          ) : null} */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 2,
    backgroundColor: THEME.BORDERCOLOR,
  },
});

const userLinks = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    borderColor: THEME.BORDERCOLOR,
    borderWidth: 1,
  },

  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  link: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    alignItems: 'center',
    height: '100%',
    paddingTop: 10,
  },
  text: {
    color: THEME.PARAGRAPH,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    flex: 1,
    // borderWidth: 1,
    borderColor: THEME.WHITE,
  },
});

const trustScore = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  circularProgress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustScoreNumber: {
    fontWeight: '800',
    fontSize: 20,
    color: THEME.GRADIENT_BG.END_COLOR,
    borderWidth: 1,
    borderColor: THEME.WHITE,
  },
  colorTrustScore: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Dashboard;
