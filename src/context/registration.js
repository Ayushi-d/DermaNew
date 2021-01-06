import React from 'react';
import auth from '@react-native-firebase/auth';

import database from '@react-native-firebase/database';

import DateHelpers from '../helpers/datehelpers';

const RegistrationContext = React.createContext();

/**
 * @param nm: name
 * @param ht: height
 * @param dob: date of birth
 * @param g: gender
 * @param sc: skin condition
 * @param dp: profile pic seen by others
 * @param pnm: privacy for name 0 / 1
 * @param em : email
 * @param c : country
 * @param s: state
 * @param ct: city
 * @param he: heighest Education
 * @param ef: education field
 * @param p: profession
 * @param dk: drinking
 * @param sk: smoking
 * @param rl: religion
 * @param rle: religion edit
 * @param ms: married status
 * @param ae: about me
 * @param nae: approved about me
 * @param pp: partner preference -> object
 * @param ts: trust score -> object
 * @param uid: firebase uid
 * @param nid: generated uid
 * @param tp: timestamp
 * @param in: interest -> comma seperated values
 * @param dt: diet
 * @param child: children
 *
 */

class RegistrationHOC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        nm: '',
        ht: '',
        dob: '',
        g: '',
        sc: '',
        dp:
          'https://firebasestorage.googleapis.com/v0/b/derma-cupid.appspot.com/o/images%2FNew%20User%2FProfile-ICon.png?alt=media&token=3a84752a-9c6e-4dcd-b31a-aec8675d55c1',
        ndp:
          'https://firebasestorage.googleapis.com/v0/b/derma-cupid.appspot.com/o/images%2FNew%20User%2FProfile-ICon.png?alt=media&token=3a84752a-9c6e-4dcd-b31a-aec8675d55c1',
        pnm: '',
        em: '',
        c: '',
        s: '',
        ct: '',
        he: '',
        ef: '',
        p: '',
        dk: '',
        sk: '',
        rl: '',
        rle: 0,
        ms: '',
        ae: '',
        nae: '',
        pp: {},
        ts: {},
        uid: '',
        nid: '',
        tp: '',
        in: '',
        sn: '',
        cn: '0',
        cat: new Date().getTime() / 1000,
      },
    };
  }

  componentDidMount() {
    let user = auth().currentUser;
  }

  _saveRegistrationToFirebase = async (obj) => {
    console.log(obj);
    let ref = database().ref('Users');
    console.log(obj);
    if (!obj.uid) {
      alert('Something went wrong, Please try again.');
      this.props.navigation.pop();
      return;
    }

    let data = await ref.child(obj.uid).set(obj, (err) => {
      if (err) return err;
    });

    let counts = database().ref('rc');

    await counts.set(obj.nid + 1, (err) => {});

    return true;
  };

  setRegistration = (regObj) => {
    return new Promise(async (resolve, reject) => {
      console.log(regObj, 'save reg');
      let pp = this._getDefaultPreference(regObj.dob, regObj.ms, regObj.g);
      let ts = this._getTrustScore(regObj.providerId);

      let tp = DateHelpers.getStringFromDate(new Date());

      let sn = this._showNameSetting(regObj.g, regObj.nm, regObj.pnm);

      let data = {...this.state.data};
      let sendData = {};
      Object.keys(data).map((key) => {
        sendData[key] = regObj[key] || data[key];
      });

      (sendData.pp = pp),
        (sendData.ts = ts),
        (sendData.tp = tp),
        (sendData.sn = sn);
      sendData.pnm = regObj.pnm == 'Show my name' ? 1 : 0;
      sendData.cn = regObj.providerId == 'facebook.com' ? '0' : regObj.cn;

      const snap = await database().ref('rc').once('value');

      sendData.nid = snap.val();

      this.setState({data: {...sendData}}, () => {
        this._saveRegistrationToFirebase({...this.state.data})
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    });
  };

  _showNameSetting = (g, nm, pnm) => {
    let sn = '';

    if (pnm == 'Hide my name') {
      return nm[0];
    }

    let n = nm.split(' ');

    if (g == 'Male') {
      sn = n[0];
      return sn;
    }

    sn = nm[0];

    return sn;
  };

  _getDefaultPreference = (dob, ms, g) => {
    let pp = {
      a1: 18,
      a2: 18,
      c: "Doesn't matter",
      ms: "Doesn't matter",
      rl: "Doesn't matter",
      sc: "Doesn't matter",
    };

    if (ms == 'Never Married') {
      pp.ms = 'Never Married';
    }

    let age = parseInt(DateHelpers.getAge(dob));

    if (g == 'Male') {
      pp.a1 = age - 7 > 18 ? age - 7 : 18;
      pp.a2 = age + 3;
    } else {
      pp.a1 = age - 3 > 18 ? age - 3 : 18;
      pp.a2 = age + 7;
    }

    return pp;
  };

  _getTrustScore = (providerId) => {
    let ts = {
      ts: 20,
      dp: 0,
      em: 0,
      f: 0,
      m: 0,
      pd: 0,
    };

    if (providerId == 'facebook.com') {
      ts.f = 1;
      return ts;
    }

    ts.m = 1;
    return ts;
  };

  render() {
    return (
      <RegistrationContext.Provider
        value={{
          data: this.state,
          setRegistration: this.setRegistration,
        }}>
        {this.props.children}
      </RegistrationContext.Provider>
    );
  }
}

export default RegistrationHOC;
export {RegistrationContext};
