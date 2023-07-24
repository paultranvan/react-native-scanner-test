import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {findAttributes} from './findAttributes';

const Item = ({name, value}) => (
  <View style={styles.row}>
    <Text style={styles.key}>{name}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Header = ({name}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Paper found: {name}</Text>
    </View>
  );
};

export const AttributesResultOCR = ({OCRResult, imgSize}) => {
  const [foundAttributes, setFoundAttributes] = useState(null);
  const [paperName, setPaperName] = useState(null);

  useEffect(() => {
    const runOCR = async () => {
      console.log('find matching attributes');

      const startTime = performance.now();
      const attrResult = findAttributes(
        OCRResult,
        'residencePermit',
        'back',
        imgSize,
      );
      setFoundAttributes(attrResult.attributes);
      setPaperName(attrResult.paperName);
      const endTime = performance.now();

      console.log(`Found attributes took ${endTime - startTime} ms.`);
    };
    runOCR();
  }, [OCRResult, imgSize]);

  if (!foundAttributes) {
    return null;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={foundAttributes}
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
  titleView: {
    borderTopColor: 'black',
    borderTopidth: StyleSheet.hairlineWidth,
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
