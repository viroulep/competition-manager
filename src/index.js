import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

window.wca = window.wca || {};

window.wca.initCompetitionScheduler = (wcif, basename) => {
  ReactDOM.render(<App wcif={wcif} basename={basename} />, document.getElementById('root'));
  registerServiceWorker();
}
