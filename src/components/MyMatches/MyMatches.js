import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {HeaderMain} from '../general/Header';
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import Cards from '../cards/cards';
import THEME from '../../config/theme';
import PP from '../../helpers/pp';
import {Loader} from '../modals';

class MyMatchesJSX extends React.Component {
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
    this.pp = new PP(2, this.props.context.user || {});
    this.fetchUser();

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params.from === 'ref') {
          this.refreshList();
        }
      },
    );

    this.didBlurSubscription = this.props.navigation.addListener(
      'blur',
      (payload) => {
        this.props.navigation.dispatch(CommonActions.setParams({from: ''}));
      },
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  navigateToMember = (data) => {
    this.props.navigation.navigate('Member Profile', data);
  };

  fetchUser = async () => {
    let {user} = this.props.context;

    this.setState({loading: true}, async () => {
      let users = await this.pp.getUsers();
      if (users && Object.keys(users).length != 0) {
        let uKeys = Object.keys(users);
        let newUsers = {};
        for (let uk of uKeys) {
          let ouser = users[uk];

          if (user.db && user.db[ouser.uid]) {
            continue;
          }

          if (ouser.db && ouser.db[user.uid]) {
            continue;
          }
          newUsers[uk] = users[uk];
        }
        if (!Object.keys(newUsers).length) {
          alert(
            'No Matching users found. Please update your partner preferences.',
          );
        }
        this.setData(newUsers);
      } else {
        this.setState({loading: false}, () => {
          alert(
            'No Matching users found. Please update your partner preferences.',
          );
        });
      }
    });
  };

  loadMore = async () => {
    let {user} = this.props.context;
    if (this.state.onEndReachedCalledDuringMomentum) return null;
    this.setState({loadMore: true});

    let users = await this.pp.getUsers();
    if (users && Object.keys(users).length != 0) {
      let uKeys = Object.keys(users);
      let newUsers = {};
      for (let uk of uKeys) {
        let ouser = users[uk];
        if (user.db && user.db[ouser.uid]) {
          continue;
        }

        if (ouser.db && ouser.db[user.uid]) {
          continue;
        }
        newUsers[uk] = users[uk];
      }
      this.setData(newUsers);
    } else {
      Snackbar.show({
        title: 'You have reached to the end of the matched users list.',
        duration: Snackbar.LENGTH_SHORT,
      });
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

  refreshList = async () => {
    let {user} = this.props.context;
    this.setState({refreshing: true, data: {}}, async () => {
      this.pp = new PP(2, this.props.context.user || {});
      let users = await this.pp.getUsers();
      if (users && Object.keys(users).length != 0) {
        let uKeys = Object.keys(users);
        let newUsers = {};
        for (let uk of uKeys) {
          let ouser = users[uk];

          if (user.db && user.db[ouser.uid]) {
            continue;
          }

          if (ouser.db && ouser.db[user.uid]) {
            continue;
          }
          newUsers[uk] = users[uk];
        }
        this.setData(newUsers);
        if (!Object.keys(newUsers).length) {
          alert(
            'No Matching users found. Please update your partner preferences.',
          );
        }
      } else {
        this.setState({refreshing: false}, () => {
          alert(
            'No Matching users found. Please update your partner preferences.',
          );
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
            likeOther={this.likeOther(data[item])}
            navigateToMember={this.navigateToMember}
            fromPage={'My Matches'}
            {...this.props}
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
    let lf = this.props.context ? this.props.context.user.lf : null;
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
        <HeaderMain routeName="My Matches" {...this.props} />
        {this.renderCards()}
        {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
      </View>
    );
  }
}

const MyMatches = (props) => <MyMatchesJSX {...props} />;

export default MyMatches;
