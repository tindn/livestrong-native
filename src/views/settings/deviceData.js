import React from 'react';
import { ActionSheetIOS, Button, ScrollView, Text, View } from 'react-native';
import localData from '../../utils/localData';

export default class DeviceData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this._updateData();
	}

	_updateData() {
		localData.getAllData().then(data => {
			data = data
				.map(function(val) {
					let data = val[1];
					if (val[1][0] === '{' || val[1][0] === '[') {
						data = JSON.parse(val[1]);
					}
					return {
						key: val[0],
						value: data
					};
				})
				.sort(function(obj1, obj2) {
					if (obj1.key < obj2.key) {
						return -1;
					} else if (obj1.key > obj2.key) {
						return 1;
					}
					return 0;
				});
			this.setState(prevState => {
				prevState.data = data;
				return prevState;
			});
		});
	}

	_deleteData(key) {
		console.log(key);
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: `Are you sure you want to delete ${key}?`,
				options: ['Delete', 'Cancel'],
				destructiveButtonIndex: 0,
				cancelButtonIndex: 1
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					localData.deleteItem(key).then(this._updateData.bind(this));
				}
			}
		);
	}

	render() {
		return (
			<ScrollView>
				{this.state.data.map(
					function(obj, index) {
						return (
							<View
								key={index}
								style={{
									paddingTop: 10,
									paddingBottom: 10,
									paddingLeft: 10,
									paddingRight: 5,
									borderBottomColor: '#B5B9C2',
									borderBottomWidth: 0.5
								}}
							>
								<Text
									style={{
										fontWeight: 'bold'
									}}
								>
									{obj.key}
								</Text>
								<Text
									style={{
										paddingTop: 5
									}}
								>
									{JSON.stringify(obj.value)}
								</Text>
								<Button
									title="Delete"
									onPress={() => this._deleteData(obj.key)}
									color="red"
								/>
							</View>
						);
					}.bind(this)
				)}
			</ScrollView>
		);
	}
}
