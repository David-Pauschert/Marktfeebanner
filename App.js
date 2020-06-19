import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import MarktfeeBanner from './components/marktfeebanner.js';

export default function App() {
  return (
    <View style={styles.container}>
      
      <ScrollView scrollEventThrottle={16} horizontal={true} showsHorizontalScrollIndicator={false}>
        <MarktfeeBanner shopIndex={0} zipcode="68159"/>
        <MarktfeeBanner shopIndex={1} zipcode="68159"/>
        <MarktfeeBanner shopIndex={2} zipcode="68159"/>
        <MarktfeeBanner shopIndex={3} zipcode="68159"/>
        <MarktfeeBanner shopIndex={4} zipcode="68159"/>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200
  },
});


