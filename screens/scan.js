import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import { StackNavigator } from "react-navigation";
import { white } from "ansi-colors";
import { BarCodeScanner, Permissions } from "expo";
import { connect } from "react-redux";

class ScanScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    val: null
  };

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.otherParam : "A Nested Details Screen",
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor
      }
    };
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }
  }
  static navigationOptions = {
    title: "Scanner",
    headerStyle: {
      backgroundColor: "#b0ed6f"
    },
    titleStyle: {
      textAlign: "center"
    }
  };
  // type : type of qrcode
  _handleBarCodeRead = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    const { state, goBack } = this.props.navigation;

    const values = data.match(
      /^otpauth:\/\/totp\/(\w+)\?secret=(\w+)&issuer=(\w*)?$/
    );

    console.log(values);

    // const [label, secret, issuer] = values.slice(1)
    if (values) {
      const val = {};

      console.log("i am in scan");

      val.token = values[0];
      val.school = values[1];
      val.war = values[2];
      val.name = values[3];

      // state.params.m(val);

      const new_list = [...this.props.list, val];

      try {
        let str = JSON.stringify(new_list);
        AsyncStorage.setItem("listing", str).then(() => {
          this.props.dispatch({
            type: "ADD_DATA",
            payload: {
              qrcode_list: new_list
            }
          });
        });
      } catch (error) {}

      goBack();
    } else {
      Alert.alert(
        "Information",
        "this QR Code doesn't match sorry :(",
        [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
        { cancelable: false }
      );
    }
  };
}

function mapStateToProps(state) {
  return {
    list: state.list_qrcode
  };
}

export default connect(mapStateToProps)(ScanScreen);
