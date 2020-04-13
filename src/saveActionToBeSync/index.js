import { addItem } from '../services/offlineActions';

const saveActionToBeSync = (name, data) => addItem({ name, data });

export default saveActionToBeSync;
