import { FC } from 'react';
import { Collapse } from 'antd';
import componentDict from './componentDict';
import './index.less';

type DatGuiItem = {
  name: string
  label: string
  type: string
}

type DatGuiPanel = {
  name: string
  label: string
  extra?: DatGuiItem[]
  children?: DatGuiItem[]
}

type DatGuiProps = {
  panels?: DatGuiPanel[]
  items?: DatGuiItem[]
}

/**
 * 可折叠设置面板组件
 */
const DatGui: FC<DatGuiProps> = ({ panels, items }) => {

  const handleProps = (item: DatGuiItem, props: any): FC | null => {
    const V = componentDict[item.type];
    if (!V) {
      console.error('invalid component type', item.type)
      return null
    }
    // 某些 antd 组件使用的不是 value 字段而是 checked 字段, 这里作判断
    if (V.valuePropName && V.valuePropName !== 'value') {
      props[V.valuePropName] = props.value;
      delete props.value;
    }
    return V.component || null;
  }

  const renderItem = (item: DatGuiItem) => {
    if (!item) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, label, type, ...props } = item;
    const Component = handleProps(item, props);
    return Component && (
      <div className="c-datgui-item" key={name}>
        <span className="c-datgui-item-label">{label}</span>
        <Component {...props} />
      </div>
    )
  }

  const renderExtra = (item: DatGuiItem) => {
    if (!item) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, label, type, ...props } = item;
    const Component = handleProps(item, props);
    return Component && <Component key={name} {...props} />
  }

  return (
    <div className="c-datgui">
      <Collapse
        items={panels?.filter(Boolean)?.map(panel => ({
          key: panel.name,
          label: panel.label,
          extra: panel.extra?.map(renderExtra),
          children: panel.children?.map(renderItem),
        }))}
      />
      {items?.map(renderItem)}
    </div>
  )
}

export default DatGui;