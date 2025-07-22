import type React from "react"

interface MultiLineTextProps {
  text: string
  className?: string
  lines?: number
}

const MultiLineText: React.FC<MultiLineTextProps> = ({ text, className = "", lines = 3 }) => {
  return (
    <p
      className={`multi-line-paragraph ${className}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {text}
    </p>
  )
}

export default MultiLineText
