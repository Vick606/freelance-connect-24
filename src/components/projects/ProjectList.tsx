import React from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default ProjectList;