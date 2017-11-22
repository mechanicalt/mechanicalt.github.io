import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Input extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(event.target.checked)
  }
  render = () => {
    return <div>
      <input type='checkbox' {...this.props} className={classnames(style.input), this.props.className} onChange={this.handleChange} />
      <label>{this.props.label}</label>
    </div>
  }
}