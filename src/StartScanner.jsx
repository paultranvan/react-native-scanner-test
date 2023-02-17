import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import {Scanner} from './Scanner.jsx';
import {OCR} from './OCR/OCR.jsx';

export const StartScanner = () => {
  const [newScanner, setNewScanner] = useState(false);
  const [startOCR, setStartOCR] = useState(false);

  if (newScanner) {
    return <Scanner />;
  }

  if (startOCR) {
    console.log('start OCR');
    return <OCR uri={null} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.button}>
        <Button
          onPress={() => {
            setNewScanner(true);
          }}
          title="Start scan"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => {
            setStartOCR(true);
          }}
          title="Start OCR"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    paddingBottom: 20,
  },
});
