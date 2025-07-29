import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CombinedSensorGraph, Project, AverageData } from '@/hooks/useProjects';
import { useProjects } from '@/hooks/useProjects';
import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { EditCombinedGraphForm } from './EditCombinedGraphForm';

interface CombinedSensorGraphCardProps {
    graph: CombinedSensorGraph;
    project: Project;
    onUpdate: () => void;
    onDelete: (graphId: string) => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CombinedSensorGraphCard: React.FC<CombinedSensorGraphCardProps> = ({ graph, project, onUpdate, onDelete }) => {
    const [averageData, setAverageData] = useState<AverageData[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const { getCombinedGraphData } = useProjects();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCombinedGraphData(graph.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString());
            if (data) {
                setAverageData(data.results);
            }
        };
        fetchData();
    }, [graph.id, dateRange]);

    const handleEditSuccess = () => {
        setShowEditDialog(false);
        onUpdate();
    };

    const mergedData = (project.sensordata || [])
        .filter(sensor => graph.sensors.some(s => s.sensorid === sensor.id))
        .reduce((acc, sensor) => {
            sensor.data.forEach(dataPoint => {
                const existingDataPoint = acc.find(d => d.datetime === dataPoint.datetime);
                if (existingDataPoint) {
                    existingDataPoint[sensor.title] = dataPoint.value;
                } else {
                    acc.push({ datetime: dataPoint.datetime, [sensor.title]: dataPoint.value });
                }
            });
            return acc;
        }, [] as any[]);

    return (
        <>
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{graph.title}</CardTitle>
                    <div>
                        <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(graph.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Real-time Data</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mergedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="datetime" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {graph.sensors.map((sensor, index) => (
                                    <Line
                                        key={sensor.sensorid}
                                        type="monotone"
                                        dataKey={sensor.sensorTitle}
                                        stroke={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Average Sensor Data</h3>
                            <DatePickerWithRange value={dateRange} onChange={setDateRange} />
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={averageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="title" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="average" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Combined Graph</DialogTitle>
                    </DialogHeader>
                    <EditCombinedGraphForm
                        graph={graph}
                        projectId={project.projectId}
                        onSuccess={handleEditSuccess}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};