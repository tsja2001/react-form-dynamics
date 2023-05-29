import { memo } from 'react'
import { Collapse, Form, Switch } from 'antd'
import style from './Collapse.module.scss'
import { Input } from 'antd'

const CollapseDemo = () => {
  const onChange = (key) => {
    console.log(key)
  }

  const [form] = Form.useForm()
  const formChangeHandler = (e) => {
		console.log(e)
  }



  return (
    <div>
      <Form form={form} onChange={formChangeHandler}>
        <Collapse defaultActiveKey={['1']} onChange={onChange}>
          <Collapse.Panel
            header="This is panel header 1"
            key="1"
            extra={
              <Form.Item
                className={style.form_item}
                name={['title', 'visible']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            }
          >
            <Form.Item label="标题" className={style.form_item} name={['title', 'text']}>
              <Input />
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel
            header="This is panel header 2"
            key="2"
            showArrow={false}
          >
            <p>text</p>
          </Collapse.Panel>
          <Collapse.Panel header="This is panel header 3" key="3">
            <p>text</p>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </div>
  )
}

export default memo(CollapseDemo)
