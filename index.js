
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar'

import './index.scss'
import './static/css/styles.scss'

import store from './store'

import App from './components/App/App'
import UniversalViews from './components/UniversalViews'


ReactDOM.render((
  <Provider store={store}>
    <Router>
      <div className="index">
        <LoadingBar style={{zIndex: '100', backgroundColor: '#1FC7C8'}}/>

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
