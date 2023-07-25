import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {findAttributes} from './findAttributes';

export const AttributesResultOCR = ({OCRResult, imgSize}) => {
  const [foundAttributes, setFoundAttributes] = useState(null);
  const [paperName, setPaperName] = useState(null);

  useEffect(() => {
    const runOCR = async () => {
      if (OCRResult && imgSize) {
        console.log('find matching attributes');

        const startTime = performance.now();
        const attrResult = findAttributes(
          OCRResult,
          'residencePermit',
          'back',
          imgSize,
        );
        console.log({attrResult});
        setFoundAttributes(attrResult.attributes);
        setPaperName(attrResult.paperName);
        const endTime = performance.now();

        console.log(`Found attributes took ${endTime - startTime} ms.`);
      }
    };
    runOCR();
  }, [OCRResult, imgSize]);

  if (!foundAttributes) {
    return null;
  }
  console.log('lets display attributes');
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Paper found: {paperName}</Text>
      </View>
      {foundAttributes.map((attr, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <Text style={styles.key}>{attr.name}</Text>
          <Text style={styles.value}>{attr.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
  },
  key: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
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
