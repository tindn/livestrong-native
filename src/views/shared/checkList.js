import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';

export default props => (
	<View>
		{props.options.map((option, index) => {
			let isSelected = props.selectedValue === option.value;
			return (
				<TouchableHighlight
					key={index}
					onPress={() => {
						props.onPress(option.value);
					}}
				>
					<View style={{ flexDirection: 'row' }}>
						<Text
							style={{
								fontSize: 20,
								height: 40,
								color: isSelected ? '#007AFF' : '#000'
							}}
						>
							{option.name}
						</Text>
						{isSelected ? (
							<Image
								source={require('../../../assets/check.png')}
								style={styles.checkIcon}
							/>
						) : null}
					</View>
				</TouchableHighlight>
			);
		})}
	</View>
);

const styles = StyleSheet.create({
	checkIcon: {
		width: 30,
		height: 30,
		tintColor: '#007AFF',
		marginLeft: 30,
		marginTop: -5
	}
});
