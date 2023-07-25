import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export const TextOCR = ({OCRResult}) => {
  if (OCRResult?.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>OCR raw result</Text>
        </View>
        {OCRResult?.map(block => {
          return block.lines.map(line => {
            return <Text>{line.text}</Text>;
          });
        })}
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
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
