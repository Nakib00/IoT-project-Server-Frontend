import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SensorData } from '@/hooks/useProjects';
import { format } from 'date-fns';

interface RawDataDialogProps {
  data: SensorData[];
  trigger: React.ReactNode;
}

export const RawDataDialog: React.FC<RawDataDialogProps> = ({ data, trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Raw Sensor Data</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(d.datetime), 'PPpp')}</TableCell>
                  <TableCell className="text-right">{d.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};