import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects, Sensor } from '@/hooks/useProjects';

interface EditSensorFormProps {
  sensor: Sensor;
  onSuccess: () => void;
}

const PIN_TYPE_OPTIONS = ["Analog", "Digital"];

export const EditSensorForm: React.FC<EditSensorFormProps> = ({ sensor, onSuccess }) => {
  const [title, setTitle] = useState(sensor.title);
  const [typeOfPin, setTypeOfPin] = useState(sensor.typeOfPin);
  const [pinNumber, setPinNumber] = useState(sensor.pinNumber);
  const [isLoading, setIsLoading] = useState(false);
  const { updateSensor } = useProjects();

  useEffect(() => {
    setTitle(sensor.title);
    setTypeOfPin(sensor.typeOfPin);
    setPinNumber(sensor.pinNumber);
  }, [sensor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !typeOfPin || !pinNumber.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await updateSensor(sensor.id, {
        title: title.trim(),
        typeOfPin,
        pinNumber: pinNumber.trim(),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to update sensor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="edit-sensor-title">Sensor Title</Label>
        <Input
          id="edit-sensor-title"
          type="text"
          placeholder="Enter sensor title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-pin-type">Pin Type</Label>
        <Select value={typeOfPin} onValueChange={setTypeOfPin} required>
          <SelectTrigger>
            <SelectValue placeholder="Select pin type" />
          </SelectTrigger>
          <SelectContent>
            {PIN_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-pin-number">Pin Number</Label>
        <Input
          id="edit-pin-number"
          type="text"
          placeholder="e.g., A0, D4"
          value={pinNumber}
          onChange={(e) => setPinNumber(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !title.trim() || !typeOfPin || !pinNumber.trim()}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? 'Updating...' : 'Update Sensor'}
        </Button>
      </div>
    </form>
  );
};