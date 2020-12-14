import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import THEME from '../../config/theme';
import auth from '@react-native-firebase/auth';

import LinearGradient from 'react-native-linear-gradient';
import DateHelpers from '../../helpers/datehelpers';
import chat from '../../assets/chat/ic_chat.png';
import CustomBackAction from '../general/CustomBackAction';

class MessageBoard extends React.Component {
  componentDidMount() {
    this.uid = auth().currentUser.uid;
  }
  renderMessageItem = (messageData, item) => {
    if (!messageData.other_user) return null;

    let data = messageData.other_user;

    return (
      <TouchableOpacity
        style={style.messageItem}
        onPress={() => this.navigateToMessageScreen(messageData, item)}>
        <View style={style.topPart}>
          <Image
            source={{
              uri: data.dp,
            }}
            style={style.profile}
          />
          <Text style={{paddingHorizontal: 10, fontSize: 16}}>{data.sn}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: THEME.GRADIENT_BG.START_COLOR,
              marginLeft: 'auto',
              marginRight: 10,
            }}>
            <Text style={{paddingHorizontal: 10}}>Trust Score</Text>
            <LinearGradient
              colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
              style={{
                height: 30,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={{color: THEME.WHITE}}>{data.ts && data.ts.ts}%</Text>
            </LinearGradient>
          </View>
          {/* <Text>{this.getLastMessageDate(messageData.lm)}</Text> */}
        </View>

        <View style={style.bottomPart}>
          <Text style={{paddingLeft: 60, marginRight: 50}} numberOfLines={1}>
            {this.getLastMessage(messageData.lm)}
          </Text>
          <TouchableOpacity
            onPress={() => this.navigateToMessageScreen(messageData, item)}
            style={{marginLeft: 'auto'}}>
            <Image
              source={chat}
              style={{width: 30, height: 30, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  getLastMessage = (lm) => {
    if (this.uid == lm.sid) return `You : ${lm.mg}`;
    return lm.mg;
  };

  getLastMessageDate = (lm) => {
    return DateHelpers.getDateFromTimeStamp(lm.tp);
  };

  navigateToMessageScreen = (messageData, item) => {
    // return;
    // navigate to message screen
    this.props.navigation.navigate('Message', {
      data: {
        data: {otheruser: messageData.other_user},
        refKey: item,
        from: 'MessageBoard',
        member: messageData.other_user,
      },
      fromPage: this.props.fromPage,
    });
  };

  renderMessages = () => {
    let data = this.props.context ? this.props.context.conversation : null;

    if (!data) return null;
    data;

    return (
      <FlatList
        data={Object.keys(data)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => this.renderMessageItem(data[item], item)}
      />
    );
  };

  render() {
    return this.renderMessages();
  }
}

const style = StyleSheet.create({
  messageItem: {
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.BORDERCOLOR,
  },
  topPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 50,
  },
});

export default CustomBackAction(MessageBoard);
