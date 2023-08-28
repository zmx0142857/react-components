import { useRef } from 'react';
import type { FC, MutableRefObject, ReactNode } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { between } from '@/utils';
import './index.less';

type DragWindowProps = {
  className?: string
  title?: string
  children?: ReactNode
  container?: MutableRefObject<HTMLElement | null>
  onClose?: () => void
}

/**
 * 可拖动的窗口
 */
const DragWindow: FC<DragWindowProps> = ({ className, title, children, container, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return
    const c = container?.current || document.body;
    const { clientX, clientY } = e;
    const { offsetLeft, offsetTop } = ref.current;
    const maxX = c.offsetWidth - 50;
    const maxY = c.offsetHeight - 50;
    const onMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const dx = e.clientX - clientX;
      const dy = e.clientY - clientY;
      ref.current.style.left = between(offsetLeft + dx, 0, maxX) + 'px';
      ref.current.style.top = between(offsetTop + dy, 0, maxY) + 'px';
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  return (
    <div className={classnames('c-drag-window', className)} ref={ref}>
      <div className="c-drag-window-header" onMouseDown={onMouseDown}>
        {title}
        <CloseOutlined className="c-drag-window-close" onClick={onClose} />
      </div>
      <div className="c-drag-window-body">
        {children}
      </div>
    </div>
  )
}

export default DragWindow;