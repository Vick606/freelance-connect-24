import React from 'react';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  budget: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, budget }) => {
  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="font-semibold">Budget: ${budget}</p>
      <Link href={`/projects/${id}`}>
        <a className="text-blue-500 hover:underline">View Details</a>
      </Link>
    </div>
  );
};

export default ProjectCard;