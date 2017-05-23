
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar'

import './index.scss'
import './static/css/styles.scss'

import store from './store'

import App from './components/App'
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


// =======
//       <div className="wrapper">
//
//         <div className="wrapper-inner">
//           <Route path="/app/sites/:id/" component={Sidebar} />
//           <div className="main-container">
//             <Switch>
//               <Route path="/app/sites/:id/" component={SidebarHeader} />
//               <Route component={Header} />
//             </Switch>
//             <div className="container-fluid">
//               <Route exact path="/" component={Signin} />
//               <Route exact path="/forgot" component={Forgot} />
//               <Route exact path="/accept-invite" component={AcceptInvite} />
//               <PrivateRoute exact path="/complete-profile" component={CompleteProfile} />
//               <PrivateRoute path="/app" component={App} />
//             </div>
//           </div>
//         </div>
// >>>>>>> c7478154317d376cfaa089781d62f9987838cc73
