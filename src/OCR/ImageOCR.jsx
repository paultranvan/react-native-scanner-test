import React, {useRef, useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import RNFS from 'react-native-fs';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';

const mimeMap = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
};

export const ImageOCR = ({
  OCRResult,
  imgURI,
  originalWidth,
  originalHeight,
}) => {
  const ref = useRef(null);
  const [imgBase64, setImgBase64] = useState(null);

  useEffect(() => {
    if (imgURI) {
      // The base64 is required because the canvas lib does not seem to handle
      // image in storage path
      // https://github.com/iddan/react-native-canvas/issues/78
      RNFS.readFile(imgURI, 'base64').then(res => {
        const ext = imgURI.split('.').slice(-1)[0];
        setImgBase64(`data:${mimeMap[ext]};base64,` + res);
      });
    }
  }, [imgURI]);

  useEffect(() => {
    if (ref.current && imgURI && imgBase64 && OCRResult) {
      const canvas = ref.current;

      const imageRatio = originalHeight / originalWidth;
      canvas.width = Dimensions.get('window').width;
      canvas.height = canvas.width * imageRatio;
      const image = new CanvasImage(ref.current, canvas.height, canvas.width);
      image.src = imgBase64;

      const ctx = ref.current.getContext('2d');

      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        for (const block of OCRResult) {
          console.log('block : ', block);
          const x = (block.bounding.left * canvas.width) / originalWidth - 2;
          const y = (block.bounding.top * canvas.height) / originalHeight - 2;
          const width =
            (block.bounding.width * canvas.width) / originalWidth + 4;
          const height =
            (block.bounding.height * canvas.height) / originalHeight + 4;
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'green';
          ctx.strokeRect(x, y, width, height);
        }
      });
    }
  }, [ref, imgURI, imgBase64, OCRResult, originalHeight, originalWidth]);

  if (!imgURI || !imgBase64 || !originalWidth || !originalHeight) {
    return null;
  }

  return <Canvas ref={ref} />;
};
