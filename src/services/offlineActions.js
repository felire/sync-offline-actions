import AsyncStorage from '@react-native-community/async-storage';

const ACTIONS_KEY = '@Actions:actions';
export const getItems = () =>
  AsyncStorage.getItem(ACTIONS_KEY).then(JSON.parse);

export const addItem = async (item) => {
  const actualItems = await getItems();
  const newItems =
    actualItems && actualItems !== 'null' ? [...actualItems, item] : [item];
  await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(newItems));
  return Promise.resolve(newItems);
};

export const removeAll = async () => AsyncStorage.setItem(ACTIONS_KEY, null);
