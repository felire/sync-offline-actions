import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';

import { getItems, removeAll } from '../services/offlineActions';

const restoreActions = async (actions, dispatch) => {
  const pendingActions = await getItems();
  if (pendingActions.length === 0) return;
  const actionsToDispatch = actions
    .filter(action => action.generalCondition())
    .map(action => action.actions)
    .flat()
    .map(action => {
      const offlineActionsForThisAction = pendingActions.filter(
        offlineAction => action.name === offlineAction.name
      );

      return {
        ...action,
        arguments: offlineActionsForThisAction.map(offlineAction => offlineAction.data)
      };
    });
  actionsToDispatch.forEach(action => dispatch(action.associatedAction(...action.arguments)));
  await removeAll();
};

const restoreConnectionActions = (actions = []) => WrappedComponent => {
  class RestoreConnectionComponent extends Component {
    state = {
      isConnected: null,
      unsubscribe: null
    };

    componentDidMount() {
      const { dispatch } = this.props;
      NetInfo.fetch().then(state => {
        if (state.isInternetReachable) {
          restoreActions(actions, dispatch);
        }
      });
      this.setState(prevState => ({
        unsubscribe: NetInfo.addEventListener(state => {
          if (!prevState.isConnected && state.isInternetReachable) {
            restoreActions(actions, dispatch);
          }
          this.handleChange(state.isInternetReachable);
        })
      }));
    }

    componentWillUnmount() {
      this.state.unsubscribe();
    }

    handleChange = isConnected => this.setState({ isConnected });

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  const mapDispatchToProps = dispatch => ({
    dispatch
  });

  return connect(
    null,
    mapDispatchToProps
  )(RestoreConnectionComponent);
};

export default restoreConnectionActions;
