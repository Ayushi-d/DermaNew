import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../config/theme';
import DEFAULT_BUTTON from '../general/button';

let data =
	'We use your facebook information only to build an authenticate and verified profile. We will never ever post anything to your facebook wall';

const HelpInfo = (props) => {
	return (
		<ReactNativeModal isVisible={props.isVisible} onBackdropPress={props.toggleHelpInfo}>
			<LinearGradient
				colors={[ ...THEME.GRADIENT_BG.PAIR ].reverse()}
				style={[ style.header ]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>
				<Text style={{ color: THEME.WHITE }}>Help</Text>
			</LinearGradient>
			<View style={{ backgroundColor: THEME.WHITE, padding: 20 }}>
				<View
					style={{
						paddingTop: 10,
						paddingBottom: 20
					}}
				>
					<Text>{data}</Text>
				</View>
				<DEFAULT_BUTTON text={'OK'} style={{ alignSelf: 'center' }} _onPress={props.toggleHelpInfo} />
			</View>
		</ReactNativeModal>
	);
};

const style = StyleSheet.create({
	header: {
		height: 50,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	}
});

export default HelpInfo;
