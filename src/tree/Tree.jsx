import { memo, useState } from 'react'
import { Tree, Form } from 'antd'
import style from './Tree.module.scss'
// import areaTreeConfig from '../config/chartAllConfig/areaTreeConfig'

const TreeDemo = () => {
  const [form] = Form.useForm()


  const fieldChangeHandler = (changedFields, allFields) => {
    console.log('allFields', allFields)

    // 当一个根节点的switch切换为false时(visible=false), 禁用整个根节点下的所有子节点
  }

  // 如果用户

  return (
    <div className={style.content}>
      <Form form={form} onValuesChange={fieldChangeHandler}>
        <Tree
          defaultExpandAll={true}
          autoExpandParent={true}
          // treeData={areaTreeConfig}
          blockNode
        />
      </Form>
    </div>
  )
}

export default memo(TreeDemo)
