import React from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';

class LikeSent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this.props.context.getUserLikeData();
          this.props.context.childRemoved();
          console.log('likesSent.js return!');
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

  renderCards = () => {
    let data = this.props.context.sent;
    if (!data) return;
    let sortedKeys = Object.keys(data).sort(
      (a, b) =>
        data[b].lf[auth().currentUser.uid] - data[a].lf[auth().currentUser.uid],
    );
    return (
      <FlatList
        data={sortedKeys}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromLike={true}
            sent={true}
            dateToShow={DateHelpers.getDateFromTimeStamp(
              data[item].lf[auth().currentUser.uid],
            )}
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
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Like Sent" {...this.props} />

        {this.renderCards()}
      </View>
    );
  }
}

export default LikeSent;
