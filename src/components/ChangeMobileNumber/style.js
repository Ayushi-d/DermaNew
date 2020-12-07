import { StyleSheet } from 'react-native';
import THEME from '../../config/theme';

const style = StyleSheet.create({
	phoneLogin: {
		backgroundColor: THEME.WHITE,
		flex: 1,
		borderRadius: 20,
		padding: 10
	},
	getPhoneNumber: {
		flex: 1,
		alignItems: 'center'
	},
	inputs: {
		flexDirection: 'row',
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: '50%'
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderColor: THEME.BORDERCOLOR,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginLeft: 5
	},
	number: {
		width: '80%'
	},
	button: {
		width: '50%',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		borderRadius: 20,
		marginTop: 30
	},

	submitOtp: {
		width: '50%',
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		borderRadius: 20
	},
	otp: {
		borderWidth: 1,
		width: 50,
		height: 50,
		borderColor: THEME.BORDERCOLOR,
		borderRadius: 2,
		paddingHorizontal: 20
	},
	otpContainer: {
		flex: 1,
		marginTop: 20
	},
	heading: {
		color: THEME.HEADING,
		fontSize: 18,
		marginBottom: 20
	},
	para: {
		color: THEME.PARAGRAPH,
		fontSize: 14,
		marginBottom: 10
	},
	grid: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: '10%'
	},
	links: {
		textAlign: 'center',
		textDecorationLine: 'underline',
		color: THEME.LINKS,
		marginTop: 20
	}
});

export default style;
