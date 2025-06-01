import { ResizePanelProps } from '../model'
import { Panel, PanelHeader, Platform, usePlatform } from '@vkontakte/vkui'
import { useEffect, useRef } from 'react'
import bridge from '@vkontakte/vk-bridge'

export const ResizePanel = ({ title, children, ...props }: ResizePanelProps) => {

  const platform = usePlatform()
  const isVKCOM = platform === Platform.VKCOM

  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current) {
        const height = Math.ceil(contentRef.current.scrollHeight + 64)
        const clampedHeight = Math.min(Math.max(height, 500), 10000)

        bridge.supportsAsync('VKWebAppResizeWindow')
          .then(() => {
            bridge.send('VKWebAppResizeWindow', { width: 911, height: clampedHeight })
              .catch((error) => console.error('Resize error:', error))
          })
      }
    })

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [children])

  return (
    <Panel {...props} getRootRef={panelRef}>
      {!isVKCOM && (
        <PanelHeader
          before={props.before ? props.before : undefined}
          after={props.after ? props.after : undefined}
          fixed
        >
          {title}
        </PanelHeader>
      )}

      <div ref={contentRef}>
        {children}
      </div>
    </Panel>
  )
}