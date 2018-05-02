import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

window.wca = window.wca || {};

window.wca.initCompetitionScheduler = (wcif) => {
  ReactDOM.render(<App wcif={wcif} />, document.getElementById('root'));
  registerServiceWorker();
}
