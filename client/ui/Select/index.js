import React from 'react'
import classnames from 'classnames'
// import style from './style.css'

export default class Input extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(event.target.value)
  }
  render = () => {
    return (<select value={this.props.value} onChange={this.handleChange}>
      {
        this.props.options.map(o => <option value={o.value}>{o.label}</option>)
      }
    </select>)
  }
}
