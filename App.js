import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation";
import { white } from "ansi-colors";
import HomeScreen from "./screens/home";
import ScanScreen from "./screens/scan";
import { Provider } from "react-redux";
import { createStore } from "redux";

// > Declare store
// > Set an initilal state
const initial_state = {
  list_qrcode: []
};

// > my reducer for assign my data
function reducer(prevState = initial_state, action) {
  switch (action.type) {
    case "ADD_DATA":
      return Object.assign({}, prevState, {
        list_qrcode: action.payload.qrcode_list
      });
    case "CLEAR_DATA":
      return Object.assign({}, prevState, {
        list_qrcode: []
      });
    case "INIT_DATA":
      return Object.assign({}, prevState, {
        list_qrcode: action.payload.list
      });

    default:
      return prevState;
  }
}

const store = createStore(reducer);

console.disableYellowBox = true;
const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen
  },
  Scan: {
    screen: ScanScreen
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}
