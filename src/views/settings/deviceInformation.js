import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { TextInputGroupStyles } from '../../styles';

export default (DeviceInformation = props => {
	const deviceInfo = [
		{ label: 'Device Unique Id', info: DeviceInfo.getUniqueID() },
		{ label: 'Brand', info: DeviceInfo.getBrand() },
		{ label: 'Model', info: DeviceInfo.getModel() },
		{ label: 'Device Id', info: DeviceInfo.getDeviceId() },
		{ label: 'System', info: DeviceInfo.getSystemName() },
		{ label: 'System Version', info: DeviceInfo.getSystemVersion() },
		{ label: 'Bundle Id', info: DeviceInfo.getBundleId() },
		{ label: 'Build Number', info: DeviceInfo.getBuildNumber() },
		{ label: 'App Version', info: DeviceInfo.getVersion() },
		{ label: 'Device Name', info: DeviceInfo.getDeviceName() },
		{ label: 'User Agent', info: DeviceInfo.getUserAgent() },
		{ label: 'Device Locale', info: DeviceInfo.getDeviceLocale() },
		{ label: 'Device Country', info: DeviceInfo.getDeviceCountry() },
		{ label: 'Timezone', info: DeviceInfo.getTimezone() }
	];
	return (
		<ScrollView style={styles.scrollView}>
			{deviceInfo.map((info, index) => (
				<View style={TextInputGroupStyles.group} key={index}>
					<Text style={TextInputGroupStyles.label}>{info.label}</Text>
					<Text style={styles.info}>{info.info}</Text>
				</View>
			))}
		</ScrollView>
	);
});

const styles = StyleSheet.create({
	scrollView: { marginTop: 10 },
	info: {
		marginBottom: 20
	}
});
