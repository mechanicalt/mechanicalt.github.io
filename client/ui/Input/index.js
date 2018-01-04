import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default class Input extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(event.target.value)
  }
  render = () => {
    const input = <input type="text" {...this.props} className={classnames(style.input, this.props.className)} onChange={this.handleChange} />
    return <span>
      {input}
      {this.props.error && <div className={style.error}>{this.props.error}</div>}
    </span>
  }
}
