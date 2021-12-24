import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {HeaderMain} from '../general/Header';
import Cards from '../cards/cards';
import DateHelpers from '../../helpers/datehelpers';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import Loader from '../modals/loaders';
import THEME from "../../config/theme";
import {STYLE} from "../commonStyle";
import ChatShimmer from '../chat/ChatShimmer';
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

  navigateToMember = (data) => {
    console.log('call new data')
    this.props.navigation.navigate('Member Profile', {
      ...data,
      fromPage: 'Like Sent',
      fromPageHistory: 'Like Sent',
      hideMessage: false,
    });
  };


  renderCards = () => {
    let data = this.props.context.sent;
    let {user} = this.props.appContext;
    if (!data) return;
    let sortedKeys = Object.keys(data).sort(
        (a, b) =>
            user.lt[data[b].uid].tp - user.lt[data[a].uid].tp,
      (a, b) => user.lt[data[b].uid].tp - user.lt[data[a].uid].tp,
    );
    return (
        <FlatList
            data={sortedKeys}
            renderItem={({item}) => {
              let likeData = data[item]
              console.log('like data is', likeData)
              return (
                  <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Member Profile', {
                          data: likeData,
                          fromPage: 'Like Sent',
                          fromPageHistory: 'Like Sent',
                          hideMessage: false,
                          likesMe: this.LikesMe(likeData)
                        })
                      }}>
                    <View style={STYLE.cardsContainer}>
                      <View style={STYLE.image_view}>
                        <Image
                            source={{uri: likeData.dp}}
                            style={STYLE.milk}
                        />
                        <View style={STYLE.margin_style}>
                          <View>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={[STYLE.productname, {fontWeight: 'bold'}]}>
                                {likeData['sn']}
                              </Text>
                              <Text
                                  style={[STYLE.productname, {width: '59%', marginLeft: 5, fontWeight:'bold'}]}>
                                {`${DateHelpers.getAge(likeData.dob)}`}
                              </Text>
                            </View>
                            <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                              <Text style={STYLE.productname}>
                                {likeData.ct}
                              </Text>
                              <Text style={[STYLE.productname, {marginLeft: 5}]}>
                                {likeData.c}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{marginLeft: 'auto', marginBottom: 30, width: 100}}>
                          {likeData.uid &&
                          <Text style={STYLE.productname}>
                            {moment(new Date(user.lt[likeData.uid].tp * 1000),).calendar()}
                          </Text>
                          }
                          {this.props.fromBlock ? this.renderUnblock() : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  // <Cards
                  //   data={data[item]}
                  //   fromLike={true}
                  //   sent={true}
                  //   dateToShow={moment(
                  //     new Date(user.lt[data[item].uid].tp * 1000),
                  //   ).calendar()}
                  //   likesMe={this.LikesMe(data[item])}
                  //   likeOther={true}
                  //   fromPage={'Like Sent'}
                  //   {...this.props}
                  // />
              )}}
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
          {loading && focused ? <ChatShimmer /> : this.renderCards()}
        </View>
    );
  }
}

export default LikeSent;
