import { memo, useEffect } from 'react'
import { Tree, Form, Input, Switch } from 'antd'
import style from './Tree.module.scss'
import TreeNode from './treeNode/TreeNode'
import areaTreeConfig from '../config/chartAllConfig/areaTreeConfig'

const treeData = [
  {
    title: (
      <TreeNode
        label="显示标题"
        name={['showTitle', 'value']}
        valuePropName="checked"
      >
        <Switch />
      </TreeNode>
    ),
    key: '1',
    children: [
      {
        title: (
          <TreeNode label="标题内容" name="title">
            <Input />
          </TreeNode>
        ),
        key: '1-0',
      },
    ],
  },
  {
    title: (
      <TreeNode label="X轴" name="x" valuePropName="checked">
        <Switch />
      </TreeNode>
    ),
    key: '2',
    children: [
      {
        title: (
          <TreeNode label="轴线" name="line">
            <Input />
          </TreeNode>
        ),
        key: '2-0',
      },
    ],
  },
]

const TreeDemo = () => {
  const [form] = Form.useForm()

  const fieldChangeHandler = (changedFields, allFields) => {
    console.log(changedFields)
    console.log(allFields)
  }

  return (
    <div className={style.content}>
      <Form form={form} onValuesChange={fieldChangeHandler}>
        <Tree treeData={areaTreeConfig} blockNode />
      </Form>
    </div>
  )
}

export default memo(TreeDemo)
