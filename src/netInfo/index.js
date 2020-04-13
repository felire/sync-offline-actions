import React, { Component, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const withNetInfo = (WrappedComponent) => {
  class NetInfoComponent extends Component {
    state = {
      isConnected: null,
      unsubscribe: null,
    };

    componentDidMount() {
      this.setState({
        unsubscribe: NetInfo.addEventListener((state) => {
          this.handleChange(state.isInternetReachable);
        }),
      });
    }

    componentWillUnmount() {
      this.state.unsubscribe();
    }

    handleChange = (isConnected) => this.setState({ isConnected });

    render() {
      return (
        <WrappedComponent
          isConnected={this.state.isConnected}
          {...this.props}
        />
      );
    }
  }
  return NetInfoComponent;
};

export function netInfo(friendID) {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isInternetReachable);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
}
