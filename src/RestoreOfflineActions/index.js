import { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getItems, removeAll } from '../services/offlineActions';

import { flatten } from './utils';

const restoreActions = async (sections, dispatch) => {
  const pendingActions = await getItems();
  if (!pendingActions) return;
  const actionsToDispatch = flatten(
    sections.filter(section => section.generalCondition).map(section => section.actions)
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

  async componentDidMount() {
    const { dispatch, sections } = this.props;
    await NetInfo.fetch().then(async state => {
      if (state.isInternetReachable) {
        await restoreActions(sections, dispatch);
      }
    });
    this.setState(prevState => ({
      unsubscribe: NetInfo.addEventListener(async state => {
        if (!prevState.isConnected && state.isInternetReachable) {
          await restoreActions(sections, dispatch);
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
  sections: PropTypes.arrayOf(
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
