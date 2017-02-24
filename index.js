
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './index.scss'

import store from './store'
import Header from './components/Header'
import Signin from './components/Signin'
import App from './components/App'
import PrivateRoute from './components/Auth'

const Blank = () => <div />

ReactDOM.render((
    <Provider store={store}>
        <Router>
            <div className="container">
                <Route component={Header} />
                <Route exact path="/" component={Blank} />
                <Route exact path="/signin" component={Signin} />
                <PrivateRoute path="/app" component={App} />
            </div>
        </Router>
    </Provider>
), window.document.querySelector('#root'))
