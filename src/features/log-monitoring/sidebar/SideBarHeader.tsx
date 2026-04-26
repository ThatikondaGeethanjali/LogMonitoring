/**
 * Header component with title and description
 */

import React from "react"

interface SideBarHeaderProps {
  title: string
  description: string
}

export const SideBarHeader: React.FC<SideBarHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-4 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
