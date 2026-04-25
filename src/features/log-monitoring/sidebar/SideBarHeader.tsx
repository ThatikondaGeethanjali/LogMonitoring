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
      <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}
