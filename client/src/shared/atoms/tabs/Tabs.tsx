import React from 'react'
import { Tabs as RsuiteTabs, TabsProps } from 'rsuite'
import './tabs.scss'

interface Props extends TabsProps {
  children: React.ReactNode;
  multiColor?: boolean;
}
interface TabsComponent
  extends React.ForwardRefExoticComponent<
    Props & React.RefAttributes<HTMLAnchorElement>
  > {
  Tab: typeof RsuiteTabs.Tab;
}
const Tabs = React.forwardRef<HTMLAnchorElement, Props>(
  ({ children, multiColor, ...rest }: Props, ref) => {
    let { className = '' } = rest
    if (multiColor) {
      className += ' multi-color'
    }
    return (
      <RsuiteTabs
        defaultActiveKey="1"
        appearance="subtle"
        ref={ref}
        className={className}
        {...rest}
      >
        {children}
      </RsuiteTabs>
    )
  }
) as TabsComponent
Tabs.displayName = 'Tabs'
Tabs.Tab = RsuiteTabs.Tab
export default Tabs
