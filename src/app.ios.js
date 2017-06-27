/**
 * @flow
 */

import React from 'react';
import { StyleSheet, TabBarIOS, View, Text, AsyncStorage } from 'react-native';
import ExercisesView from './views/exercises';
import seedData from './../seedData';

export default class LivestrongNative extends React.Component {
  constructor() {
    super();
    // AsyncStorage.clear();
    this.state = {
      selectedTab: 'Exercises',
      userData: {}
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('userData').then(
      function(stringData) {
        if (stringData === null) {
          AsyncStorage.setItem('userData', JSON.stringify(seedData.userData))
            .then(() => {
              return AsyncStorage.getItem('userData');
            })
            .then(
              function(stringData) {
                this.setState({
                  userData: JSON.parse(stringData)
                });
              }.bind(this)
            );
        } else {
          this.setState({
            userData: JSON.parse(stringData)
          });
        }
      }.bind(this)
    );
  }

  _getDefaultTab() {
    return 'Exericses';
  }

  _selectTab(tab) {
    this.setState({
      selectedTab: tab
    });
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title="Exercises"
          icon={require('../assets/list@2x.png')}
          selected={this.state.selectedTab === 'Exercises'}
          onPress={() => this._selectTab('Exercises')}
        >
          <ExercisesView exercises={this.state.userData.exercises} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Plans"
          icon={require('../assets/calendar@2x.png')}
          selected={this.state.selectedTab === 'Plans'}
          onPress={() => this._selectTab('Plans')}
        >
          <View>
            <Text>Plans</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Workout"
          icon={require('../assets/play@2x.png')}
          selected={this.state.selectedTab === 'Workout'}
          onPress={() => this._selectTab('Workout')}
        >
          <View>
            <Text>Workout</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Chart"
          icon={require('../assets/chart@2x.png')}
          selected={this.state.selectedTab === 'Chart'}
          onPress={() => this._selectTab('Chart')}
        >
          <View>
            <Text>Chart</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Settings"
          icon={require('../assets/gear@2x.png')}
          selected={this.state.selectedTab === 'Settings'}
          onPress={() => this._selectTab('Settings')}
        >
          <View>
            <Text>Settings</Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}
