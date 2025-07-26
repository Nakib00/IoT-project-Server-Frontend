import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sensor, useProjects } from '@/hooks/useProjects';
import { Edit, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditSensorForm } from './EditSensorForm';
import { EditGraphInfoForm } from './EditGraphInfoForm';
import { Graph } from './Graph';
import { RawDataDialog } from './RawDataDialog';

interface SensorCardProps {
  sensor: Sensor;
  onUpdate: () => void;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, onUpdate }) => {
  const { deleteSensor } = useProjects();
  const [showEditSensorDialog, setShowEditSensorDialog] = useState(false);
  const [showEditGraphDialog, setShowEditGraphDialog] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${sensor.title}"?`)) {
      await deleteSensor(sensor.id);
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{sensor.title}</CardTitle>
          <RawDataDialog
            data={sensor.data}
            trigger={<Button variant="link">Raw Data</Button>}
          />
        </div>
        <div className="flex items-center space-x-2">
           <Dialog open={showEditSensorDialog} onOpenChange={setShowEditSensorDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sensor</DialogTitle>
              </DialogHeader>
              <EditSensorForm sensor={sensor} onSuccess={() => { setShowEditSensorDialog(false); onUpdate(); }} />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Badge variant="outline">{sensor.typeOfPin}</Badge>
            <Badge variant="secondary" className="ml-2">{sensor.pinNumber}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{sensor.graphInfo.title}</h4>
            <Dialog open={showEditGraphDialog} onOpenChange={setShowEditGraphDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Graph Info</DialogTitle>
                </DialogHeader>
                <EditGraphInfoForm sensor={sensor} onSuccess={() => { setShowEditGraphDialog(false); onUpdate(); }} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Graph data={sensor.data} graphInfo={sensor.graphInfo} />
        </div>
      </CardContent>
    </Card>
  );
};