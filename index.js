/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// In development, stream all uncaught errors and console.error directly to Metro terminal
if (__DEV__) {
  const forwardToTerminal = (level, message, stack) => {
    try {
      fetch('http://localhost:8081/client-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message: String(message),
          stack: stack || new Error().stack || '',
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  // 1. Capture global uncaught exceptions & fatal errors
  if (global.ErrorUtils) {
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      forwardToTerminal(
        'error',
        `${isFatal ? '[FATAL] ' : ''}${error?.message || error}`,
        error?.stack,
      );
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  // 2. Capture console.error
  const originalConsoleError = console.error;
  console.error = (...args) => {
    try {
      const msg = args
        .map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
        .join(' ');
      const errObj = args.find(a => a instanceof Error);
      forwardToTerminal('error', msg, errObj?.stack);
    } catch (_) {}
    originalConsoleError(...args);
  };

  // 3. Capture console.warn
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    try {
      const msg = args
        .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');
      forwardToTerminal('warn', msg, '');
    } catch (_) {}
    originalConsoleWarn(...args);
  };
}

AppRegistry.registerComponent(appName, () => App);
