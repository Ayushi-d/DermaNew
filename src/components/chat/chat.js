import React from 'react';
import {View, FlatList} from 'react-native';
import {BUTTON_WITH_PARAM} from '../general/button';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import Header from '../Headers/SettingsHeader';
import moment from 'moment';

moment.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: 'LT',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd',
    sameElse: 'L',
  },
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    l: 'D/M/YYYY',
    LL: 'Do MMMM YYYY',
    ll: 'D MMM',
    LLL: 'Do MMMM YYYY LT',
    lll: 'D MMM YYYY LT',
    LLLL: 'dddd, MMMM Do YYYY LT',
    llll: 'ddd, MMM D YYYY LT',
  },
});

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let id = props.route.params.i;
    if (id == 'Regular' || id == 'default') {
      this.setState({tab: 0});
    }

    if (id == 'Filtered Out') {
      this.setState({tab: 1});
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
  }

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      this.props.navigation.setParams({
        id: this.state.tab == 0 ? 'Regular' : 'Filtered Out',
      });
    });
  };

  navigateToMessageScreen = (data, item) => {
    this.props.navigation.navigate('Message', {data: data, key: item});
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

  LikesMe = (data) => {

    let other_user = data.user_data;
    let lf =
      this.props.appContext.user_data && this.props.appContext.user_data.lf;
    if (lf && data) {
      return Object.keys(lf).includes(other_user.uid);
    }

    return false;
  };

  renderChatReqCards = () => {
    let {user} = this.props.appContext;
    let likes = Object.keys(user.lf);

    let data =
      this.state.tab == 0
        ? this.props.context.regular
        : this.props.context.filteredOut;

    if (!data) return null;

    if (Object.keys(data).length == 0) return null;
    console.log('chat req', Object.keys(data))

    return (
      <FlatList
        data={Object.keys(data)}
        extraData={Object.keys(data)}
        renderItem={({item}) => {
          let likesMe = likes.indexOf(data[item].user_data.uid);
          if (likesMe > -1) {
            likesMe = true;
          } else {
            likesMe = false;
          }

          return (
            <Cards
              data={data[item].user_data}
              hideButton={true}
              sent={this.state.tab == 1}
              message={data[item].lm.mg}
              fromChat={true}
              navigation={this.props.navigation}
              likesMe={likesMe}
              dateToShow={moment(new Date(data[item].lm.tp * 1000)).calendar()}
              messageRefKey={data[item].keyRef}
              fromPage={'Chat Request'}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header title={'Chat Requests'} {...this.props} />
        {this.renderTab()}
        {this.renderChatReqCards()}
      </View>
    );
  }
}

export default Chat;
