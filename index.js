import { AppRegistry, TextInput, Text } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import { subscribeLocation } from './src/utils/Location';

const Main = () => {
  return (
    <App />
  );
};

AppRegistry.registerComponent(appName, () => Main);
AppRegistry.registerHeadlessTask('SomeTaskName', () => MyTask);

async function MyTask(taskData) {
  // Handle the data passed from the Native Service
  console.log('Data received in Headless JS:', taskData);
  subscribeLocation()
}


export default MyTask;