
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import Root from './containers/Root'
import App from './containers/App'
import Summary from './containers/Summary'
import Choose from './containers/Choose'
import Instructions from './containers/Instructions'
import configure from './store'
import $ from 'jquery'
import qs from 'query-string'


const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

const iframeUrl = document.location.search
// const iframeUrl = 'assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3PMR2DOWOO1I4L1Q0AABZ4DXY1445T'
const params = qs.parse(iframeUrl)
console.log('params', params)

const actionUrl = $('#mturk_form').attr('action')

$('#mturk_form').attr('action', `${actionUrl}&${qs.stringify(params)}`)

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)
