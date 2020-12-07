import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import Drop from '../../assets/general/ic_drop.png';
import THEME from '../../config/theme';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

class ProfessionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			initialScrollIndex: 0
		};
	}

	_renderProfession = (heading, list, isi) => {
		return (
			<View style={style.list}>
				<Text style={style.heading}>{heading}</Text>
				{list.map((item, index) => (
					<TouchableOpacity key={index} style={[ style.item ]} onPress={() => this._setValue(item, isi)}>
						<Text
							style={{
								color:
									isi == this.state.initialScrollIndex && item == this.state.value
										? THEME.GRADIENT_BG.END_COLOR
										: THEME.PARAGRAPH
							}}
						>
							{item}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	_setValue = (text, index) => {
		this.setState({ initialScrollIndex: index, showModal: false }, () => {
			this.props.pushChange(this.props.name, text);
		});
	};

	_showModal = () => {
		this.setState({ showModal: true });
	};

	_renderModal = () => {
		return (
			<Modal
				isVisible={this.state.showModal}
				onBackdropPress={() => {
					this.setState({ showModal: false });
				}}
				onBackButtonPress={() => {
					this.setState({ showModal: false });
				}}
			>
				<View style={style.modal}>
					<LinearGradient
						colors={[ ...THEME.GRADIENT_BG.PAIR ].reverse()}
						style={[ style.header ]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					>
						<Text style={style.title}>Profession</Text>
					</LinearGradient>
					<FlatList
						data={Object.keys(this.props.data)}
						keyExtractor={(item, index) => item}
						style={style.professionList}
						renderItem={({ item, index }) => this._renderProfession(item, this.props.data[item], index)}
						initialScrollIndex={this.state.initialScrollIndex}
					/>
				</View>
			</Modal>
		);
	};

	render() {
		return (
			<TouchableOpacity style={style.inputContainer} onPress={this._showModal}>
				<TextInput style={[ style.input ]} value={this.props.value} editable={false} placeholder={'Select'} />
				<Image source={Drop} style={style.drop} />
				<Text style={style.label}>{this.props.label}</Text>
				{this.props.error ? (
					<Text style={{ color: THEME.ERROR_REG, padding: 5, fontSize: 12 }}>{this.props.error}</Text>
				) : null}
				{this.state.showModal ? this._renderModal() : null}
			</TouchableOpacity>
		);
	}
}

const style = StyleSheet.create({
	header: {
		height: 50,
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	title: {
		color: THEME.WHITE,
		fontSize: 14,
		fontWeight: 'bold'
	},

	input: {
		height: 50,
		maxHeight: 200,
		borderWidth: 1,
		borderColor: THEME.BORDERCOLOR,
		borderRadius: 5,
		paddingHorizontal: 10,
		color: THEME.PARAGRAPH
	},
	inputContainer: {
		marginTop: 20
	},
	label: {
		position: 'absolute',
		color: THEME.PARAGRAPH,
		fontSize: 12,
		height: 20,
		textAlign: 'center',
		lineHeight: 20,
		top: -10,
		left: 10,
		backgroundColor: THEME.WHITE,
		paddingHorizontal: 5
	},
	drop: {
		width: 15,
		height: 15,
		opacity: 0.5,
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [ { translateY: -7.5 } ]
	},
	modal: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	professionList: {
		backgroundColor: THEME.WHITE,
		width: '90%',
		padding: 20
	},
	heading: {
		fontSize: 16,
		fontWeight: '800',
		marginBottom: 10,
		color: THEME.GRADIENT_BG.END_COLOR
	},
	item: {
		borderWidth: 1,
		borderColor: THEME.BORDERCOLOR,
		paddingHorizontal: 5,
		marginBottom: 5,
		height: 40,
		justifyContent: 'center'
	},
	list: {
		marginBottom: 20
	}
});

export default ProfessionList;
