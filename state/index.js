/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// question: how to remodel index.js similar to ReactJS's index.js?
// console: Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: <Provider />. Did you accidentally export a JSX literal instead of a component?

AppRegistry.registerComponent(appName, () => App);
