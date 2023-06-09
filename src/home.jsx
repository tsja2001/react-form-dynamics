import { memo } from 'react'
import { Form, Row, Col, Card } from 'antd'

import columnFormConfig from './config/formConfig/columnFormConfig'
import DynamicsComponent from './component/DynamicsComponent'
import { NavLink } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1 className="text-xl font-medium text-black">home</h1>
      <h3>
        <NavLink to="/tree">TreeDemo页面</NavLink>
      </h3>
      <h3>
        <NavLink to="/collapse">Collapse页面</NavLink>
      </h3>
      <h3>
        <NavLink to="/charts">图表页面</NavLink>
      </h3>
      <h3>
        <NavLink to="/dnd">拖拽页面</NavLink>
      </h3>
      <h3>
        <NavLink to="/grid2">第二版拖拽</NavLink>
      </h3>
      <h3>
        <NavLink to="/myChart">手动实现拖拽</NavLink>
      </h3>
      <h3>
        <NavLink to="/grid">网格布局+拖拽缩放</NavLink>
      </h3>
      <h3>
        <NavLink to="/dndV2">dndV2</NavLink>
      </h3>
      <h3>
        <NavLink to="/dndV3">dndV3</NavLink>
      </h3>
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
