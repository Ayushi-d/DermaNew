import {Dimensions} from 'react-native';

const scalefactor = Dimensions.get('window').width / 380;

export function getScale(size) {
  return size * scalefactor;
}
