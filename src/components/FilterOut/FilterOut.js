import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';
import {BUTTON_WITH_PARAM} from '../general/button';
import Cards from '../cards/cards';

/**
 *  data format of props
 *
 * 	--context
 * 		--likeData
 * 		--messageReq
 * 		--user_data -> current user data
 */

class FilterOut extends React.Component {
  state = {
    tab: 0,
  };

  UNSAFE_componentWillReceiveProps(props) {
    let id = props.route.params.id;
    if (id == 'Likes') {
      this.setState({tab: 0});
    }

    if (id == 'Chat Request') {
      this.setState({tab: 1});
    }
  }

  componentDidMount() {
    let id = this.props.route.params.id;
    if (id == 'Likes') {
      this.setState({tab: 0});
    }

    if (id == 'Chat Request') {
      this.setState({tab: 1});
    }
  }

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue}, () => {
      this.props.navigation.setParams({
        id: this.state.tab == 0 ? 'Likes' : 'Chat Request',
      });
    });
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
          text={'LIKES'}
          style={{width: '40%'}}
          checked={this.state.tab == 0}
          _onPress={this._onTabPress}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'CHAT REQUEST'}
          checked={!(this.state.tab == 0)}
          _onPress={this._onTabPress}
          pressParam={1}
        />
      </View>
    );
  };

  renderCards = () => {
    let data = this.props.context.likeData;
    if (data) {
      return (
        <FlatList
          data={Object.keys(data)}
          renderItem={({item}) => (
            <Cards
              data={data[item]}
              fromLike={true}
              sent={this.state.tab == 1}
              likesMe={this.LikesMe(data[item])}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{flexGrow: 1}}
        />
      );
    } else {
      return null;
    }
  };

  LikesMe = (data) => {
    let lt = this.props.context && this.props.context.user.lt;
    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
    }

    return false;
  };

  renderChatReqCards = () => {
    let data = this.props.context && this.props.context.messageReq;

    if (!data) return null;

    if (Object.keys(data).length == 0) return null;

    return (
      <FlatList
        data={Object.keys(data)}
        renderItem={({item}) => (
          <Cards
            data={data[item].user_data}
            hideButton={true}
            sent={this.state.tab == 1}
            message={data[item].message}
            fromChat={true}
            navigation={this.props.navigation}
            likesMe={this.LikesMe(data[item])}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderMain routeName="Filter Out" {...this.props} />
        {this.renderTab()}
        {this.state.tab == 0 ? this.renderCards() : this.renderChatReqCards()}
      </View>
    );
  }
}

export default FilterOut;
