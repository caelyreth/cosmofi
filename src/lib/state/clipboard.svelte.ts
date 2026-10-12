export type ClipboardStatus = 'idle' | 'copying' | 'copied' | 'error'

interface ClipboardResult {
  readonly value: string
  readonly status: Exclude<ClipboardStatus, 'idle'>
}

export function createClipboard(value: () => string) {
  let result = $state<ClipboardResult>()
  let request = 0
  let disposed = false

  const status = $derived<ClipboardStatus>(
    result && result.value === value() ? result.status : 'idle',
  )

  $effect(() => {
    if (result?.status !== 'copied' && result?.status !== 'error') {
      return
    }

    const timer = setTimeout(() => {
      result = undefined
    }, 2400)

    return () => clearTimeout(timer)
  })

  $effect(() => {
    return () => {
      disposed = true
      request += 1
    }
  })

  async function copy() {
    const copiedValue = value()
    const currentRequest = ++request

    result = { value: copiedValue, status: 'copying' }

    try {
      await navigator.clipboard.writeText(copiedValue)

      if (!disposed && currentRequest === request) {
        result = { value: copiedValue, status: 'copied' }
      }
    } catch {
      if (!disposed && currentRequest === request) {
        result = { value: copiedValue, status: 'error' }
      }
    }
  }

  return {
    get status() {
      return status
    },
    copy,
  }
}
