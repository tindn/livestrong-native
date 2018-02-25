import React from 'react';
import {
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
import firebase from '../../firebase';
import PropTypes from 'prop-types';

export default class BackedupData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backups: [],
			refreshing: false
		};
		this._restore = this._restore.bind(this);
		this._updateBackups = this._updateBackups.bind(this);
		this._backupDataRef = firebase
			.database()
			.ref()
			.child(
				`backup/${DeviceInfo.getUniqueID()
					.split('-')
					.join('')}`
			);
	}

	componentDidMount() {
		this._updateBackups();
	}

	_updateBackups() {
		this.setState({ refreshing: true, error: undefined });

		this._backupDataRef
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
				style={styles.errorView}
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
					<Text style={styles.emptyText}>No backups found</Text>
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
				</View>
			</View>
		);
	}

	_restore(index) {
		Alert.alert('', 'Are you sure you want to restore this backup?', [
			{
				text: 'Cancel',
				type: 'cancel'
			},
			{
				text: 'Restore',
				onPress: () => {
					localData.dangerouslyClearEverything().then(() => {
						localData.restoreData(this.state.backups[index].localData);
						this.props.navigation.pop();
					});
				}
			}
		]);
	}
}

BackedupData.propTypes = {
	navigation: PropTypes.object
};

const styles = StyleSheet.create({
	errorView: { marginTop: 65 },
	emptyText: {
		textAlign: 'center',
		marginTop: 10
	},
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
