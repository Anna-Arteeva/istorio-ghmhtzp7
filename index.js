import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Register the root component
export function App() {
  return <ExpoRoot />;
}

registerRootComponent(App);