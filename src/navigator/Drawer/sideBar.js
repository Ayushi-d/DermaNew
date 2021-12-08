import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import sidebar_icon from '../../assets/sidebar';
import auth from '@react-native-firebase/auth';

const EXPAND = {
  'Chat Requests': {
    item: ['Regular', 'Filtered Out'],
  },
  Likes: {
    item: ['Regular', 'Filtered Out'],
  },
};
const routes = [
  {
    name: 'My Matches',
    route: 'My Matches',
    params: {
      from: 'ref',
    },
  },
  {
    name: 'Search',
    route: 'Search',
  },
  {
    name: 'Likes',
    route: 'Likes',
  },
  {
    name: 'Chat Requests',
    route: 'Chat Request',
    params: {
      tab: 'Regular',
      from: 'ref',
    },
  },
  {
    name: 'Messages',
    route: 'MessageBoard',
    params: {
      from: 'ref',
    },
  },
  {
    name: 'Likes Sent',
    route: 'Likes Sent',
    params: {
      from: 'ref',
    },
  },
  {
    name: 'Declined Profile',
    route: 'Declined Profile',
    params: {
      from: 'ref',
    },
  },
  // {
  //   name: 'Help',
  //   route: 'Help',
  // },
];
const EXPANDED_NAVS = ['Chat Requests', 'Likes'];

class SidebarJSX extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'Chat Requests': true,
      Likes: true,
    };
  }

  _setExpanded = (item) => {
    let exp = this.state[item];
    this.setState({[item]: !exp});
    // console.log('tap');
  };

  _navigateTo = (screen, data) => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(screen, data);
  };

  renderDrawerItems = () => {
    return routes.map((item, index) => {
      if (EXPANDED_NAVS.includes(item.name))
        return (
          <RenderExpanded
            text={item.name}
            key={index}
            route={item.route}
            pState={this.state}
            _navigateTo={this._navigateTo}
            _setExpanded={this._setExpanded}
            {...this.props}
          />
        );
      return (
        <DefaultItem
          text={item.name}
          key={index}
          route={item.route}
          params={item.params}
          _navigateTo={this._navigateTo}
          context={this.props.context}
        />
      );
    });
  };

  render() {
    let rootNav = this.props.root.navigation;
    let {user} = this.props.context;

    return (
      <ScrollView>
        <LinearGradient
          colors={[...THEME.GRADIENT_BG.PAIR]}
          style={style.topbar}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          <TouchableOpacity onPress={() => this._navigateTo('Manage Photos')}>
            <Image
              style={style.profilePic}
              source={{
                uri: this.props.context.user
                  ? this.props.context.user.ndp
                  : null,
              }}
            />
          </TouchableOpacity>
          <Text
            style={style.name}
            onPress={() => rootNav.navigate('My Profile', {id: 0})}>
            {this.props.context.user ? this.props.context.user.nm : 'Default'}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 'auto'}}
            onPress={() => this._navigateTo('Settings')}>
            <Image
              style={style.settings}
              source={require('../../assets/general/ic_setting.png')}
            />
          </TouchableOpacity>
        </LinearGradient>
        <View style={style.trustScore}>
          <TouchableOpacity onPress={() => this._navigateTo('Trust Score')}>
            <LinearGradient
              colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: THEME.WHITE,
                }}>{`TRUST SCORE ${
                this.props.context.user ? this.props.context.user.ts.ts : ''
              }%`}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View
          style={{flex: 1, marginTop: 20, marginHorizontal: 20}}
          forceInset={{top: 'always', horizontal: 'never'}}>
          {this.renderDrawerItems()}
        </View>

        <TouchableOpacity
          style={style.memberBtn}
          onPress={() => rootNav.navigate('Membership')}>
          <Text style={style.memberBtnTxt}>MEMBERSHIP</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

