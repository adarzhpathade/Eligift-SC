"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure hydration matches by only rendering after mount
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 flex items-center justify-center shrink-0" />
  }

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark"
    const nextTheme = isDark ? "light" : "dark"

    if (!document.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
      })
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 400,
          easing: isDark ? "cubic-bezier(0.0, 0.0, 0.2, 1)" : "cubic-bezier(0.4, 0.0, 1, 1)",
          fill: "forwards",
          pseudoElement: isDark 
            ? "::view-transition-new(root)" 
            : "::view-transition-old(root)",
        }
      )
    })
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full text-foreground hover:bg-foreground/5 transition-colors shrink-0"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-[24px]">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  )
}
