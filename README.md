![versión npm](https://img.shields.io/npm/v/sync-offline-actions.svg?color=68d5f7)
![Download npm](https://img.shields.io/npm/dw/sync-offline-actions.svg?color=7551bb)

# sync-offline-actions

This is a library created to handle synchronizations with backend. Imagine that some action is dispatched and in that moment you didn't have internet, with this library you will be able to catch that ocurrency, save the information related to the action and dispatch it again when the connection is being restored.
The best part of this, it's that this library is very easy of using.

## Getting started

### Requirements

`redux`

`react-redux`

`@react-native-community/netinfo` -> You will have to install this library before, here are the steps: [Net Info](https://github.com/react-native-community/react-native-netinfo)

### Install the library

```
yarn add sync-offline-actions
```

or npm:

```
npm install --save sync-offline-actions
```

## How to use it

We provide four tools so you can handle the behaviour of your project. Those are:

#### RestoreOfflineActions

This is a component, that you will have to use in the root of your project. It's totally necessary that you use this component in the root of your project because it has to exist in a component that it's always alive.
This component will have to wrap the other components you have in the root of your project, for example:

```javascript
import { RestoreOfflineActions } from 'sync-offline-actions';
import actions from '@redux/some/actions';

// Some stuff

// Render/return
    <RestoreOfflineActions
      sections={[
        { generalCondition: /* Condition of something */, actions: { name: 'login', associatedAction: actions.login } }
      ]}>
        <AppNavigator />
  </RestoreOfflineActions>
```

The prop `sections` is totally obligatory to use this. Let's see the structure:

You will pass an array of Sections of your app. Each section could have multiple actions that you want to dispatch if they have happened.
For example, imagine that I want to set some actions for the section of `Authorization` of my app and some actions for the section of `App`.
I will set the condition for each section in the `generalCondition` value. I will have an array like this:

```
sections={[
   { generalCondition: /* Condition to know if the user is not logged in */, actions: [{ name: 'someAction', associatedAction: actions.someAction }] },
   { generalCondition: /* Condition to know if the user is logged in */, actions: [{ name: 'otherAction', associatedAction: actions.otherAction }, {name: 'otherAction2', associatedAction: actions.otherAction2 }] }
]}

```

Each section has actions associated. Every action will have a `name` (We will see the importance of this name later) and an `associatedAction`, this last one will be the action you want to dispatch when the connection is restored.

#### saveActionToBeSync

This is a function to save the moments, actions or ocurrencys that will be dispatched later. Here are some examples of using:

```javascript
// actions.js

import { saveActionToBeSync } from 'sync-offline-actions';

// Some code

// Imagine that you have an action and that action which send a request to back, that action will fail and you will want to save that request to do it later. You will do

saveActionToBeSync('someAction', [arg1, arg2, arg3]);

//Thunk Action example

function myThunkActionCreator(id, someValue) {
 return async (dispatch, getState) => {
  dispatch({type : "REQUEST_STARTED"};
  let response;
  try {
      response = myAjaxLib.post("/someEndpoint", {id, data: someValue});
  } catch(error) {
      saveActionToBeSync('someThunkAction', [id, someValue]); // here we register the failed event that want to dispatch when the connection is restored
      dispatch({type : "REQUEST_FAILED", error});
  }
  dispatch({type: "REQUEST_SUCCEEDED", payload: response});
 }
}

// redux-recompose example

login: (authData: AuthData) => ({
    type: actions.LOGIN,
    target: TARGETS.CURRENT_USER,
    service: AuthService.login,
    payload: authData,
    successSelector: () => null,
    injections: [
      withPostFailure(() => {
        //Check the reason of the failure
        saveActionToBeSync('login', [authData]);
      })
    ]
  }),

```

The first argument of the method will be the name you used before to declare the actions of the sections in `RestoreOfflineActions` component.
The second argument will be an array of `arguments`, when the connection be restored, the `associatedAction` associated to the `name` of the first argument will be called with the list of arguments of the second argument. It's more simple than it looks.

### More tools

This tools are a plus for this library, but they are not related with the real functionality of this, they could help you to make your work easier.

#### withNetInfo

This is a HOC to ask for the state of the connection. Here is an example of using:

```javascript
import { withNetInfo } from "sync-offline-actions";

class SomeComponent extends Component {
  /*some code*/
  someMethod = () => {
    const { isConnected } = this.props;
    /*Do something*/
  };
}

export default withNetInfo(SomeComponent);
```

The prop `isConnected` will be injected as a prop of `SomeComponent` because of the HOC withNetInfo, the prop will be updated with the network changes.

#### useNetInfo

This is a CustomHook with the same functionality of `withNetInfo`, example of using:

```javascript
import { useNetInfo } from "sync-offline-actions";

const SomeFunction = () => {
  const isConnected = useNetInfo();
  // More of the function
};
```

Then, isConnected will be updated with the last changes of the connection.

## Thanks to

The people of `@react-native-community/netinfo`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## About

This project was created by [Felipe Rodriguez Esturo](https://github.com/felire). It is mantained by:

<a href="https://github.com/felire"><img src="https://avatars3.githubusercontent.com/u/11776795?s=460&v=4" title="felire" width="80" height="80"></a>

## License

**sync-offline-actions** is available under the MIT [license](LICENSE).

    Copyright (c) 2020 Felipe Rodriguez Esturo <felipe.rodriguez@wolox.com.ar>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
