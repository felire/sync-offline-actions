import React, { Component } from "react";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";

const restoreConnectionActions = (actions = []) => (WrappedComponent) => {
  class RestoreConnectionComponent extends Component {
    state = {
      isConnected: null,
      unsubscribe: null,
    };

    componentDidMount() {
      const { dispatch } = this.props;
      this.setState((prevState) => ({
        unsubscribe: NetInfo.addEventListener((state) => {
          if (!prevState.isConnected && state.isInternetReachable) {
            actions.forEach((action) =>
              action(state.isInternetReachable)(dispatch)
            );
          }
          this.handleChange(state.isInternetReachable);
        }),
      }));
    }

    componentWillUnmount() {
      this.state.unsubscribe();
    }

    handleChange = (isConnected) => this.setState({ isConnected });

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  const mapDispatchToProps = (dispatch) => ({
    dispatch,
  });

  return connect(null, mapDispatchToProps)(RestoreConnectionComponent);
};
