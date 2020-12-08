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
  },
  {
    name: 'Messages',
    route: 'MessageBoard',
  },
  {
    name: 'Likes Sent',
    route: 'Likes Sent',
  },
  {
    name: 'Declined Profile',
    route: 'Declined Profile',
  },
  {
    name: 'Help',
    route: 'Help Screen',
  },
];
const EXPANDED_NAVS = ['Chat Requests', 'Likes'];

class SidebarJSX extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'Chat Requests': false,
      Likes: false,
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
          _navigateTo={this._navigateTo}
        />
      );
    });
  };

  render() {
    let rootNav = this.props.root.navigation;
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
            onPress={() => this._navigateTo('My Profile Screen')}>
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
      </ScrollView>
    );
  }
}

function DefaultItem(props) {
  let {text, route, _navigateTo, _setExpanded} = props;
  return (
    <View key={text} style={style.item}>
      <Image source={sidebar_icon[text]} style={style.image} />
      <TouchableOpacity
        onPress={() => _navigateTo(route)}
        style={{
          flex: 1,
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
      </TouchableOpacity>
    </View>
  );
}

function RenderExpanded(props) {
  let {text, route, context, pState, _navigateTo, _setExpanded} = props;
  let likesCount =
    context && context.user && context.user.lf && context.user.lf.c;

  let chatRequestCount =
    context && context.user && context.user.con && context.user.con.rc;

  let notification = text == 'Likes' ? likesCount : chatRequestCount;

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
            onPress={() => _navigateTo(route, {id: 'default'})}
            style={{
              marginRight: 'auto',
              height: 50,
              justifyContent: 'center',
              flex: 1,
            }}>
            <View style={style.notificationContainer}>
              <Text style={style.route}>{text}</Text>
              {notification ? (
                <Text style={style.notification}>{notification}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _setExpanded(text)}>
            <Image
              source={
                pState[text] ? sidebar_icon['collapse'] : sidebar_icon['expand']
              }
              style={style.image}
            />
          </TouchableOpacity>
        </View>
        {pState[text]
          ? EXPAND[text].item.map((data) => (
              <View style={{height: 30}} key={data}>
                <TouchableOpacity
                  onPress={() => _navigateTo(route, {id: data})}>
                  <Text
                    style={{
                      height: 30,
                      paddingLeft: 5,
                      lineHeight: 30,
                    }}>
                    {data}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
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
    width: 20,
    height: 20,
    borderRadius: 10,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },

  notificationContainer: {
    flexDirection: 'row',
  },
});

export default SidebarJSX;
