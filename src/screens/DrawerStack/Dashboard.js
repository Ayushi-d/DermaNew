import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DHeader from '../../components/Headers/DrawerStackHeader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MCi from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import THEME from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

export default class DrawerStackHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let {root} = this.props;
    let user = root.context.user;

    return (
      <View style={{...styles.container}}>
        <DHeader title={'DASHBOARD'} {...this.props} />

        <ScrollView style={{...styles.container}}>
          {/* top */}

          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 0.5,
              borderColor: '#d4d4d4',
            }}>
            <View
              style={{
                ...styles.col,
                borderRightWidth: 0.5,
              }}>
              <LinearGradient
                colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                style={{
                  ...styles.colIconCon,
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <FontAwesome5 name={'user'} color={'#fff'} size={24} />
              </LinearGradient>

              <Text style={styles.colTxt}>Profile</Text>
            </View>

            <View
              style={{
                ...styles.col,
                borderRightWidth: 0.5,
              }}>
              <LinearGradient
                colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                style={{
                  ...styles.colIconCon,
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <FontAwesome name={'photo'} color={'#fff'} size={24} />
              </LinearGradient>

              <Text style={styles.colTxt}>Photos</Text>
            </View>

            <View
              style={{
                ...styles.col,
              }}>
              <LinearGradient
                colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                style={{
                  ...styles.colIconCon,
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <FontAwesome5 name={'users'} color={'#fff'} size={24} />
              </LinearGradient>

              <Text style={styles.colTxt}>Partner Preference</Text>
            </View>
          </View>

          {/* top */}
          {/* trustCon */}
          <View style={styles.trustCon}>
            <View style={styles.trustConIn}>
              <View style={styles.col}>
                <AnimatedCircularProgress
                  size={100}
                  width={8}
                  fill={user.ts.ts}
                  tintColor={THEME.ACTIVE_COLOR}
                  backgroundColor="#d4d4d4">
                  {(fill) => (
                    <LinearGradient
                      colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                      style={{
                        ...styles.colIconCon,
                      }}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}>
                      <FontAwesome5 name={'user'} color={'#fff'} size={24} />
                    </LinearGradient>
                  )}
                </AnimatedCircularProgress>
              </View>
              <View style={{...styles.col, justifyContent: 'center'}}>
                <MCi name={'shield-check'} color={'#228B22'} size={25} />
                <Text>Trust Score</Text>
                <Text style={{color: THEME.ACTIVE_COLOR, fontSize: 21}}>
                  {user.ts.ts}%
                </Text>
              </View>
            </View>
            <Text
              style={{
                textAlign: 'center',
                paddingBottom: 7,
                borderBottomWidth: 0.5,
                borderBottomColor: '#d4d4d4',
              }}>
              Trust score determines your profile credibility
            </Text>

            {/* Add to trust Nav */}
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  ...styles.trustCol,
                }}>
                <View
                  style={{
                    ...styles.trustcolIconCon,
                  }}>
                  <Feather name={'camera'} color={'#000'} size={22} />
                </View>

                <Text style={styles.trustColTxt}>Add Photo 20%</Text>
              </View>

              <View
                style={{
                  ...styles.trustCol,
                }}>
                <View
                  style={{
                    ...styles.trustcolIconCon,
                  }}>
                  <MCi name={'email-check-outline'} color={'#000'} size={22} />
                </View>

                <Text style={styles.trustColTxt}>Verify Email 20%</Text>
              </View>

              <View
                style={{
                  ...styles.trustCol,
                }}>
                <View
                  style={{
                    ...styles.trustcolIconCon,
                  }}>
                  <FontAwesome
                    name={'facebook-square'}
                    color={'#000'}
                    size={22}
                  />
                </View>

                <Text style={styles.trustColTxt}>Link Facebook 20%</Text>
              </View>

              <View
                style={{
                  ...styles.trustCol,
                }}>
                <View
                  style={{
                    ...styles.trustcolIconCon,
                  }}>
                  <FontAwesome5 name={'user'} color={'#000'} size={22} />
                </View>

                <Text style={styles.trustColTxt}>Verify Photo ID 20%</Text>
              </View>
            </View>
            {/* Add to trust Nav */}
          </View>
          {/* trustCon */}

          {/* bottom */}
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 0.5,
              borderColor: '#d4d4d4',
            }}>
            <View
              style={{
                ...styles.col,
                borderRightWidth: 0.5,
              }}>
              <View
                style={{
                  ...styles.colIconCon,
                }}>
                <Ionicons name={'heart-outline'} color={'#888'} size={40} />
              </View>

              <Text style={styles.colTxt}>Likes</Text>
            </View>

            <View
              style={{
                ...styles.col,
                borderRightWidth: 0.5,
              }}>
              <View
                style={{
                  ...styles.colIconCon,
                }}>
                <Ionicons name={'chatbox-outline'} color={'#888'} size={40} />
              </View>

              <Text style={styles.colTxt}>Messages</Text>
            </View>

            <View
              style={{
                ...styles.col,
                borderRightWidth: 0.5,
              }}>
              <View
                style={{
                  ...styles.colIconCon,
                }}>
                <Ionicons
                  name={'ios-chatbox-ellipses-outline'}
                  color={'#888'}
                  size={40}
                />
              </View>

              <Text style={styles.colTxt}>Chat Requests</Text>
            </View>
          </View>

          {/* bottom */}

          {/* my matches */}
          <View style={styles.myMatches}>
            <View style={styles.title}>
              <LinearGradient
                colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <FontAwesome5 name={'user'} color={'#fff'} size={14} />
              </LinearGradient>
              <Text style={{marginLeft: 7}}>My Matches</Text>
            </View>
            <Text style={{paddingTop: 5}}>
              View all the profiles that match your partner preferences.
            </Text>

            <View style={{alignItems: 'center'}}>
              <LinearGradient
                colors={GRCOLOR}
                style={styles.button}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: THEME.WHITE}}>
                    View Matching Profiles
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          {/* my matches */}

          {/* Search */}
          <View style={{padding: 10}}>
            <View style={styles.title}>
              <LinearGradient
                colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Feather name={'search'} color={'#fff'} size={14} />
              </LinearGradient>
              <Text style={{marginLeft: 7}}>Search</Text>
            </View>
            <Text style={{paddingTop: 5}}>Search Profiles of your choice.</Text>

            <View style={{alignItems: 'center'}}>
              <LinearGradient
                colors={GRCOLOR}
                style={styles.button}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: THEME.WHITE}}>Search Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          {/* search */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  col: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#d4d4d4',
  },
  colIconCon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTxt: {marginTop: 4, textAlign: 'center'},
  trustCon: {
    paddingTop: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d4d4d4',
  },
  trustConIn: {
    flexDirection: 'row',
  },
  trustCol: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderColor: '#d4d4d4',
  },
  trustcolIconCon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4d4d4',
  },
  trustColTxt: {
    marginTop: 4,
    fontSize: 13,
    textAlign: 'center',
  },
  myMatches: {
    padding: 10,
  },
  title: {
    flexDirection: 'row',
    // padding: 10,
    alignItems: 'center',
  },

  button: {
    width: '50%',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 30,
  },
});
