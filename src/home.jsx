import { memo } from 'react'
import { Form, Row, Col, Card } from 'antd'

import columnFormConfig from './config/formConfig/columnFormConfig'
import DynamicsComponent from './component/DynamicsComponent'
import {NavLink} from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>home</h1>
			<NavLink to='/tree'>TreeDemo页面</NavLink>
			<NavLink to='/collapse'>Collapse页面</NavLink>
			<NavLink to='/charts'>图表页面</NavLink>
      <Row className="" gutter={6}>
        <Col className="" span={10}>
          <Card className="" title="图表预览">
            <Form
							labelAlign="left"
              size="small"
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              {columnFormConfig.map((item) => {
                return (
                  <Form.Item label={item.label} name="username" key={item.key}>
                    <DynamicsComponent is={item.type} {...item.config} />
                  </Form.Item>
                )
              })}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(Home)
