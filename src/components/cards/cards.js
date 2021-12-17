import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PhotoSwiper from './photoSwiper';
import THEME from '../../config/theme';
import DateHelpers from '../../helpers/datehelpers';
import like from '../../assets/cards/ic_like.png';
import liked from '../../assets/cards/ic_liked.png';
import message from '../../assets/cards/ic_message.png';
import Like from '../../helpers/like';
import {MessageBox} from '../modals';
import DEFAULT_BUTTON, {
  BUTTON_WITH_PARAM,
  UNBLOCK_BUTTON,
} from '../general/button';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {ShimmerLoader} from '../ShimmerLoader/ShimmerLoader';

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageModal: false,
      likedMe: this.props.likeOther || false,
    };
  }

  componentDidMount() {}

  onPressLike = () => {
    let likesMe = this.state.likedMe;

    if (likesMe) {
      Like.unlike(this.props.data.uid);
    } else {
      Like.like(this.props.data.uid);
    }

    this.setState({likedMe: !likesMe});
  };

  UNSAFE_componentWillReceiveProps(props) {
    // this.setState({likedMe: props.likeOther});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.likeOther !== this.props.likeOther) {
      this.setState({likedMe: this.props.likeOther});
    }
  }

  showMessageModal = () => {
    // redirect to message screen for messaging

    let oUID = this.props.data && this.props.data.uid;
    let cUID = auth().currentUser.uid;

    let data = {
      otheruser: {...this.props.data},
    };

    this.props.navigation.navigate('Message', {
      data: {
        ...data,
        refKey: cUID < oUID ? cUID + oUID : oUID + cUID,
        from: '',
        member: this.props.data,
      },
      fromPage: this.props.fromPage,
    });
  };

  renderAbout = () => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width * 0.8,
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[style.text, style.name]}>{this.props.data['sn']}</Text>
          <Text style={[style.text]}>
            {`${DateHelpers.getAge(this.props.data.dob)}`}
          </Text>
        </View>
        <Text style={[style.text]}>
          {`${this.props.data.sc}   ${this.props.data.ms}   ${this.props.data.rl}`}
        </Text>
        <Text style={[style.text]}>
          {`${this.props.data.ct}   ${this.props.data.c}`}
        </Text>
      </View>
    );
  };

  renderLikeAndMessage = () => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width * 0.7,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={style.buttonLike}
          onPress={this.onPressLike}
          disabled={this.state.likedMe}>
          <Image
            source={this.state.likedMe ? liked : like}
            style={style.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.buttonLike}
          onPress={this.showMessageModal}>
          <Image source={message} style={style.image} />
        </TouchableOpacity>
      </View>
    );
  };

  renderUnblock = () => {
    return (
      <UNBLOCK_BUTTON
        text={'UNBLOCK'}
        style={{marginBottom: 10, width: 100}}
        // style={{alignSelf: 'center', marginBottom: 10}}
        _onPress={() => this.props.unblock(this.props.data.uid)}
      />
    );
  };

  renderMessage = () => {
    return (
      <View>
        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: '90%',
            alignSelf: 'center',
            marginBottom: 10,
            paddingVertical: 10,
            borderColor: THEME.WHITE,
          }}>
          <Text
            style={{color: THEME.WHITE, fontStyle: 'italic'}}
            onPress={this.replyToMessage}
            numberOfLines={2}
            ellipsizeMode={'tail'}>{`Message - ${this.props.message}`}</Text>
        </View>

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: 15,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {!this.props.declinedRef ? (
            <TouchableOpacity
              style={[style.button, style.reply]}
              onPress={this.replyToMessage}>
              <Text
                style={{
                  color: THEME.GRADIENT_BG.END_COLOR,
                  fontWeight: 'bold',
                }}>
                REPLY
              </Text>
            </TouchableOpacity>
          ) : null}

          {!this.props.fromDeclined ? (
            <TouchableOpacity
              style={[style.button, style.decline]}
              onPress={() =>
                this.props._declineChat(
                  this.props.messageRefKey,
                  this.props.data,
                )
              }>
              <Text style={{color: THEME.WHITE, fontWeight: 'bold'}}>
                DECLINE
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  replyToMessage = () => {
    let oUID = this.props.data && this.props.data.uid;
    let cUID = auth().currentUser.uid;

    let data = {
      otheruser: {...this.props.data},
    };
    if (this.props.declinedRef) {
      return;
    }

    this.props.navigation.navigate('Message', {
      data: {
        ...data,
        refKey: cUID < oUID ? cUID + oUID : oUID + cUID,
        from: '',
        member: this.props.data,
      },
      fromPage: this.props.fromPage,
    });
  };

  declineMessage = async () => {
    // delete uid from
    let current_uid = auth().currentUser.uid;

    let ouid = this.props.data.uid;
    let onid = this.props.data.nid;

    // delete from rf node of current user

    await database()
      .ref('/dermaAndroid/users')
      .child(current_uid)
      .child('rf')
      .child(onid.toString())
      .set(null);

    // move the data to dt node of current user

    await database()
      .ref('/dermaAndroid/users')
      .child(current_uid)
      .child('dt')
      .child(onid.toString())
      .set(ouid);

    // add data to the db node of other user
    await database()
      .ref('/dermaAndroid/users')
      .child(ouid)
      .child('db')
      .child(current_uid)
      .set(1);
  };

  navigateToMember = (data) => {
      console.log('call new data')
    if (!this.props.navigation) {
      return null;
    }
    if (this.props.declinedRef) {
      return;
    }
    this.props.navigation.navigate('Member Profile', {
      ...data,
      fromPage: this.props.fromPage,
      fromPageHistory: this.props.fromPage,
      hideMessage: false,
    });
  };



  render() {
    return this.props.data ? (
        <TouchableNativeFeedback
            onPress={() =>
                this.navigateToMember({
                    data: this.props.data,
                    likesMe: this.props.likesMe,
                    fromPage: this.props.fromPage,
                })
            }
        >
            <View style={style.cardsContainer}>
                <PhotoSwiper
                    data={this.props.data}
                    hideBottomRight={this.props.fromLike || this.props.hideButton}
                    hideTopLeft={this.props.hideTrust}
                    hideTopRight={this.props.hideDOB}
                    dateToShow={this.props.dateToShow || null}
                    hideBottomLeft={this.props.hideLike || this.props.fromBlock}
                    likesMe={this.props.likesMe}
                    _navigateToMember={() =>
                        this.navigateToMember({
                            data: this.props.data,
                            likesMe: this.props.likesMe,
                        })
                    }
                    fromMember={this.props.fromMember}
                />
                {this.renderAbout()}
                {this.props.fromLike ? this.renderLikeAndMessage() : null}
                {this.props.fromBlock ? this.renderUnblock() : null}
                {this.props.fromChat || this.props.fromDeclined
                    ? this.renderMessage()
                    : null}
                <CardBG />
            </View>
        </TouchableNativeFeedback>
    ) : null;
  }
}

const CardBG = () => (
  <LinearGradient
    colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '60%',
      zIndex: -2,
      borderRadius: 3,
    }}
  />
);

const style = StyleSheet.create({
  cardsContainer: {
    // flex:1,
    width: '90%',
    alignSelf: 'center',
      marginTop: 5,
      borderBottomWidth: 1,
  },
  text: {
    color: THEME.WHITE,
    fontSize: 14,
    padding: 5,
  },
  name: {
    fontSize: 16,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonLike: {
    backgroundColor: THEME.WHITE,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },

  reply: {
    backgroundColor: THEME.WHITE,
  },

  decline: {
    borderWidth: 1,
    borderColor: THEME.WHITE,
  },
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
    border: {
        borderBottomWidth: 1,
        borderColor: 'red',
    },
    milk: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    productname: {
        fontSize: 14,
        color: 'black',
    },
    margin_style: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    image_view: {
        marginTop: 10, flexDirection: 'row', alignItems:'center'
    }
});

export default Cards;
