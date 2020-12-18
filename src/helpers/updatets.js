import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LinkAccount from './linkAccount';

class UpdateTS {}

UpdateTS.addFacebook = async () => {
  let user = auth().currentUser;
  let uid;
  if (user) {
    uid = user.uid;
  } else {
    return;
  }

  let baseRef = database().ref('Users/' + uid + '/ts');

  let d = await LinkAccount.withFB();

  let data = await baseRef.child('f').set(1);
};

UpdateTS.addPhone = () => {};

UpdateTS.addEmail = () => {};

UpdateTS.updatePhoto = async (status) => {
  let data = await UpdateTS.baseRef.child('dp').set(status);
};

UpdateTS.addPhotoId = async () => {
  let data = await UpdateTS.baseRef.child('pd').set(-1);
};

export default UpdateTS;
