import { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getItems, removeAll } from '../services/offlineActions';

import { flatten } from './utils';

const restoreActions = async (actions, dispatch) => {
  const pendingActions = await getItems();
  if (!pendingActions) return;
  const actionsToDispatch = flatten(
    actions.filter(action => action.generalCondition).map(action => action.actions)
  ).map(action => {
    const offlineActionsForThisAction = pendingActions.filter(
      offlineAction => action.name === offlineAction.name
    );
    return {
      ...action,
      arguments: offlineActionsForThisAction.map(offlineAction => offlineAction.data)
    };
  });
  actionsToDispatch.forEach(action => {
    action.arguments.forEach(argumentsList => dispatch(action.associatedAction(...argumentsList)));
  });
  await removeAll();
};

class RestoreConnectionComponent extends Component {
  state = {
    isConnected: null,
    unsubscribe: null
  };

  componentDidMount() {
    const { dispatch, actions } = this.props;
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
    const { children } = this.props;
    return { ...children };
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  null,
  mapDispatchToProps
)(RestoreConnectionComponent);

RestoreConnectionComponent.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      generalCondition: PropTypes.bool.isRequired,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          associatedAction: PropTypes.func.isRequired
        })
      )
    })
  )
};
