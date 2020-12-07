import {LoginManager, AccessToken} from 'react-native-fbsdk';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class LinkAccount {}

LinkAccount.withFB = async () => {
  let result;
  let data;
  try {
    LoginManager.setLoginBehavior('NATIVE_ONLY');
    result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
  } catch (nativeError) {
    try {
      LoginManager.setLoginBehavior('WEB_ONLY');
      result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
    } catch (webError) {
    }
  }
  // handle the case that users clicks cancel button in Login view
  if (result.isCancelled) {
    return false;
  }

  // login with credentials
  let accessData = await AccessToken.getCurrentAccessToken();

  const faceBookAuth = auth.FacebookAuthProvider.credential(
    accessData.accessToken,
  );

  try {
    data = await auth().currentUser.linkWithCredential(faceBookAuth);
    return true
  } catch (err) {
    alert(err);
    return false
  }
};

LinkAccount.withPhone = async (verificationId, code) => {
  let data;
  const phoneAuthProvider = auth.PhoneAuthProvider.credential(
    verificationId,
    code,
  );
  try {
    data = await auth().currentUser.linkWithCredential(phoneAuthProvider);
  } catch (err) {
    alert(err);
  }
  return data;
};

export default LinkAccount;
