import React from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import Loader from '../modals/loaders';
import CardShimmer from '../cards/cardShimmer';

class LikeSent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: true,
    };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this.props.context.getUserLikeData();
          this.props.context.childRemoved();
          this.setState({focused: true});
          console.log('likesSent.js return!');
        }
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

  renderCards = () => {
    let data = this.props.context.sent;
    let {user} = this.props.appContext;
    if (!data) return;
    let sortedKeys = Object.keys(data).sort(
      (a, b) => user.lt[data[b].uid].tp - user.lt[data[a].uid].tp,
    );
    return (
      <FlatList
        data={sortedKeys}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromLike={true}
            sent={true}
            dateToShow={moment(
              new Date(user.lt[data[item].uid].tp * 1000),
            ).calendar()}
            likesMe={this.LikesMe(data[item])}
            likeOther={true}
            fromPage={'Like Sent'}
            {...this.props}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  LikesMe = (data) => {
    let lf = this.props.context.lf;
    if (lf && data) {
      return Object.keys(lf).includes(data.uid);
    }

    return false;
  };

  render() {
    let {focused} = this.state;
    let loading = this.props.context.loadingT;
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Like Sent" {...this.props} />

        {loading && focused ? <CardShimmer /> : this.renderCards()}
      </View>
    );
  }
}

export default LikeSent;
