import React from 'react';
import {View, Text, FlatList} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import Cards from '../cards/cards';
import THEME from '../../config/theme';
import {Loader} from '../modals';
import SettingsHeader from '../Headers/SettingsHeader';

class BlockedUsersJSX extends React.Component {
  state = {
    data: {},
    loading: false,
  };

  componentDidMount() {
    this.getData();
  }

  unblock = async (id) => {
    this.setState({loading: true});
    let uid = auth().currentUser && auth().currentUser.uid;

    await database().ref('/Users').child(uid).child('bt').child(id).set(null);

    await database().ref('/Users').child(id).child('bb').child(uid).set(null);

    let data = {...this.state.data};
    delete data[id];
    this.setState({data, loading: false});
  };
  getData = () => {
    let data = this.props.context.user && this.props.context.user;

    data = data && data.bt;

    if (!data) return null;

    let ref = database().ref('/Users');

    Object.keys(data).map((item) => {
      ref
        .child(item)
        .once('value')
        .then((snap) => {
          let data = {...this.state.data};
          data[snap.key] = snap.val();
          this.setState({data});
        });
    });
  };

  renderBlockedCards = () => {
    let data = this.state.data;
    if (Object.keys(data) == 0) return null;
    return (
      <FlatList
        data={Object.keys(this.state.data)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Cards
            data={data[item]}
            fromBlock={true}
            hideButton={true}
            navigateToMember={this.navigateToMember}
            unblock={this.unblock}
          />
        )}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SettingsHeader title={'Blocked'} {...this.props} />
        <Text
          style={{color: THEME.PARAGRAPH, marginTop: 20, alignSelf: 'center'}}>
          You had blocked these users
        </Text>
        {this.renderBlockedCards()}
        {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
      </View>
    );
  }
}

const BlockedUser = (props) => <BlockedUsersJSX {...props} />;

export default BlockedUser;
