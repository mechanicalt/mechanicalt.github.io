import React from 'react'
import classnames from 'classnames'
import style from './style.css'

export default (props)=>{
  const {className, ...otherProps} = props;
  return <button type="button" {...otherProps} className={classnames(style.button, className)} />
}