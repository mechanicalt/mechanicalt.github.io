
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from '../../ui/Button'
import Summary from '../Summary'
import Choose from '../Choose'
import * as routerActions from '../../actions/router'
import style from './style.css'

class App extends Component {
  render () {
    const { showSummary, actions, children, goToInstructions } = this.props
    return (
      <div>
        <Button onClick={goToInstructions} className={style.instructions}>Instructions</Button>
        {
          showSummary ? <Summary /> : <Choose />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    showSummary: state.todos.showSummary
  }
}

function mapDispatchToProps (dispatch) {
  return {
    goToInstructions: () => dispatch(routerActions.goToInstructions())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
