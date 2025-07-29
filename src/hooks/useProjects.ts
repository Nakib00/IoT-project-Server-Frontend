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
    sendingdata?: string[];
    releaseddata?: string;
    char?: string;
    ondata?: string;
    offdata?: string;
    defaultState?: 'on' | 'off';
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

export interface CombinedSensorGraph {
  id: string;
  title: string;
  sensors: { sensorid: string; sensorTitle: string }[];
  convinegraphInfo: GraphInfo;
}

export interface AverageData {
  sensorId: string;
  title: string;
  average: number;
  dataPointCount: number;
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
  convinesensorgraph?: CombinedSensorGraph[];
}

export interface NewSignalButtonPayload {
  title: string;
  type: 'momentary' | 'toggle' | 'touch';
  pinnumber: string;
  sendingdata: string[];
  releaseddata: string;
}

export interface NewSignalPayload {
  title: string;
  buttons: NewSignalButtonPayload[];
}


export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { toast } = useToast();

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.message || 'An API error occurred.');
    }
    return data;
  };


  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!user?.userId) return;
      const data = await apiFetch(`/projects/${user.userId}`);
      setProjects(data.data.projects);
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
      const data = await apiFetch(`/project/${projectId}`);
      return data.data.project;
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
        if (!user?.userId) throw new Error('User not found');
        const data = await apiFetch(`/create-project/${user.userId}`, {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
        setProjects(prev => [...prev, data.data.project]);
        toast({ title: "Success", description: data.message });
        return data.data;
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
        const data = await apiFetch(`/update-project/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
        await fetchProjects();
        toast({ title: "Success", description: data.message });
        return data.data;
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
        const data = await apiFetch(`/project/${projectId}`, { method: 'DELETE' });
        setProjects(prev => prev.filter(p => p.projectId !== projectId));
        toast({ title: "Success", description: data.message });
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
        const data = await apiFetch(`/add-sensor/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(sensorData),
        });
        toast({ title: "Success", description: data.message });
        return data.data.sensor;
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
        const data = await apiFetch(`/update-sensor/${sensorId}`, {
            method: 'PUT',
            body: JSON.stringify(sensorData),
        });
        toast({ title: "Success", description: data.message });
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
        const data = await apiFetch(`/sensor/${sensorId}`, { method: 'DELETE' });
        toast({ title: "Success", description: data.message });
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
        const data = await apiFetch(`/update-graph-info/${sensorId}`, {
            method: 'PUT',
            body: JSON.stringify(graphData),
        });
        toast({ title: "Success", description: "Graph info updated successfully!" });
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to update graph info",
            variant: "destructive",
        });
    }
  };
  
  const createSendingSignal = async (projectId: string, signalData: NewSignalPayload) => {
    try {
        const data = await apiFetch(`/create-sendingsignal/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(signalData),
        });
        toast({ title: "Success", description: data.message });
        return data.data;
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
        const data = await apiFetch(`/update-signal/${signalId}`, {
            method: 'PUT',
            body: JSON.stringify({ title }),
        });
        toast({ title: "Success", description: data.message });
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
        const data = await apiFetch(`/delete-signal/${signalId}`, { method: 'DELETE' });
        toast({ title: "Success", description: data.message });
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to delete signal",
            variant: "destructive",
        });
    }
  };

  const addButtonToSignal = async (signalId: string, buttonData: NewSignalButtonPayload) => {
    try {
        const data = await apiFetch(`/signal/${signalId}/add-button`, {
            method: 'POST',
            body: JSON.stringify(buttonData),
        });
        toast({ title: "Success", description: data.message });
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to add button",
            variant: "destructive",
        });
    }
  };

  const updateButton = async (buttonId: string, buttonData: NewSignalButtonPayload) => {
    try {
        const data = await apiFetch(`/button/${buttonId}`, {
            method: 'PUT',
            body: JSON.stringify(buttonData),
        });
        toast({ title: "Success", description: data.message });
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to update button",
            variant: "destructive",
        });
    }
  };
  
  // CORRECTED: This function now sends the correct body format to the API.
  const updateButtonReleasedData = async (buttonId: string, releaseddata: string) => {
    try {
      await apiFetch(`/button/${buttonId}/releaseddata`, {
        method: 'PUT',
        body: JSON.stringify({ releaseddata: releaseddata }), // Explicitly format the body
      });
    } catch (error) {
       toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update button state",
        variant: "destructive",
      });
    }
  };

  const deleteButton = async (buttonId: string) => {
    try {
        const data = await apiFetch(`/button/${buttonId}`, { method: 'DELETE' });
        toast({ title: "Success", description: data.message });
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to delete button",
            variant: "destructive",
        });
    }
  };
  
    const sendButtonData = async (pin: string, value: string | string[]) => {
    try {
      await apiFetch('/send-data', {
        method: 'POST',
        body: JSON.stringify({ pin, value }),
      });
    } catch (error) {
      // This can be noisy, so only log to console or use a less intrusive toast
      console.error("Failed to send button data:", error);
    }
  };

  const getProjectSensors = async (projectId: string) => {
    try {
      const data = await apiFetch(`/project/${projectId}/sensors`);
      return data.data.sensors;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch project sensors",
        variant: "destructive",
      });
      return [];
    }
  };

  const createCombinedSensorGraph = async (projectId: string, graphData: { title: string; sensorIds: string[] }) => {
    try {
      const data = await apiFetch(`/project/${projectId}/combine-sensors`, {
        method: 'POST',
        body: JSON.stringify(graphData),
      });
      toast({ title: "Success", description: data.message });
      return data.data.combinedGraph;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create combined graph",
        variant: "destructive",
      });
      return null;
    }
  };

  const getCombinedGraphData = async (graphId: string, startDate?: string, endDate?: string) => {
    try {
      let url = `/combined-graph/${graphId}/data`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const data = await apiFetch(url);
      return data.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch combined graph data",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCombinedGraph = async (graphId: string, graphData: { title?: string; sensorIds?: string[] }) => {
    try {
      const data = await apiFetch(`/combined-graph/${graphId}`, {
        method: 'PUT',
        body: JSON.stringify(graphData),
      });
      toast({ title: "Success", description: data.message });
      return data.data.combinedGraph;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update combined graph",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCombinedGraph = async (graphId: string) => {
    try {
      const data = await apiFetch(`/combined-graph/${graphId}`, {
        method: 'DELETE',
      });
      toast({ title: "Success", description: data.message });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete combined graph",
        variant: "destructive",
      });
      return false;
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
    updateButtonReleasedData,
    deleteButton,
    sendButtonData,
    getProjectSensors,
    createCombinedSensorGraph,
    getCombinedGraphData,
    updateCombinedGraph,
    deleteCombinedGraph,
    refetch: fetchProjects,
  };
};