import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {OCR} from './OCR';

export const ImageGalleryPicker = () => {
  const [imgURI, setImgURI] = useState(null);
  const [imgSize, setImgSize] = useState(null);

  const processImageResponse = async response => {
    if (!response.assets || response.assets.length < 1) {
      throw new Error('No image in response');
    }
    try {
      const img = response.assets[0];
      setImgURI(img.uri);
      setImgSize({width: img.width, height: img.height});
    } catch (e) {
      console.error(e);
    }
  };

  const getFromGallery = async () => {
    return launchImageLibrary(
      {
        mediaType: 'photo',
      },
      async response => {
        await processImageResponse(response);
      },
    );
  };

  if (!imgURI) {
    getFromGallery();
  }

  if (imgURI && imgSize) {
    return <OCR uri={imgURI} imgSize={imgSize} />;
  }
  return null;
};
