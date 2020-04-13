
# react-native-sync-offline-actions

## Getting started

`$ npm install react-native-sync-offline-actions --save`

### Mostly automatic installation

`$ react-native link react-native-sync-offline-actions`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-sync-offline-actions` and add `RNSyncOfflineActions.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNSyncOfflineActions.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSyncOfflineActionsPackage;` to the imports at the top of the file
  - Add `new RNSyncOfflineActionsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-sync-offline-actions'
  	project(':react-native-sync-offline-actions').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-sync-offline-actions/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-sync-offline-actions')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNSyncOfflineActions.sln` in `node_modules/react-native-sync-offline-actions/windows/RNSyncOfflineActions.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Sync.Offline.Actions.RNSyncOfflineActions;` to the usings at the top of the file
  - Add `new RNSyncOfflineActionsPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNSyncOfflineActions from 'react-native-sync-offline-actions';

// TODO: What to do with the module?
RNSyncOfflineActions;
```
  