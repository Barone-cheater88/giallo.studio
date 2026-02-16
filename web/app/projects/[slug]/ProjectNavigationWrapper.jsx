'use client'

import ProjectNavigation from './ProjectNavigation'

export default function ProjectNavigationWrapper({ prevProject, nextProject }) {
  return (
    <ProjectNavigation 
      prevProject={prevProject} 
      nextProject={nextProject}
    />
  )
}

