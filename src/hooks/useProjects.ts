import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  projectId: string;
  projectName: string;
  description: string;
  developmentBoard: string;
  createdAt: string;
  updatedAt: string;
  totalsensor: number;
  sensors?: Array<{
    id: string;
    title: string;
  }>;
}

export interface Sensor {
  id: string;
  projectId: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'light' | 'motion' | 'gas' | 'custom';
  pin: string;
  unit: string;
  minValue: number;
  maxValue: number;
  lastValue: number;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'error';
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      if (!token) return;
      
      const userData = localStorage.getItem('iot_user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3000/projects/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProjects(data.data.projects);
      } else {
        throw new Error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: { projectName: string; description: string; developmentBoard: string }) => {
    try {
      const userData = localStorage.getItem('iot_user');
      if (!userData) throw new Error('User not found');
      
      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3000/create-project/${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchProjects(); // Refresh the projects list
        toast({
          title: "Success",
          description: data.message,
        });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (projectId: string, projectData: { projectName?: string; description?: string; developmentBoard?: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/update-project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchProjects(); // Refresh the projects list
        toast({
          title: "Success",
          description: data.message,
        });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProjects(prev => prev.filter(p => p.projectId !== projectId));
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};