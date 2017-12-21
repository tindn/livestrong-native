import React from 'react';
import {
	ActionSheetIOS,
	Alert,
	Button,
	FlatList,
	RefreshControl,
	StyleSheet,
	ScrollView,
	Text,
	View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import localData from '../../utils/localData';
import { borderGray } from '../../globals';
import { TextInputGroupStyles } from '../../styles';

export default class BackedupData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backups: [],
			refreshing: false
		};
		this._restore = this._restore.bind(this);
		this._delete = this._delete.bind(this);
		this._updateBackups = this._updateBackups.bind(this);
	}

	componentDidMount() {
		this._updateBackups();
	}

	_updateBackups() {
		this.setState({ refreshing: true, error: undefined });

		this.props._backupDataRef
			.orderByKey()
			.limitToLast(20)
			.once('value')
			.then(
				function(snapshot) {
					const val = snapshot.val();
					if (!val) {
						this.setState({
							refreshing: false
						});
						return;
					}
					const backupData = Object.keys(val).map(key =>
						Object.assign({ key: key }, val[key])
					);
					this.setState({
						refreshing: false,
						backups: backupData
					});
				}.bind(this)
			)
			.catch(
				function(error) {
					this.setState({
						error: error,
						refreshing: false
					});
				}.bind(this)
			);
	}

	render() {
		let renderView = this.state.error ? (
			<ScrollView
				style={{ marginTop: 65 }}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._updateBackups}
					/>
				}
			>
				<Text>{this.state.error.message}</Text>
			</ScrollView>
		) : (
			<FlatList
				data={this.state.backups}
				renderItem={({ item, index }) => this.renderBackup(item, index)}
				refreshing={this.state.refreshing}
				onRefresh={this._updateBackups}
				ListEmptyComponent={() => (
					<Text
						style={{
							textAlign: 'center',
							marginTop: 10
						}}
					>
						No backups found
					</Text>
				)}
			/>
		);
		return renderView;
	}

	renderBackup(backup, index) {
		return (
			<View style={[TextInputGroupStyles.group, styles.backup]}>
				<Text style={TextInputGroupStyles.label}>Backup Time</Text>
				<Text style={styles.value}>
					{new Date(parseInt(backup.exportedTimestamp)).toString()}
				</Text>
				<Text style={TextInputGroupStyles.label}>Last Updated</Text>
				<Text style={styles.value}>
					{new Date(parseInt(backup.lastUpdated)).toString()}
				</Text>
				<View style={styles.restore}>
					<Button onPress={() => this._restore(index)} title="Restore" />
					{/* <Button
						onPress={() => this._delete(index)}
						title="Delete"
						color="red"
					/> */}
				</View>
			</View>
		);
	}

	_restore(index) {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to restore this backup?',
				options: ['Restore', 'Cancel'],
				cancelButtonIndex: 1
			},
			function(buttonIndex) {
				if (buttonIndex === 0) {
					localData.dangerouslyClearEverything().then(() => {
						localData.restoreData(this.state.backups[index].localData);
						this.props.navigator.pop();
					});
				}
			}.bind(this)
		);
	}

	_delete(index) {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to delete this backup?',
				options: ['Delete', 'Cancel'],
				destructiveButtonIndex: 0,
				cancelButtonIndex: 1
			},
			function(buttonIndex) {
				if (buttonIndex === 0) {
					let dataUrl = 'https://' + this.state.backups[index].url;
					let authToken = 'fd1bafdd-e8f0-4b66-8116-6a7383d2ea19';
					if (DeviceInfo.isEmulator()) {
						dataUrl = 'http://' + this.state.backups[index].url;
						authToken = 'b23de2b9-06c8-4f3f-bca0-2e798282ed5d';
					}
					fetch(dataUrl, {
						method: 'DELETE',
						headers: {
							Authorization: authToken
						}
					})
						.then(result => {
							return result.text();
						})
						.then(result => {
							Alert.alert('', result, [{ text: 'Ok' }], { cancelable: false });
						})
						.then(() => {
							this._updateBackups();
						});
				}
			}.bind(this)
		);
	}
}

const styles = StyleSheet.create({
	backup: {
		borderColor: borderGray,
		borderBottomWidth: 0.5,
		marginTop: 10
	},
	value: { marginBottom: 10 },
	restore: {
		marginTop: 5,
		marginBottom: 20
	}
});
