import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Sensor } from '@/hooks/useProjects';

interface EditGraphInfoFormProps {
  sensor: Sensor;
  onSuccess: () => void;
}

export const EditGraphInfoForm: React.FC<EditGraphInfoFormProps> = ({ sensor, onSuccess }) => {
  const [title, setTitle] = useState(sensor.graphInfo.title);
  const [type, setType] = useState(sensor.graphInfo.type);
  const [maxDataPoints, setMaxDataPoints] = useState(sensor.graphInfo.maxDataPoints);
  const [xAxisLabel, setXAxisLabel] = useState(sensor.graphInfo.xAxisLabel);
  const [yAxisLabel, setYAxisLabel] = useState(sensor.graphInfo.yAxisLabel);
  const [isLoading, setIsLoading] = useState(false);
  const { updateGraphInfo } = useProjects();

  useEffect(() => {
    setTitle(sensor.graphInfo.title);
    setType(sensor.graphInfo.type);
    setMaxDataPoints(sensor.graphInfo.maxDataPoints);
    setXAxisLabel(sensor.graphInfo.xAxisLabel);
    setYAxisLabel(sensor.graphInfo.yAxisLabel);
  }, [sensor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateGraphInfo(sensor.id, {
        title,
        type,
        maxDataPoints,
        xAxisLabel,
        yAxisLabel,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to update graph info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="graph-title">Graph Title</Label>
        <Input id="graph-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="graph-type">Graph Type</Label>
        <Input id="graph-type" value={type} onChange={(e) => setType(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-data-points">Max Data Points</Label>
        <Input id="max-data-points" type="number" value={maxDataPoints} onChange={(e) => setMaxDataPoints(Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="x-axis-label">X-Axis Label</Label>
        <Input id="x-axis-label" value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="y-axis-label">Y-Axis Label</Label>
        <Input id="y-axis-label" value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} />
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};