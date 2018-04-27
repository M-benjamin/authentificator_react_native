import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView
} from "react-native";
import { StackNavigator } from "react-navigation";
import { white } from "ansi-colors";
import _ from "lodash";
import { connect } from "react-redux";

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: "AUTHENTIFICATOR"
    };
  };

  async componentWillMount() {
    try {
      await AsyncStorage.getItem("listing").then(result => {
        console.log("result is ---> ", result);
        if (result) {
          let list = JSON.parse(result);

          console.log("list async lllll ->>>>", list);

          this.props.dispatch({ type: "INIT_DATA", payload: { list } });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async pushItem(list) {
    try {
      console.log("list is ", this.props.list);
      await AsyncStorage.setItem("listing", list);
    } catch (error) {
      console.log(error);
    }
  }

  _add = () => {
    // if (_.some(this.state.listing, qrcode)) {
    //   alert(`The object ${qrcode.school} already exist`);
    //   console.log("listing is ", this.state.listing);
    // } else {
    //   alert(`the object ${qrcode.school} added successefuly`);
    //   console.log("current", qrcode);
    //   // > method 1
    //   this.setState({ listing: [...this.state.listing, qrcode] }, () => {
    let list = JSON.stringify(this.props.list);
    this.pushItem(list);
    //   });
    // }
  };

  _clear = () => {
    this.props.dispatch({ type: "CLEAR_DATA" });
    // this.setState({ listing: [] });
    AsyncStorage.removeItem("listing");
    // console.log("clear is", this.state.listing);
    // if (this.state.listing.length == 0) {
    //   Alert.alert(
    //     "Message",
    //     "you don't have items to delete",
    //     [{ text: "Cancel", style: "cancel" }],
    //     { cancelable: false }
    //   );
    // } else {
    //   console.log("clear is", this.state.listing);
    //   Alert.alert(
    //     "Confirm",
    //     "Are you sure to delete these items ?",
    //     [
    //       { text: "Cancel", style: "cancel" },
    //       { text: "OK", onPress: () => this.setState({ listing: [] }) }
    //     ],
    //     { cancelable: false }
    //   );
    // }
  };

  render() {
    const list = this.props.list.map((item, id) => {
      return (
        <View key={id}>
          <Text style={styles.ListText}>
            <Text> {item.war} </Text>
            <Text> {item.school} </Text>
            <Text> {item.name} </Text>
          </Text>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => {
            this._add;
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate("Scan", {});
          }}
        >
          <Text style={styles.textAdd}> ADD </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnClear} onPress={this._clear}>
          <Text style={styles.textClear}> Clear </Text>
        </TouchableOpacity>
        <ScrollView>
          <Text>Items</Text>
          {list}
        </ScrollView>
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            fontSize: 30
          }}
        >
          This is a modal!
        </Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  btnAdd: {
    backgroundColor: "#608fdb",
    width: 300,
    height: 50,
    marginTop: 20
  },
  btnClear: {
    backgroundColor: "#ed3131",
    marginTop: 10,
    width: 300,
    height: 50
  },
  textAdd: {
    textAlign: "center",
    marginTop: 15,
    color: "#fff"
  },
  textClear: {
    textAlign: "center",
    marginTop: 15,
    color: "#fff"
  },
  ListText: {
    alignItems: "center",
    color: "#000000",
    backgroundColor: "#f99c22",

    marginTop: 10,
    padding: 10
  }
});

function mapStateToProps(state) {
  return {
    list: state.list_qrcode
  };
}

export default connect(mapStateToProps)(HomeScreen);
