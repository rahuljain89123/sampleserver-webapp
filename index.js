
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'reactstrap'

import './index.scss'

import store from './store'
import Header from './components/Header'
import Signin from './components/Users/Signin'
import AcceptInvite from './components/Users/AcceptInvite'
import CompleteProfile from './components/Users/CompleteProfile'
import App from './components/App'
import PrivateRoute from './components/Auth'


ReactDOM.render((
    <Provider store={store}>
        <Router>
            <Container>
                <Route component={Header} />
                <Route exact path="/" component={Signin} />
                <Route exact path="/accept-invite" component={AcceptInvite} />
                <PrivateRoute exact path="/complete-profile" component={CompleteProfile} />
                <PrivateRoute path="/app" component={App} />
            </Container>
        </Router>
    </Provider>
), window.document.querySelector('#root'))
