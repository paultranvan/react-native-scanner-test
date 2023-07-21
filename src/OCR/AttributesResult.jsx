import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

const Item = ({name, value}) => (
  <View style={styles.row}>
    <Text style={styles.key}>{name}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Header = ({name}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{name}</Text>
    </View>
  );
};

export const AttributesResult = ({paperName, attributes}) => {
  if (!attributes) {
    return null;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={attributes}
        renderItem={({item}) => <Item name={item.name} value={item.value} />}
        ListHeaderComponent={<Header name={paperName} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  key: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    flex: 1.5,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
