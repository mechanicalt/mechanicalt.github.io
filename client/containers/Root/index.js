import React from 'react'
import {connect} from 'react-redux'
import Instructions from '../Instructions'
import Ethics from '../Ethics'
import App from '../App'

const Root = (props)=>{
  switch(props.view){
    case 'ethics':
      return <Ethics />
    case 'instructions':
      return <Instructions />
    default:
      return <App />
  }
}

const mapStateToProps = (state)=>({
  view: state.todos.view,
})

export default connect(mapStateToProps)(Root)