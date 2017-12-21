import React from 'react';
import { ActionSheetIOS, Button, FlatList, Text, View } from 'react-native';
import localData from '../../utils/localData';
import { borderGray } from '../../globals';

export default class DeviceData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			refreshing: false
		};
		this._renderDataItem = this._renderDataItem.bind(this);
		this._updateData = this._updateData.bind(this);
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
			<FlatList
				data={this.state.data}
				renderItem={this._renderDataItem}
				refreshing={this.state.refreshing}
				onRefresh={this._updateData}
				ListEmptyComponent={() => (
					<Text
						style={{
							textAlign: 'center',
							marginTop: 10
						}}
					>
						No data found
					</Text>
				)}
			/>
		);
	}

	_renderDataItem({ item, index }) {
		return (
			<View
				key={index}
				style={{
					paddingTop: 10,
					paddingBottom: 10,
					paddingLeft: 10,
					paddingRight: 5,
					borderBottomColor: borderGray,
					borderBottomWidth: 0.5
				}}
			>
				<Text
					style={{
						fontWeight: 'bold'
					}}
				>
					{item.key}
				</Text>
				<Text
					style={{
						paddingTop: 5
					}}
				>
					{JSON.stringify(item.value)}
				</Text>
				<Button
					title="Delete"
					onPress={() => this._deleteData(item.key)}
					color="red"
				/>
			</View>
		);
	}
}
