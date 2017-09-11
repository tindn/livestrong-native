import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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

	render() {
		return (
			<ScrollView>
				{this.state.data.map(function(obj, index) {
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
						</View>
					);
				})}
			</ScrollView>
		);
	}
}
