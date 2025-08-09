import React, { useEffect, useMemo, useRef, useState } from 'react'

function ImdadTypewriter({
  messages = [],
  speed = 100,
  pauseMs = 8000,
  className = '',
  showCursor = true,
  random = true,
}) {
  const nonEmptyMessages = useMemo(
    () => messages.filter(m => typeof m === 'string' && m.trim().length > 0),
    [messages]
  )

  const [messageIndex, setMessageIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  const pauseTimerRef = useRef(null)

  // Pick initial message
  useEffect(() => {
    if (nonEmptyMessages.length === 0) return
    if (random) {
      const idx = Math.floor(Math.random() * nonEmptyMessages.length)
      setMessageIndex(idx)
    } else {
      setMessageIndex(0)
    }
    setDisplayText('')
    setCharIndex(0)
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [nonEmptyMessages, random])

  // Typewriter effect
  useEffect(() => {
    if (nonEmptyMessages.length === 0) return
    const full = nonEmptyMessages[messageIndex] || ''
    if (charIndex < full.length) {
      const t = setTimeout(() => {
        setDisplayText(prev => prev + full[charIndex])
        setCharIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(t)
    }
    // Completed the current message; wait then move to next
    pauseTimerRef.current = setTimeout(() => {
      let nextIdx = messageIndex
      if (random) {
        // Try to pick a different index if possible
        if (nonEmptyMessages.length > 1) {
          do {
            nextIdx = Math.floor(Math.random() * nonEmptyMessages.length)
          } while (nextIdx === messageIndex)
        }
      } else {
        nextIdx = (messageIndex + 1) % nonEmptyMessages.length
      }
      setMessageIndex(nextIdx)
      setDisplayText('')
      setCharIndex(0)
    }, pauseMs)
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [charIndex, messageIndex, nonEmptyMessages, speed, pauseMs, random])

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default ImdadTypewriter


