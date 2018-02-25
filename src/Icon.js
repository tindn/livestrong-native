import React from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { textGray } from './globals';

const Icon = props => {
	const tintColor = props.tintColor || textGray;

	const styles = StyleSheet.create({
		image: {
			tintColor: tintColor
		}
	});
	return (
		<Image source={props.iconSource} style={[props.style, styles.image]} />
	);
};

Icon.propTypes = {
	iconSource: PropTypes.number,
	tintColor: PropTypes.string,
	style: PropTypes.number
};

export default Icon;

export function getTabBarIcon(source) {
	return function tarBarFunction({ focused, tintColor }) {
		return <Icon tintColor={focused ? tintColor : null} iconSource={source} />;
	};
}
