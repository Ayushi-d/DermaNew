import React from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import THEME from '../../config/theme';
import {BUTTON_WITH_PARAM} from '../general/button';
import {HeaderMain} from '../general/Header';
import Cards from '../cards/cards';
import auth from '@react-native-firebase/auth';
import DateHelpers from '../../helpers/datehelpers';
import database from '@react-native-firebase/database';
import moment from 'moment';
import {CommonActions} from '@react-navigation/native';
import Loader from '../modals/loaders';
import CardShimmer from '../cards/cardShimmer';
import {ShimmerLoader} from '../ShimmerLoader/ShimmerLoader';
import { ActivityIndicator } from 'react-native';

class Likes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      focused: false,
      endReached: false,
      loadMore: false,
      lastItem: '',
      onEndReachedCalledDuringMomentum: true,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let id = props.route.params.id;
    if (id == 'Regular' || id == 'default') {
      // this.setState({tab: 0}, () => {
      //   this.flatListref &&
      //     this.flatListref.scrollToOffset({
      //       offset: this.state.scrollPosition[0],
      //       animated: false,
      //     });
      // });
    }

    if (id == 'Filtered Out') {
      // this.setState({tab: 1}, () => {
      //   this.flatListref &&
      //     this.flatListref.scrollToOffset({
      //       offset: this.state.scrollPosition[1],
      //       animated: false,
      //     });
      // });
      this.setState({tab: 0}, () => {
        this.setState({onEndReachedCalledDuringMomentum: false});
        this.loadMore();
        //console.log('calling for more!', lItem);
        // this.flatListref &&
        //   this.flatListref.scrollToOffset({
        //     offset: this.state.scrollPosition[0],
        //     animated: false,
        //   });
      });
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1}, () => {
        // this.flatListref &&
        //   this.flatListref.scrollToOffset({
        //     offset: this.state.scrollPosition[1],
        //     animated: false,
        //   });
      });
    }
  }

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
    console.log('component did mount call')
    let id = this.props.route.params.id;
    if (id == 'Regular' || id == 'default') {
      // this.setState({tab: 0});
    }

    if (id == 'Filtered Out') {
      // this.setState({tab: 1});
    }

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        let page = route.params.id;
        if (route.params && route.params.from === 'ref') {
          this.setState({focused: true});

          this.props.context.getUserLikeData(page);
          this.props.context.childRemoved();
          console.log('likes.js return!');
          this.props.context._changeCount(page);
        }
        // this._changeCount(route);
      },
    );
    this.didBlurSubscription = this.props.navigation.addListener(
      'blur',
      (payload) => {
        this.setState({focused: false});
        this.props.navigation.dispatch(CommonActions.setParams({from: ''}));
      },
    );
  }
  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  componentDidUpdate(prevProps, prevState) {
    let id = this.props.route.params.id;
    let prevId = prevProps.route.params.id;
    if (id !== prevId) {
      if (id == 'Regular' || id == 'default') {
        // this.setState({tab: 0}, () => {
        //   this.flatListref &&
        //     this.flatListref.scrollToOffset({
        //       offset: this.state.scrollPosition[0],
        //       animated: false,
        //     });
        // });
      }

      if (id == 'Filtered Out') {
        // this.setState({tab: 1}, () => {
        //   this.flatListref &&
        //     this.flatListref.scrollToOffset({
        //       offset: this.state.scrollPosition[1],
        //       animated: false,
        //     });
        // });
      }
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   let id = this.props.route.params.id;
  //   let prevId = prevProps.route.params.id;
  //   if (id !== prevId) {
  //     if (id == 'Regular' || id == 'default') {
  //       this.setState({tab: 0}, () => {
  //         // this.flatListref &&
  //         //   this.flatListref.scrollToOffset({
  //         //     offset: this.state.scrollPosition[0],
  //         //     animated: false,
  //         //   });
  //       });
  //     }

  //     if (id == 'Filtered Out') {
  //       this.setState({tab: 1}, () => {
  //         // this.flatListref &&
  //         //   this.flatListref.scrollToOffset({
  //         //     offset: this.state.scrollPosition[1],
  //         //     animated: false,
  //         //   });
  //       });
  //     }
  //   }
  // }

  _getLikes = () => {
    let {user} = this.props.context;
    let likesRef = database().ref(`Users/`);
  };
  _getLikesRemoved = () => {};

  // _changeCount(page) {
  //   // update like notifications
  //   let uid = auth().currentUser.uid;
  //   // database().ref(`Users/${uid}`).child('lf').child('c').set(0);
  //   database()
  //     .ref(`Users/${uid}`)
  //     .child('lf')
  //     .once('value')
  //     .then((lf) => {
  //       if (lf.exists() && lf.val()) {
  //         lf = lf.val();
  //         let lObj = Object.keys(lf)
  //         lObj.forEach((l) => {
  //           if (l !== 'c') {
  //             if (!lf[l].sn) {
  //               database()
  //                 .ref(`Users/${uid}`)
  //                 .child('lf')
  //                 .child(l)
  //                 .child('sn')
  //                 .set(1);
  //             }
  //           }
  //         });
  //       }
  //     });
  // }

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      // setTimeout(
      //   () =>
      //     this.flatListref &&
      //     this.flatListref.scrollToOffset({
      //       offset: this.state.scrollPosition[tabValue],
      //       animated: false,
      //     }),
      //   1,
      // );

      this.props.navigation.setParams({
        id: this.state.tab == 0 ? 'Regular' : 'Filtered Out',
      });
    });
  };

  // handleScroll = (event) => {
  //   let scrollPosition = [...this.state.scrollPosition];
  //   let tab = this.state.tab;
  //   scrollPosition[tab] = event.nativeEvent.contentOffset.y;
  //   this.setState({scrollPosition});
  // };

  loadMore = async () => {
    let {user} = this.props.context;
    if (this.state.onEndReachedCalledDuringMomentum) return null;
    this.setState({loadMore: true});

    let {lastItem, data} = this.state;
    // let dKeys = Object.keys(data);
    // let lastItem = data[dKeys[dKeys.length - 1]].cat;

    let {users, lItem} = await this.pp._getUsers(lastItem);
    this.setState({lastItem: lItem});

    if (users && Object.keys(users).length != 0) {
      let uKeys = Object.keys(users);
      let newUsers = {};
      for (let uk of uKeys) {
        let ouser = users[uk];
        let uid = user.uid;
        let ouid = ouser.uid;

        let uid1 = uid < ouid ? uid : ouid;
        let uid2 = uid > ouid ? uid : ouid;
        let refKey = uid1 + uid2;

        if (user.g === ouser.g) {
          continue;
        }

        if (ouser.con && ouser.con[refKey] && ouser.con[refKey].isAcc === -1) {
          continue;
        }
        if (user.bb && user.bb[ouid]) {
          continue;
        }
        // check if blocked by user!
        if (user.bt && user.bt[ouid]) {
          continue;
        }
        newUsers[uk] = users[uk];
      }
      this.setData(newUsers);
    } else {
      // Snackbar.show({
      //   title: 'You have reached to the end of the matched users list.',
      //   duration: Snackbar.LENGTH_SHORT,
      // });
    }
    this.setState({loadMore: false, onEndReachedCalledDuringMomentum: true});
  };

  setData = (obj) => {
    let keys = Object.keys(obj);

    let data = {...this.state.data};

    let list = Object.keys(data); // 0

    keys.map((item) => {
      data[item] = obj[item];
    });

    this.setState({data, loading: false, refreshing: false}); // if got minimum items then set it
  };



  renderTab = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 20,
        }}>
        <BUTTON_WITH_PARAM
          text={'Regular'}
          style={{width: '40%'}}
          checked={this.state.tab == 0}
          _onPress={this._onTabPress}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'Filtered Out'}
          checked={!(this.state.tab == 0)}
          _onPress={this._onTabPress}
          pressParam={1}
        />
      </View>
    );
  };

  _onMomentumScrollBegin = () =>
  this.setState({onEndReachedCalledDuringMomentum: false});

  renderCards = () => {
    let data =
      this.state.tab == 0
        ? this.props.context.regular
        : this.props.context.filteredOut;
    let {user} = this.props.appContext;

    // sort by like recieved time

    if (!data) return;
    let sortedKeys = Object.keys(data).sort((a, b) => {
      // console.log(data[a]);
      return user.lf[data[b].uid].tp - user.lf[data[a].uid].tp;
    });



    if (data) {
      return (
        <FlatList
          // ref={(ref) => (this.flatListref = ref)}
          data={sortedKeys}
          extraData={sortedKeys}
          renderItem={({item}) => {
            let likeOther = this.likeOther(data[item]);
            // console.log('likeOther: ', likeOther);
            return (
              <Cards
                data={data[item]}
                fromLike={true}
                sent={this.state.tab == 1}
                likesMe={true}
                likeOther={likeOther}
                dateToShow={moment(
                  new Date(user.lf[data[item].uid].tp * 1000),
                ).calendar()}
                fromPage={'Likes'}
                {...this.props}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.03}
          ListFooterComponent={this.renderFooter}
          
          onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
          style={{flexGrow: 1}}
          // onScroll={this.handleScroll}
        />
      );
    } else {
      return null;
    }
  };

  likeOther = (data) => {
    let {user} = this.props.appContext;
    if (user.lt && data) {
      return Object.keys(user.lt).includes(data.uid);
    }

    return false;
  };

  renderFooter = () => {
    return this.state.loadMore ? (
      <ActivityIndicator
        size={'large'}
        color={THEME.GRADIENT_BG.END_COLOR}
        animating
      />
    ) : null;
  };

  render() {
    let {focused} = this.state;
    let loading = this.props.context.loadingF;
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Likes Received" {...this.props} />

        {this.state.loading && focused ? (
          <>
            {this.filterShimmer()}
            <CardShimmer />
          </>
        ) : (
          <>
            {this.renderTab()}
            {this.renderCards()}
          </>
        )}
      </View>
    );
  }
}

export default Likes;
