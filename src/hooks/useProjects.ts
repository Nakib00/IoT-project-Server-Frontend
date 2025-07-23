import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  description: string;
  board: string;
  createdAt: string;
  updatedAt: string;
  sensorsCount: number;
  status: 'online' | 'offline' | 'error';
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
      
      // Simulate API call - replace with actual backend
      const response = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        // Demo data
        const demoProjects: Project[] = [
          {
            id: '1',
            name: 'Smart Home Sensors',
            description: 'Temperature and humidity monitoring for home automation',
            board: 'ESP32',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T15:30:00Z',
            sensorsCount: 3,
            status: 'online',
          },
          {
            id: '2',
            name: 'Garden Monitor',
            description: 'Soil moisture and light sensors for garden management',
            board: 'ESP8266',
            createdAt: '2024-01-10T08:00:00Z',
            updatedAt: '2024-01-18T12:00:00Z',
            sensorsCount: 2,
            status: 'offline',
          },
        ];
        setProjects(demoProjects);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'sensorsCount' | 'status'>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [...prev, newProject]);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        return newProject;
      } else {
        // Demo mode
        const newProject: Project = {
          id: Date.now().toString(),
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sensorsCount: 0,
          status: 'offline',
        };
        setProjects(prev => [...prev, newProject]);
        toast({
          title: "Success",
          description: "Project created successfully (Demo mode)",
        });
        return newProject;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        return updatedProject;
      } else {
        // Demo mode
        setProjects(prev => prev.map(p => 
          p.id === id 
            ? { ...p, ...projectData, updatedAt: new Date().toISOString() }
            : p
        ));
        toast({
          title: "Success",
          description: "Project updated successfully (Demo mode)",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      } else {
        // Demo mode
        setProjects(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Project deleted successfully (Demo mode)",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
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