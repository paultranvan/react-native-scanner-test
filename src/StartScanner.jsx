import React, { useState } from 'react'
import { Button, SafeAreaView, StyleSheet } from 'react-native'
import {Scanner} from './Scanner.jsx'

export const StartScanner = () => {
  const [newScanner, setNewScanner] = useState(false)


  console.log('start scanner');
  if (newScanner) {
    console.log('start new scanner');
    return <Scanner />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={() => {
          setNewScanner(true);
        }}
        title="Start scan"
      />
      {/* <Button
        onPress={() => {
          setOldScanner(true);
        }}
        title="Start scan (old)"
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2,
  },
});
