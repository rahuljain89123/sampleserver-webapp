
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './index.scss'
import './static/css/styles.scss'

import store from './store'

import App from './components/App'
import UniversalViews from './components/UniversalViews'


ReactDOM.render((
  <Provider store={store}>
    <Router>
      <div className="index">
        <Switch>
          <Route
            path="/app"
            component={App}
          />
          <Route
            path="/"
            component={UniversalViews}
          />
        </Switch>
      </div>
    </Router>
  </Provider>
), window.document.querySelector('#root'))
