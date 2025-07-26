import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { SensorData } from './useProjects';
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

  socketRef.current = io(WEBSOCKET_URL, {
      auth: {
        token,
      },
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to IoT server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from IoT server');
    });

    socket.on('sensor-data', (data: SensorData) => {
      setSensorData(data);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const joinProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-project', projectId);
    }
  };

  return {
    connected,
    sensorData,
    joinProject,
    leaveProject,
  };
};