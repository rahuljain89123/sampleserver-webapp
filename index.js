
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'reactstrap'

import './index.scss'

import store from './store'
import Header from './components/Header'
import Signin from './components/Signin'
import AcceptInvite from './components/AcceptInvite'
import App from './components/App'
import PrivateRoute from './components/Auth'
import Homepage from './components/Homepage'


ReactDOM.render((
    <Provider store={store}>
        <Router>
            <Container>
                <Route component={Header} />
                <Route exact path="/" component={Homepage} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/accept-invite" component={AcceptInvite} />
                <PrivateRoute path="/app" component={App} />
            </Container>
        </Router>
    </Provider>
), window.document.querySelector('#root'))
