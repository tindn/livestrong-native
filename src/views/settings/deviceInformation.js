import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default (DeviceInformation = props => {
	return (
		<ScrollView>
			<View>
				<Text style={styles.label}>Device Unique Id </Text>
				<Text>
					{DeviceInfo.getUniqueID()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Brand</Text>
				<Text>
					{DeviceInfo.getBrand()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Model</Text>
				<Text>
					{DeviceInfo.getModel()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Device Id</Text>
				<Text>
					{DeviceInfo.getDeviceId()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>System</Text>
				<Text>
					{DeviceInfo.getSystemName()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>System Version</Text>
				<Text>
					{DeviceInfo.getSystemVersion()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Bundle Id</Text>
				<Text>
					{DeviceInfo.getBundleId()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Build Number</Text>
				<Text>
					{DeviceInfo.getBuildNumber()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>App Version</Text>
				<Text>
					{DeviceInfo.getVersion()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Device Name</Text>
				<Text>
					{DeviceInfo.getDeviceName()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>User Agent</Text>
				<Text>
					{DeviceInfo.getUserAgent()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Device Locale</Text>
				<Text>
					{DeviceInfo.getDeviceLocale()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Device Country</Text>
				<Text>
					{DeviceInfo.getDeviceCountry()}
				</Text>
			</View>
			<View>
				<Text style={styles.label}>Timezone</Text>
				<Text>
					{DeviceInfo.getTimezone()}
				</Text>
			</View>
		</ScrollView>
	);
});

const styles = StyleSheet.create({
	label: {
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 15
	}
});