function DefaultItem(props) {
  let {text, context, route, params, _navigateTo, _setExpanded} = props;

  let msgsCount = 0;

  if (text === 'Messages') {
    let cons = context.user.con;
    if (cons) {
      let con = Object.keys(context.user.con);
      con.forEach((c) => {
        if (cons[c].sn) {
          if (cons[c].uc) {
            msgsCount += 1;
          }
        }
      });
    }
  }

  return (
    <View key={text} style={style.item}>
      <Image source={sidebar_icon[text]} style={style.image} />
      <TouchableOpacity
        onPress={() => _navigateTo(route, params)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: THEME.BORDERCOLOR,
          borderBottomWidth: 2,
        }}>
        <Text
          style={[
            style.route,
            {
              flex: 1,
              height: 50,
              lineHeight: 50,
            },
          ]}>
          {text}
        </Text>
        {msgsCount ? (
          <Text style={style.notification}>
            {msgsCount >= 100 ? '99+' : msgsCount}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

function RenderExpanded(props) {
  let {text, route, context, pState, _navigateTo, _setExpanded} = props;
  let likesCount = 0;
  let likesRegCount = 0;
  let likesFilCount = 0;
  if (context && context.user && context.user.lf && context.user.lf.c) {
    let lf = context.user.lf;
    likesCount = lf.c;

    Object.keys(lf).forEach((lk) => {
      if (lk !== 'c') {
        if (lf[lk].pref) {
          if (!lf[lk].sn) {
            likesFilCount += 1;
          }
        } else {
          if (!lf[lk].sn) {
            likesRegCount += 1;
          }
        }
      }
    });
  }

  let chatRequestCount = 0;
  let chatReqRegCount = 0;
  let chatReqFilCount = 0;
  let msgsCount = 0;

  let cons = context.user.con;
  if (cons) {
    let con = Object.keys(context.user.con);
    con.forEach((c) => {
      if (!cons[c].sn && cons[c].isAcc !== -1) {
        chatRequestCount += 1;
        if (cons[c].pref) {
          chatReqFilCount += 1;
        } else {
          chatReqRegCount += 1;
        }
      } else {
        if (cons[c].uc && cons[c].isAcc !== -1) {
          msgsCount += 1;
        }
      }
    });
  }

  return (
    <View key={text} style={[style.item, {alignItems: 'flex-start'}]}>
      <Image
        source={sidebar_icon[text]}
        style={[style.image, {marginTop: 15}]}
      />
      <View
        style={{
          flex: 1,
          borderBottomColor: THEME.BORDERCOLOR,
          borderBottomWidth: 2,
        }}>
        <View style={style.itemContainer}>
          <TouchableOpacity
            onPress={() =>
              _navigateTo(route, {id: 'default', tab: 'Regular', from: 'ref'})
            }
            style={{
              marginRight: 'auto',
              height: 50,
              justifyContent: 'center',
              flex: 1,
            }}>
            <View style={style.notificationContainer}>
              <Text style={style.route}>{text}</Text>
              {/* {notification ? (
                <Text style={style.notification}>{notification}</Text>
              ) : null} */}
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => _setExpanded(text)}>
            <Image
              source={
                pState[text] ? sidebar_icon['collapse'] : sidebar_icon['expand']
              }
              style={style.image}
            />
          </TouchableOpacity> */}
        </View>
        {pState[text]
          ? EXPAND[text].item.map((data) => {
              let cNoti = 0;

              if (text === 'Chat Requests') {
                if (data === 'Regular') {
                  cNoti = chatReqRegCount;
                } else {
                  cNoti = chatReqFilCount;
                }
              }

              if (text === 'Likes') {
                if (data === 'Regular') {
                  cNoti = likesRegCount;
                } else {
                  cNoti = likesFilCount;
                }
              }

              return (
                <View style={{height: 30}} key={data}>
                  <TouchableOpacity
                    onPress={() =>
                      _navigateTo(route, {id: data, tab: data, from: 'ref'})
                    }
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        flex: 1,
                        height: 30,
                        paddingLeft: 5,
                        lineHeight: 30,
                      }}>
                      {data}
                    </Text>
                    {cNoti ? (
                      <Text style={style.notification}>
                        {cNoti >= 100 ? '99+' : cNoti}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
  // }
}
// const SideBar = (props) => (
//   <SidebarJSX context={props.root.context} {...props} />
// );

const style = StyleSheet.create({
  topbar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  settings: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  name: {
    marginLeft: 20,
    color: THEME.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  trustScore: {
    padding: 20,
    borderBottomWidth: 2,
    borderColor: THEME.BORDERCOLOR,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 50,
  },

  image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },

  route: {
    color: THEME.PARAGRAPH,
    marginRight: 'auto',
  },

  notification: {
    color: THEME.WHITE,
    backgroundColor: THEME.GRADIENT_BG.END_COLOR,
    width: 30,
    height: 22,
    borderRadius: 15,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },

  notificationContainer: {
    flexDirection: 'row',
  },
  memberBtn: {
    backgroundColor: THEME.GRADIENT_BG.END_COLOR,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  memberBtnTxt: {
    color: '#fff',
  },
});

export default SidebarJSX;
