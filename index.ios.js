/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} from 'react-native';
import {fromJS, Map, is} from 'immutable';
import moment from 'moment';

const initialData = fromJS([
  {
    name: "Thing A",
    time: moment(),
  },
  {
    name: "Thing B",
    time: moment(),
  },
  {
    name: "Thing C",
    time: moment().add(1, 'd'),
  },
  {
    name: "Thing D",
    time: moment().add(1, 'd'),
  },
  {
    name: "Thing E",
    time: moment().add(2, 'd'),
  },
  {
    name: "Thing F",
    time: moment().add(2, 'd'),
  },
  {
    name: "Thing G",
    time: moment().add(2, 'd'),
  },
]);

function groupByDay(data) {
  const result = {};

  const now = moment();
  const tomorrow = moment().add(1, 'd');

  data.forEach((item, i) => {
    const time = item.get('time');
    const group =
      time.isBefore(now) ? 'In the past'
      : now.isSame(time, 'day') ? 'Today'
      : tomorrow.isSame(time, 'day') ? 'Tomorrow'
      : 'Later';

    let existingGroup = result[group];
    if (!existingGroup) {
      result[group] = existingGroup = [];
    }
    existingGroup.push(item.set('index', i));
  });

  return result;
}

class ListViewBug extends Component {
  constructor() {
    super();
    this.state = {
      data: initialData,
      dataSource: new ListView.DataSource({
        rowHasChanged: is,
        sectionHeaderHasChanged: is,
      }).cloneWithRowsAndSections(groupByDay(initialData)),
    };
  }
  sendUp(index) {
    const data = this.state.data.setIn([index, 'time'], moment());
    const dataSource = this.state.dataSource.cloneWithRowsAndSections(groupByDay(data));
    this.setState({data, dataSource});
  }
  renderRow(row) {
    return (
      <TouchableHighlight onPress={() => this.sendUp(row.get('index'))}>
        <View style={styles.row}>
          <Text style={{fontSize: 20}}>
            {row.get('name')}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
  renderSectionHeader(_, name) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{fontSize: 30}}>
          {name}
        </Text>
      </View>
    )
  }
  render() {
    return (
      <ListView
        style={{flex: 1}}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
        />
    );
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 15,
    backgroundColor: "#DDD",
  },
  row: {
    padding: 100,
    margin: 4,
    backgroundColor: '#EEE',
    borderWidth: 0.5,
    borderColor: '#159',
  },
});

AppRegistry.registerComponent('ListViewBug', () => ListViewBug);
