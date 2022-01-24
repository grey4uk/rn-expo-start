import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View , Button } from 'react-native';

export default function App() {
  const [state,setState]=useState<boolean>(false);
  const tooglePress=()=>setState(!state)
  return (
    <View style={styles.container}>
      <View style={{width:'60%'}}>
      <Text style={{color:state?'red':'blue',textAlign:'center'}}>{state?'Hello, dear friend!':'The Button was pressed!'}</Text>
      </View>
      
      <Button title="CLICK ME" onPress={tooglePress}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
