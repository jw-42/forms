import { ScrollCellProps } from "./types"

const ScrollCellStyles = {
  width: 220,
  height: 124,
  borderRadius: 4,
  boxSizing: 'border-box' as const,
  backgroundColor: 'var(--vkui--color_background_secondary)',
  border: 'var(--vkui--size_border--regular) solid var(--vkui--color_image_border_alpha)',
  objectFit: 'cover' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  display: 'flex' as const,
}

export const ScrollCell = (props: ScrollCellProps) => {
  return (
    <div style={ScrollCellStyles}>
      {props.children}
    </div>
  )
}