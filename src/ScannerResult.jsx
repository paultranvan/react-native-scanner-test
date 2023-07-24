import React, {useState, useEffect} from 'react';

import {Image, SafeAreaView, Button, StyleSheet, View} from 'react-native';
import ImageSize from 'react-native-image-size';
import {OCR} from './OCR/OCR.jsx';

export const ScannerResult = ({scannedImage}) => {
  const [startOCR, setStartOCR] = useState(false);
  const [imgSize, setImgSize] = useState(null);

  useEffect(() => {
    if (scannedImage) {
      ImageSize.getSize(scannedImage).then(size => {
        setImgSize({width: size.width, height: size.height});
      });
    }
  }, [scannedImage]);

  if (startOCR && scannedImage && imgSize) {
    return <OCR uri={scannedImage} imgSize={imgSize} />;
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
