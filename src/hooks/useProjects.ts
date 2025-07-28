import { useState, useEffect } from 'react';
import { ApiService } from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    analyses: number;
  };
}

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [defaultProject, setDefaultProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const apiService = ApiService.getInstance();

  // Load projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setProjects([]);
      setDefaultProject(null);
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getProjects() as ProjectsResponse;
      setProjects(response.projects);

      // Set or create default project
      await ensureDefaultProject(response.projects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const ensureDefaultProject = async (existingProjects: Project[]) => {
    // Look for existing default project
    let defaultProj = existingProjects.find(p => p.name === 'My Analyses') || existingProjects[0];

    // If no projects exist, create a default one
    if (!defaultProj && existingProjects.length === 0) {
      try {
        const response = await apiService.createProject(
          'My Analyses', 
          'Default project for code analyses'
        ) as { project: Project };
        defaultProj = response.project;
        setProjects([defaultProj]);
      } catch (err) {
        console.error('Error creating default project:', err);
        return;
      }
    }

    setDefaultProject(defaultProj || null);
  };

  const createProject = async (name: string, description?: string) => {
    if (!isAuthenticated) return null;

    try {
      const response = await apiService.createProject(name, description) as { project: Project };
      const newProject = response.project;
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProject = async (id: number, name: string, description?: string) => {
    if (!isAuthenticated) return null;

    try {
      const response = await apiService.updateProject(id, name, description) as { project: Project };
      const updatedProject = response.project;
      
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      
      if (defaultProject?.id === id) {
        setDefaultProject(updatedProject);
      }
      
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    if (!isAuthenticated) return;

    try {
      await apiService.deleteProject(id);
      
      setProjects(prev => prev.filter(p => p.id !== id));
      
      if (defaultProject?.id === id) {
        const remainingProjects = projects.filter(p => p.id !== id);
        setDefaultProject(remainingProjects[0] || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    projects,
    defaultProject,
    isLoading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError: () => setError(null),
  };
}