import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
const API_URL = import.meta.env.VITE_API_BASE_URL;

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

export interface Button {
    id: string;
    title: string;
    type: 'momentary' | 'toggle' | 'touch';
    pinnumber: string;
    action: string;
    // Momentary
    sendingdata?: string;
    releaseddata?: string;
    char?: string;
    // Toggle
    ondata?: string;
    offdata?: string;
    defaultState?: 'on' | 'off';
    // Touch
    sensitivity?: number;
}

export interface Signal {
    id: string;
    title: string;
    button: Button[];
}

export interface SendingSignal {
    signal: Signal[];
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
  sendingsignal?: SendingSignal[];
}

export type NewButtonPayload = Omit<Button, 'id'>;


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
      const response = await fetch(`${API_URL}/projects/${user.userId}`, {
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
      const response = await fetch(`${API_URL}/project/${projectId}`, {
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
      const response = await fetch(`${API_URL}/create-project/${user.userId}`, {
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
      const response = await fetch(`${API_URL}/update-project/${projectId}`, {
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
      const response = await fetch(`${API_URL}/project/${projectId}`, {
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
      const response = await fetch(`${API_URL}/add-sensor/${projectId}`, {
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
      const response = await fetch(`${API_URL}/update-sensor/${sensorId}`, {
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
      const response = await fetch(`${API_URL}/sensor/${sensorId}`, {
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
      const response = await fetch(`${API_URL}/update-graph-info/${sensorId}`, {
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
  
  const createSendingSignal = async (projectId: string, signalData: { title: string; buttons: NewButtonPayload[] }) => {
    try {
      const response = await fetch(`${API_URL}/create-sendingsignal/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(signalData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create sending signal');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sending signal",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSignalTitle = async (signalId: string, title: string) => {
    try {
      const response = await fetch(`${API_URL}/update-signal/${signalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to update signal title');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update signal title",
        variant: "destructive",
      });
    }
  };

  const deleteSignal = async (signalId: string) => {
    try {
      const response = await fetch(`${API_URL}/delete-signal/${signalId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to delete signal');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete signal",
        variant: "destructive",
      });
    }
  };

  const addButtonToSignal = async (signalId: string, buttonData: NewButtonPayload) => {
    try {
      const response = await fetch(`${API_URL}/signal/${signalId}/add-button`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(buttonData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to add button');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add button",
        variant: "destructive",
      });
    }
  };

  const updateButton = async (buttonId: string, buttonData: NewButtonPayload) => {
    try {
      const response = await fetch(`${API_URL}/button/${buttonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(buttonData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to update button');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update button",
        variant: "destructive",
      });
    }
  };

  const deleteButton = async (buttonId: string) => {
    try {
      const response = await fetch(`${API_URL}/button/${buttonId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
      } else {
        throw new Error(data.message || 'Failed to delete button');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete button",
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
    createSendingSignal,
    updateSignalTitle,
    deleteSignal,
    addButtonToSignal,
    updateButton,
    deleteButton,
    refetch: fetchProjects,
  };
};
