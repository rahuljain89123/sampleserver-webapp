
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar'

import './index.scss'
import './static/css/styles.scss'

import store from './store'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SidebarHeader from './components/SidebarHeader'
import Signin from './components/Users/Signin'
import Forgot from './components/Users/Forgot'
import AcceptInvite from './components/Users/AcceptInvite'
import CompleteProfile from './components/Users/CompleteProfile'
import App from './components/App'
import PrivateRoute from './components/Auth'


ReactDOM.render((
  <Provider store={store}>
    <Router>
      <div className="wrapper">
        <LoadingBar style={{zIndex: '100', backgroundColor: '#1FC7C8'}}/>

        <div className="wrapper-inner">
          <Route path="/app/sites/:id/" component={Sidebar} />
          <div className="main-container">
            <Switch>
              <Route path="/app/sites/:id/" component={SidebarHeader} />
              <Route component={Header} />
            </Switch>
            <div className="container-fluid">
              <Route exact path="/" component={Signin} />
              <Route exact path="/forgot" component={Forgot} />
              <Route exact path="/accept-invite" component={AcceptInvite} />
              <PrivateRoute exact path="/complete-profile" component={CompleteProfile} />
              <PrivateRoute path="/app" component={App} />
            </div>
          </div>
        </div>
      </div>
    </Router>
  </Provider>
), window.document.querySelector('#root'))
