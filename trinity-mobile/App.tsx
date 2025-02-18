import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { RootNavigator } from '@navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
