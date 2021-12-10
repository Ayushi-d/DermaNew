import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
// import {HeaderMain} from '../general/Header';
import Snackbar from 'react-native-snackbar';
import Cards from '../cards/cards';
import THEME from '../../config/theme';
import PP from '../../helpers/pp';
import {Loader} from '../modals';
// import {NavigationActions} from 'react-navigation';
import Header from '../Headers/SettingsHeader';
import CardShimmer from '../cards/cardShimmer';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      refreshing: false,
      data: {},
      endReached: false,
      loadMore: false,
      onEndReachedCalledDuringMomentum: true,
    };
  }

  componentDidMount() {
    let user = this.props.route.params.user;
    let usr = this.props.context.user;
    // console.log(user, usr);

    this.pp = new PP(20, user || {});
    this.fetchUser();
  }

  // UNSAFE_componentWillReceiveProps(props) {
  //   this.refreshList();
  // }

  fetchUser = async () => {
    let {user} = this.props.context;

    this.setState({loading: true}, async () => {
      let {users, lItem} = await this.pp._getUsers(null, true);
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
          if (
            ouser.con &&
            ouser.con[refKey] &&
            ouser.con[refKey].isAcc === -1
          ) {
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
        if (Object.keys(newUsers).length === 1) {
          this.setState({onEndReachedCalledDuringMomentum: false});
          this.loadMore();
          console.log('calling for more!', lItem);
        }
      } else {
        this.setState({loading: false}, () => {
          alert('No Matching users found');
        });
      }
    });
  };

  loadMore = async () => {
    let {user} = this.props.context;
    if (this.state.onEndReachedCalledDuringMomentum) return null;

    this.setState({loadMore: true});
    let {data, lastItem} = this.state;
    // let dKeys = Object.keys(data);
    // let lastItem = data[dKeys[dKeys.length - 1]].cat;
    // console.log(lastItem);

    let {users, lItem} = await this.pp._getUsers(lastItem, true);

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
        // console.log(users[uk].nm);
      }
      // this.setData(newUsers);
      // console.log(newUsers);
      // console.log(Object.keys(data).length);
      this.setData(newUsers);
    } else {
      // Snackbar.show({
      //   text: 'You have reached to the end of the matched users list.',
      //   duration: Snackbar.LENGTH_SHORT,
      // });
    }
    this.setState({loadMore: false, onEndReachedCalledDuringMomentum: true});
  };

  setData = (obj, refresh) => {
    let keys = Object.keys(obj);

    let data = {};

    if (!refresh) {
      data = {...this.state.data};
    }

    let list = Object.keys(data); // 0

    keys.map((item) => {
      data[item] = obj[item];
    });

    this.setState({data, loading: false, refreshing: false}); // if got minimum items then set it
  };

  refreshList = async () => {
    // user from props
    let user = this.props.route.params.user;

    this.setState({refreshing: true, data: {}}, async () => {
      this.pp = new PP(20, user || {});
      let {users, lItem} = await this.pp._getUsers(null, true);
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
          if (
            ouser.con &&
            ouser.con[refKey] &&
            ouser.con[refKey].isAcc === -1
          ) {
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

        this.setData(newUsers, true);
      } else {
        this.setState({refreshing: false}, () => {
          alert('No Users Found!');
        });
      }
    });
  };

  _onMomentumScrollBegin = () =>
    this.setState({onEndReachedCalledDuringMomentum: false});

  renderCards = () => {
    let data = this.state.data;

    if (!data) return null;
    let sortedKeys = Object.keys(data).sort(
      (a, b) => data[b].cat - data[a].cat,
    );

    return (
      <FlatList
        data={sortedKeys}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromLike={true}
            sent={this.state.tab == 1}
            likesMe={this.LikesMe(data[item])}
            fromSearchResult={true}
            navigation={this.props.navigation}
            fromPage={'Search Result'}
            likeOther={this.likeOther(data[item])}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.03}
        refreshing={this.state.refreshing}
        ListFooterComponent={this.renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        onRefresh={this.refreshList}
        onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
      />
    );
  };

  LikesMe = (data) => {
    let user = this.props.context.user;
    let lf = user.lf;
    if (lf && data) {
      return Object.keys(lf).includes(data.uid);
    }

    return false;
  };

  likeOther = (data) => {
    let user = this.props.context.user;
    let lt = user.lt;
    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
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
    return (
      <View style={{flex: 1}}>
        <Header title={'Search Results'} {...this.props} />
        {this.state.loading ? <CardShimmer /> : this.renderCards()}
      </View>
    );
  }
}

export default SearchResult;
