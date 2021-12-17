import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import Cards from '../cards/cards';
import THEME from '../../config/theme';
import {Loader} from '../modals';
import SettingsHeader from '../Headers/SettingsHeader';
import {STYLE} from "../commonStyle";
import DateHelpers from "../../helpers/datehelpers";
import moment from "moment";
import {UNBLOCK_BUTTON} from "../general/button";
import CardShimmer from '../cards/cardShimmer';

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
    this.setState({loading : true})
    let data = this.props.context.user;

    data = data && data.bt;

    if (!data) return null;

    let ref = database().ref('/Users');

    let keys = Object.keys(data).sort((a, b) => {
      return data[b] - data[a];
    });

    keys.map((item) => {
      ref
          // .child(item)
          // .once('value')
          // .then((snap) => {
          //   let data = {...this.state.data};
          //   data[snap.key] = snap.val();
          //   this.setState({data});
          // });
        .child(item)
        .once('value')
        .then((snap) => {
          this.setState({loading : false})
          let data = {...this.state.data};
          data[snap.key] = snap.val();
          this.setState({data});
        });
    });
  };

    renderUnblock = (id) => {
        return (
            <UNBLOCK_BUTTON
                text={'UNBLOCK'}
                style={{marginVertical: 5, width: 100,  borderWidth:3,
                    height: 48,
                    borderColor: THEME.GRADIENT_BG.END_COLOR}}
                // style={{alignSelf: 'center', marginBottom: 10}}
                _onPress={() => this.unblock(id)}
            />
        );
    };

  renderBlockedCards = () => {
    let data = this.state.data;
    if (Object.keys(data) == 0) return null;
    return (
        <FlatList
            data={Object.keys(this.state.data)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
                console.log('data item', data[item])
               return (
                    <TouchableOpacity disabled={true}>
                        <View style={STYLE.cardsContainer}>
                            <View style={STYLE.image_view}>
                                <Image
                                    source={{uri: data[item].dp}}
                                    style={STYLE.milk}
                                />
                                <View style={STYLE.margin_style}>
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={[STYLE.productname, {fontWeight: 'bold'}]}>
                                                {data[item]['sn']}
                                            </Text>
                                            <Text
                                                style={[STYLE.productname, {
                                                    width: '59%',
                                                    marginLeft: 5,
                                                    fontWeight: 'bold'
                                                }]}>
                                                {`${DateHelpers.getAge(data[item].dob)}`}
                                            </Text>
                                        </View>
                                        <View
                                            style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={STYLE.productname}>
                                                {data[item].ct}
                                            </Text>
                                            <Text style={[STYLE.productname, {marginLeft: 5}]}>
                                                {data[item].c}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginLeft: 'auto', width: 100}}>
                                    {this.renderUnblock(data[item].uid)}
                                    {/*{this.props.fromBlock ? this.renderUnblock() : null}*/}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    // <Cards
                    //     data={data[item]}
                    //     fromBlock={true}
                    //     hideButton={true}
                    //     navigateToMember={this.navigateToMember}
                    //     unblock={this.unblock}
                    //     {...this.props}
                    // />
                )
            }}
        />
    );
  };

  render() {
    return (
        // <View style={{flex: 1}}>
        //   <SettingsHeader title={'Blocked'} {...this.props} />
        //   <Text
        //       style={{color: THEME.PARAGRAPH, marginTop: 20, alignSelf: 'center'}}>
        //     You had blocked these users
        //   </Text>
        //   {this.renderBlockedCards()}
        //   {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
        // </View>
      <View style={{flex: 1}}>
        <SettingsHeader title={'Blocked'} {...this.props} />
        {this.state.loading ? <CardShimmer blocked = {true} /> :
        <>
        <Text
          style={{color: THEME.PARAGRAPH, marginTop: 20, alignSelf: 'center'}}>
          You had blocked these users
        </Text>
        {this.renderBlockedCards()}
        </>
        }
      </View>
    );
  }
}

const BlockedUser = (props) => <BlockedUsersJSX {...props} />;

export default BlockedUser;
