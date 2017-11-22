import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Input extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(event.target.value)
  }
  render = () => {
    return <input type="text" {...this.props} className={classnames(style.input), this.props.className} onChange={this.handleChange} />
  }
}