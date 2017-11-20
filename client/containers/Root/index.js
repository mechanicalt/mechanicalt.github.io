import React from 'react'
import {connect} from 'react-redux'
import Instructions from '../Instructions'
import App from '../App'

const Root = (props)=>{
  return props.view === 'instructions' ? <Instructions /> : <App />
}

const mapStateToProps = (state)=>({
  view: state.todos.view,
})

export default connect(mapStateToProps)(Root)