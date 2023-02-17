import React, {useState} from 'react';

import {Image, SafeAreaView, Button, StyleSheet, View} from 'react-native';
import {OCR} from './OCR/OCR.jsx';

export const ScannerResult = ({scannedImage}) => {
  const [startOCR, setStartOCR] = useState(false);

  if (startOCR) {
    return <OCR uri={scannedImage} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{uri: scannedImage}}
        />
      </View>
      <View>
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
  imageContainer: {
    paddingLeft: 0,
    alignItems: 'center',
    height: '80%',
  },
  image: {
    width: '90%',
    height: '90%',
  },
});
