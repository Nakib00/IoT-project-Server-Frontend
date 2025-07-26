import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects } from '@/hooks/useProjects';

interface AddSensorFormProps {
  projectId: string;
  onSuccess: () => void;
}

export const AddSensorForm: React.FC<AddSensorFormProps> = ({ projectId, onSuccess }) => {
  const [sensorName, setSensorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addSensor } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await addSensor(projectId, { sensorName: sensorName.trim() });
      setSensorName('');
      onSuccess();
    } catch (error) {
      console.error('Failed to add sensor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="sensor-name">Sensor Name</Label>
        <Input
          id="sensor-name"
          type="text"
          placeholder="e.g., DHT11"
          value={sensorName}
          onChange={(e) => setSensorName(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !sensorName.trim()}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            'Add Sensor'
          )}
        </Button>
      </div>
    </form>
  );
};