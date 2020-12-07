import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    FlatList
} from 'react-native';
import THEME from '../../config/theme';
import Drop from '../../assets/general/ic_drop.png';


const SelectItem = ({ item, pushItemData }) =>
    <TouchableOpacity
        pointerEvents="box-only"
        style={dropdown.item}
        onPress={() => pushItemData(item.dial_code)}>
        <Text
            style={{ fontSize: 12, height: 40, lineHeight: 40, paddingHorizontal: 20 }}
        >
            {`${item.name} (${item.dial_code})`}
        </Text>
    </TouchableOpacity>

class DropDown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDrop: false,
            value: this.props.defaultValue,
        }
    }

    showDropDown = () => {
        this.setState({ showDrop: !this.state.showDrop })
    }

    getItemFromSelect = (item) => {
        this.setState({ showDrop: false, value: item }, () => {
            this.props.pushChange(this.state.value)
        })
    }

    hideDrop = () => {
        this.setState({ showDrop: false })
    }


    render() {
        return (
            <View style={{ ...dropdown.container, ...this.props.style }}>
                {
                    (this.state.showDrop)
                        ? < FlatList
                            data={this.props.data}
                            style={dropdown.dropdown}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <SelectItem item={item} pushItemData={this.getItemFromSelect} />}

                        />
                        : null
                }
                <TouchableWithoutFeedback onPress={this.showDropDown}>
                    <View>
                        <TextInput
                            style={dropdown.select}
                            onFocus={this.onFocus}
                            editable={false}
                            placeholder={(!this.props.placeholder) ? "" : this.props.placeholder}
                            value={this.state.value}
                        />
                        <Image source={Drop} style={dropdown.drop} />
                        {
                            (this.props.label) ?
                                < View style={dropdown.label}>
                                    <Text style={{ fontSize: 12 }}>{this.props.label}</Text>
                                </View>
                                : null
                        }
                    </View>
                </TouchableWithoutFeedback>

            </View >
        )
    }
}


const dropdown = StyleSheet.create({
    container: {
        borderRadius: 3,
    },
    select: {
        height: 40,
        borderWidth: 1,
        borderColor: THEME.BORDERCOLOR,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        fontSize: 12
    },
    drop: {
        width: 15,
        height: 15,
        opacity: 0.5,
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -7.5 }]
    },
    label: {
        position: 'absolute',
        height: 18,
        top: -9,
        left: 10,
        backgroundColor: THEME.WHITE,
        paddingHorizontal: 8,
    },
    dropdown: {
        maxHeight: 200,
        position: 'absolute',
        width: 200,
        top: 40,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        backgroundColor: THEME.WHITE,
        zIndex: 20
    },
    item: {
        borderBottomWidth: 1,
        borderColor: THEME.BORDERCOLOR,
        justifyContent: 'center',
        height: 40,
    }

})


export default DropDown;