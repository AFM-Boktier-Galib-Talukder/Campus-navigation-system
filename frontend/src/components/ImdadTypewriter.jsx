import React, { useEffect, useMemo, useRef, useState } from 'react'

// Reimagined typewriter with typing and erasing by a caret cursor
function ImdadTypewriter({
  messages = [],
  // legacy: ms per character. If provided, takes precedence over wps
  speed, 
  // hold after fully typed before erasing
  pauseMs = 300,
  // preferred: words per second typing speed (1 word ~ 5 chars)
  wps = 200,
  // optional: words per second for backspacing (defaults to wps * 1.2)
  backspaceWps,
  className = '',
  showCursor = true,
  random = true,
}) {
  const nonEmptyMessages = useMemo(
    () => messages.filter(m => typeof m === 'string' && m.trim().length > 0),
    [messages]
  )

  // Compute per-char delays
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
  const typeDelayMs = typeof speed === 'number'
    ? speed // legacy ms-per-char
    : clamp(1000 / ((wps || 100) * 5), 5, 80)
  const eraseDelayMs = typeof speed === 'number'
    ? Math.max(8, Math.floor(speed * 0.5))
    : clamp(1000 / (((backspaceWps || (wps * 2))) * 5), 5, 60)

  const [messageIndex, setMessageIndex] = useState(0)
  const [text, setText] = useState('')
  const [isErasing, setIsErasing] = useState(false)
  const timerRef = useRef(null)

  // Initialize starting message
  useEffect(() => {
    if (nonEmptyMessages.length === 0) return
    const initialIdx = random
      ? Math.floor(Math.random() * nonEmptyMessages.length)
      : 0
    setMessageIndex(initialIdx)
    setText('')
    setIsErasing(false)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [nonEmptyMessages, random])

  // Typing + erasing loop
  useEffect(() => {
    if (nonEmptyMessages.length === 0) return
    const current = nonEmptyMessages[messageIndex] || ''

    if (!isErasing && text.length < current.length) {
      // Type next character
      timerRef.current = setTimeout(() => {
        setText(current.slice(0, text.length + 1))
      }, typeDelayMs)
      return () => clearTimeout(timerRef.current)
    }

    if (!isErasing && text.length === current.length) {
      // Hold before starting to erase
      timerRef.current = setTimeout(() => setIsErasing(true), pauseMs)
      return () => clearTimeout(timerRef.current)
    }

    if (isErasing && text.length > 0) {
      // Erase character
      timerRef.current = setTimeout(() => {
        setText(current.slice(0, text.length - 1))
      }, eraseDelayMs)
      return () => clearTimeout(timerRef.current)
    }

    if (isErasing && text.length === 0) {
      // Move to next message
      let nextIdx = messageIndex
      if (random) {
        if (nonEmptyMessages.length > 1) {
          do {
            nextIdx = Math.floor(Math.random() * nonEmptyMessages.length)
          } while (nextIdx === messageIndex)
        }
      } else {
        nextIdx = (messageIndex + 1) % nonEmptyMessages.length
      }
      setMessageIndex(nextIdx)
      setIsErasing(false)
      // small pacing gap before typing starts
      timerRef.current = setTimeout(() => {
        setText('')
      }, 50)
      return () => clearTimeout(timerRef.current)
    }
  }, [text, isErasing, messageIndex, nonEmptyMessages, typeDelayMs, eraseDelayMs, pauseMs, random])

  return (
    <span className={className} aria-live="polite" aria-atomic="true" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {text}
      {showCursor && (
        <span
          className="inline-block bg-current animate-pulse"
          style={{
            width: '0.6em',
            height: '0.12em',
            transform: 'translateY(0.25em)',
            marginLeft: 0,
          }}
        />
      )}
    </span>
  )
}

export default ImdadTypewriter


