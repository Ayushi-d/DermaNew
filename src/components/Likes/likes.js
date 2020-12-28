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

class Likes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      scrollPosition: [0, 0],
      focused: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let id = props.route.params.id;
    if (id == 'Regular' || id == 'default') {
      this.setState({tab: 0}, () => {
        this.flatListref &&
          this.flatListref.scrollToOffset({
            offset: this.state.scrollPosition[0],
            animated: false,
          });
      });
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1}, () => {
        this.flatListref &&
          this.flatListref.scrollToOffset({
            offset: this.state.scrollPosition[1],
            animated: false,
          });
      });
    }
  }

  componentDidMount() {
    let id = this.props.route.params.id;
    if (id == 'Regular' || id == 'default') {
      this.setState({tab: 0});
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1});
    }

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this.setState({focused: true});

          this.props.context.getUserLikeData();
          this.props.context.childRemoved();
          console.log('likes.js return!');
        }
        this._changeCount();
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
        this.setState({tab: 0}, () => {
          this.flatListref &&
            this.flatListref.scrollToOffset({
              offset: this.state.scrollPosition[0],
              animated: false,
            });
        });
      }

      if (id == 'Filtered Out') {
        this.setState({tab: 1}, () => {
          this.flatListref &&
            this.flatListref.scrollToOffset({
              offset: this.state.scrollPosition[1],
              animated: false,
            });
        });
      }
    }
  }

  _getLikes = () => {
    let {user} = this.props.context;
    let likesRef = database().ref(`Users/`);
  };
  _getLikesRemoved = () => {};

  _changeCount() {
    // update like notifications
    let uid = auth().currentUser.uid;
    database().ref(`Users/${uid}`).child('lf').child('c').set(0);
  }

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      setTimeout(
        () =>
          this.flatListref &&
          this.flatListref.scrollToOffset({
            offset: this.state.scrollPosition[tabValue],
            animated: false,
          }),
        1,
      );

      this.props.navigation.setParams({
        id: this.state.tab == 0 ? 'Regular' : 'Filtered Out',
      });
    });
  };

  handleScroll = (event) => {
    let scrollPosition = [...this.state.scrollPosition];
    let tab = this.state.tab;
    scrollPosition[tab] = event.nativeEvent.contentOffset.y;
    this.setState({scrollPosition});
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

  renderCards = () => {
    let data =
      this.state.tab == 0
        ? this.props.context.regular
        : this.props.context.filteredOut;

    // sort by like recieved time

    if (!data) return;
    let sortedKeys = Object.keys(data).sort(
      (a, b) =>
        data[b].lt[auth().currentUser.uid] - data[a].lt[auth().currentUser.uid],
    );

    if (data) {
      return (
        <FlatList
          ref={(ref) => (this.flatListref = ref)}
          data={sortedKeys}
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
                  new Date(data[item].lt[auth().currentUser.uid] * 1000),
                ).calendar()}
                fromPage={'Likes'}
                {...this.props}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          style={{flexGrow: 1}}
          onScroll={this.handleScroll}
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

  render() {
    let {focused} = this.state;
    let loading = this.props.context.loadingF;
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Likes Received" {...this.props} />

        {this.renderTab()}
        {this.renderCards()}
        {loading && focused ? <Loader isVisible={loading} /> : null}
      </View>
    );
  }
}

export default Likes;
