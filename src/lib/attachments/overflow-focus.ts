import type { Attachment } from 'svelte/attachments'

export const overflowFocus: Attachment<HTMLElement> = (element) => {
  function update() {
    const horizontal = element.scrollWidth > element.clientWidth + 1
    const vertical = element.scrollHeight > element.clientHeight + 1

    element.tabIndex = horizontal || vertical ? 0 : -1
  }

  const observer = new ResizeObserver(update)
  observer.observe(element)

  for (const child of element.children) {
    observer.observe(child)
  }

  document.fonts.addEventListener('loadingdone', update)
  update()

  return () => {
    observer.disconnect()
    document.fonts.removeEventListener('loadingdone', update)
  }
}
