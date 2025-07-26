import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SensorData {
  datetime: string;
  value: number;
}

export interface GraphInfo {
  title: string;
  type: string;
  maxDataPoints: number;
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface Sensor {
  id: string;
  title: string;
  typeOfPin: string;
  pinNumber: string;
  graphInfo: GraphInfo;
  createdAt: string;
  updatedAt: string;
  data: SensorData[];
}

export interface Project {
  projectId: string;
  projectName: string;
  description: string;
  developmentBoard: string;
  createdAt: string;
  updatedAt: string;
  totalsensor: number;
  token: string; 
  sensordata?: Sensor[];
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
        headers: { Authorization: `Bearer ${token}` },
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

  const fetchProject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        return data.data.project;
      } else {
        throw new Error(data.message || 'Failed to fetch project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch project",
        variant: "destructive",
      });
      return null;
    }
  };

  const createProject = async (projectData: { projectName: string; description: string; developmentBoard: string }) => {
    try {
      const userData = localStorage.getItem('iot_user');
      if (!userData) throw new Error('User not found');
      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3000/create-project/${user.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (data.success) {
        setProjects(prev => [...prev, data.data.project]);
        toast({ title: "Success", description: data.message });
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        toast({ title: "Success", description: data.message });
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setProjects(prev => prev.filter(p => p.projectId !== projectId));
        toast({ title: "Success", description: data.message });
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

  const addSensor = async (projectId: string, sensorData: { sensorName: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/add-sensor/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sensorData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
        return data.data.sensor;
      } else {
        throw new Error(data.message || 'Failed to add sensor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add sensor",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSensor = async (sensorId: string, sensorData: { title: string; typeOfPin: string; pinNumber: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/update-sensor/${sensorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sensorData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to update sensor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update sensor",
        variant: "destructive",
      });
    }
  };

  const deleteSensor = async (sensorId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/sensor/${sensorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to delete sensor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete sensor",
        variant: "destructive",
      });
    }
  };

  const updateGraphInfo = async (sensorId: string, graphData: Partial<GraphInfo>) => {
    try {
      const response = await fetch(`http://localhost:3000/update-graph-info/${sensorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(graphData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Graph info updated successfully!" });
      } else {
        throw new Error(data.message || 'Failed to update graph info');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update graph info",
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
    fetchProject,
    addSensor,
    updateSensor,
    deleteSensor,
    updateGraphInfo,
    refetch: fetchProjects,
  };
};