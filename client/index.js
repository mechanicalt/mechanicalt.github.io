
import { IndexRoute, Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import App from './containers/App'
import Summary from './containers/Summary'
import Choose from './containers/Choose'
import Instructions from './containers/Instructions'
import configure from './store'

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Instructions} />
      <Route path="/game" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
