import React, {useContext, useState} from 'react';
import {Picker} from '@react-native-picker/picker';

import {StyleSheet, Text, View} from 'react-native';
import {SelectedPaperContext} from '../providers/SelectPaperProvider';
import CheckBox from '@react-native-community/checkbox';

export const PaperSelection = () => {
  const {
    paperName,
    setPaperName,
    paperFace,
    setPaperFace,
    autoDetect,
    setAutoDetect,
    names,
  } = useContext(SelectedPaperContext);

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={autoDetect}
          onValueChange={newValue => setAutoDetect(newValue)}
          style={styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>Auto detect document</Text>
      </View>
      {!autoDetect && (
        <View>
          <Text style={styles.title}>Paper selection</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={paperName}
              onValueChange={name => setPaperName(name)}>
              {names.map((name, index) => (
                <Picker.Item key={index} label={name} value={name} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={paperFace}
              onValueChange={face => setPaperFace(face)}>
              <Picker.Item label="front" value="front" />
              <Picker.Item label="back" value="back" />
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  pickerContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  picker: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
  },
});
