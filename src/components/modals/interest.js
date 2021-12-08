import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import PhotoSwiper from '../cards/photoSwiper';
import DEFAULT_BUTTON, { BUTTON_WITH_PARAM } from '../general/button';

const data = [
	'Music',
	'Movies',
	'TV shows',
	'Shopping',
	'Travel',
	'Outdoors',
	'Reading',
	'Writing',
	'Blogging',
	'Internet',
	'Eating out',
	'Bars/Pubs',
	'Jogging',
	'Walking',
	'Gym',
	'Yoga',
	'Meditation',
	'Gardening',
	'Adventure Sports',
	'Cars',
	'Bikes',
	'Gadgets',
	'Pets',
	'Tattoos',
	'Art/Handicraft',
	'Painting',
	'Photography',
	'Cooking',
	'Clean eating',
	'Sports',
	'Indoor games',
	'Video games',
	'History',
	'Politics',
	'Collectibles',
	'Social Service',
	'Charity',
	'Wildlife',
	'Puzzles',
	'Crosswords',
	'Performing Arts',
	'Astronomy',
	'Astrology',
	'Theatre',
	'Religious activities'
];

class Interest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: (this.props.data && this.props.data.split(', ')) || []
		};
	}

	handlePress = (item) => {
		let included = this.state.data.includes(item);
		let data = [...this.state.data ];
				if(!included) {
					if(data.length < 10) {
						data.push(item);
						this.setState({ data: data });
					} else {
						alert('You can select upto 10 interest.')
					}
				} else {
					data.splice(data.indexOf(item), 1);
					this.setState({ data: data });
				}

			// if (!included && data.length < 10) {
			// 	data.push(item);
			// 	this.setState({ data: data });
			// 	return;
			// } else {
			// 	alert('You can select upto 10 interest.')
			// }
			// data.splice(data.indexOf(item), 1);
			// this.setState({ data: data });
		// }
	};

	saveChanges = () => {
		let data = this.state.data.join(',');
		console.log('data lenght', this.state.data)
		if(this.state.data.length > 10) {
			alert('You can select upto 10 interest.')
		} else {
			this.props.saveChanges({in: data});
		}
	};

	render() {
		const { props } = this;
		return (
			<Modal
				isVisible={props.isVisible}
				backdropOpacity={0.5}
				onBackdropPress={this.props.onCancel}
				onBackButtonPress={this.props.onCancel}
			>
				<View style={style.container}>
					<LinearGradient
						colors={[ ...THEME.GRADIENT_BG.PAIR ].reverse()}
						style={[ style.header ]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					>
						<Text style={style.heading}>INTEREST</Text>
					</LinearGradient>
					<ScrollView style={style.religions}>
						<View style={style.tagContainer}>
							{data.map((item, i) => (
								<LinearGradient
									colors={
										this.state.data.includes(item) ? (
											[ ...THEME.GRADIENT_BG.PAIR ].reverse()
										) : (
											[ '#ffffff', '#ffffff' ]
										)
									}
									style={[ style.tagParent ]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									key={i}
								>
									<Text
										style={[
											style.tag,
											{
												color: this.state.data.includes(item) ? THEME.WHITE : THEME.PARAGRAPH,
												borderWidth: this.state.data.includes(item) ? 0 : 1,
												borderRadius: 15
											}
										]}
										onPress={() => this.handlePress(item)}
									>
										{item}
									</Text>
								</LinearGradient>
							))}
						</View>
					</ScrollView>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							position: 'absolute',
							bottom: 0,
							backgroundColor: THEME.WHITE,
							paddingVertical: 15,
							width: '100%'
						}}
					>
						<BUTTON_WITH_PARAM text={'CANCEL'} style={{ width: '40%' }} _onPress={this.props.onCancel} />
						<DEFAULT_BUTTON text={'SAVE'} style={{ width: '40%' }} _onPress={this.saveChanges} />
					</View>
				</View>
			</Modal>
		);
	}
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	religions: {
		width: '100%',
		height: '80%',
		backgroundColor: THEME.WHITE
	},
	header: {
		height: 50,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	heading: {
		color: THEME.WHITE,
		fontSize: 14,
		fontWeight: 'bold'
	},
	tagContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 70
	},
	tag: {
		fontSize: 12,
		color: THEME.WHITE,
		paddingHorizontal: 10,
		height: 30,
		lineHeight: 30,
		borderRadius: 15
	},

	tagParent: {
		height: 30,
		margin: 5,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Interest;
