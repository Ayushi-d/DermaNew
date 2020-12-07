import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

class Uploader {}
Uploader.newuser =
  'https://firebasestorage.googleapis.com/v0/b/derma-cupid.appspot.com/o/images%2FNew%20User%2FProfile-ICon.png?alt=media&token=3a84752a-9c6e-4dcd-b31a-aec8675d55c1';

Uploader.uploadFileHelp = async (image, ccb) => {
  let fileName = image.split('/').pop();

  let ref = storage()
    .ref('/dermaImages/help/')
    .child(fileName);

  try {
    let upload = await ref.putFile(image, {cacheControl: 'no-store'});
  } catch (err) {
    return {error: err};
  }

  let downloadUrl = await ref.getDownloadURL();
  return {url: downloadUrl, error: false};
};

Uploader.uploadFile = async (image, pcb, ccb, photoId = false) => {
  let uid = auth().currentUser.uid;

  let fileName = image.split('/').pop();

  if (uid) {
    let ref = storage()
      .ref('/images/' + uid)
      .child(fileName);

    ref.putFile(image, {cacheControl: 'no-store'}).on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        pcb(progress);
      },
      err => {
        unsubscribe();
      },
      () => {
        // ref.
        ref.getDownloadURL().then(downloadUrl => {
          !photoId
            ? Uploader.addDownloadURL(downloadUrl).then(res => ccb(res))
            : Uploader.addDownloadURLId(downloadUrl).then(res => ccb(res));
        });
      },
    );
  }
};

Uploader.addDownloadURLId = async url => {
  let uid = auth().currentUser.uid;
  try {
    let ref = await database()
      .ref('Users/' + uid)
      .child('ts')
      .child('pd')
      .set(-1);

    let res = await database()
      .ref('/Photos/pids')
      .child(uid)
      .set({
        id: uid,
        url,
      });
  } catch (err) {
    console.log(err, 'error in uploading file');
    return false;
  }
  return true;
};

Uploader.addDownloadURL = async url => {
  let uid = auth().currentUser.uid;
  try {
    let ref = await database()
      .ref('Users/' + uid)
      .child('aop')
      .push(url);

    let res = await database()
      .ref('Photos/pics')
      .child(uid)
      .child(ref.key)
      .set(url);
  } catch (err) {
    console.log(res, 'error in uploading pictures');
    return false;
  }
  return true;
};

Uploader.deletePhoto = async (key, url) => {
  let uid = auth().currentUser.uid;

  let snapshot = await database()
    .ref('Users/' + uid)
    .child('aop')
    .child(key)
    .once('value');

  let deleteFrom = snapshot.val() ? 'aop' : 'op';

  try {
    let refUrl = Uploader.getRefFromUrl(url);
    let photo = await storage()
      .ref(refUrl)
      .delete();
    let del = await database()
      .ref('Users/' + uid + '/' + deleteFrom)
      .child(key)
      .remove();

    let delFromAdminApproval = await database()
      .ref('/Photos/pics')
      .child(uid)
      .child(key)
      .set(null);

    return true;
  } catch (err) {
    console.log(err, 'error in deleting photos');
    return false;
  }
};

Uploader.makeProfilePhoto = async url => {
  let uid = auth().currentUser.uid;

  try {
    await database()
      .ref(`Users/${uid}`)
      .child('dp')
      .set(url);
    await database()
      .ref(`Users/${uid}`)
      .child('ndp')
      .set(url);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @todo
 * 1. implement dp change shit
 */

Uploader.getRefFromUrl = url => {
  const parts = url.match(/\/b\/.*\.appspot.com\/o\/(.*?)%2F(.*?)%2F(.*?)?\?/);
  parts.splice(0, 1);
  return parts.join('/');
};

export default Uploader;
