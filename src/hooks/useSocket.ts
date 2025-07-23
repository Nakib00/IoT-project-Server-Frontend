import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface SensorData {
  sensorId: string;
  value: number;
  timestamp: string;
  type: string;
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'ws://localhost:3001', {
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
      setSensorData(prev => {
        const updated = [...prev, data];
        // Keep only last 50 readings per sensor
        return updated.slice(-50);
      });
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

  const sendCommand = (sensorId: string, command: string, value?: any) => {
    if (socketRef.current) {
      socketRef.current.emit('sensor-command', { sensorId, command, value });
    }
  };

  return {
    connected,
    sensorData,
    joinProject,
    leaveProject,
    sendCommand,
  };
};
