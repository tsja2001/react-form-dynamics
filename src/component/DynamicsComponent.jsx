/* eslint-disable react/prop-types */
import { memo } from 'react'

import { Input, Switch } from 'antd'

const DynamicsComponent = (props) => {
  const { is, children, ...rest } = props

  if (is === 'Input') {
    return <Input {...rest}>{children}</Input>
  } else if (is === 'Switch') {
    return <Switch {...rest}>{children}</Switch>
  }
}

export default memo(DynamicsComponent)
