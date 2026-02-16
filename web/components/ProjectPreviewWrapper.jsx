'use client'

import { useState, useEffect } from 'react'
import ProjectPreview from './ProjectPreview'

export default function ProjectPreviewWrapper({ projects }) {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    // Solo su desktop
    if (window.innerWidth <= 890) return

    // Trova tutti i link delle righe dei progetti
    const projectRows = document.querySelectorAll('[data-project-id]')
    
    const handleMouseEnter = (e) => {
      const projectId = e.currentTarget.getAttribute('data-project-id')
      const project = projects.find(p => p._id === projectId)
      
      if (project?.coverImage?.asset?.url) {
        setHoveredProject(projectId)
        setImageUrl(project.coverImage.asset.url)
      }
    }
    
    const handleMouseLeave = () => {
      setHoveredProject(null)
      setImageUrl(null)
    }
    
    projectRows.forEach(row => {
      row.addEventListener('mouseenter', handleMouseEnter)
      row.addEventListener('mouseleave', handleMouseLeave)
    })
    
    return () => {
      projectRows.forEach(row => {
        row.removeEventListener('mouseenter', handleMouseEnter)
        row.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [projects])

  return <ProjectPreview imageUrl={imageUrl} isVisible={!!hoveredProject} />
}
