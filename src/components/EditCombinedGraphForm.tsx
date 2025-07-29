import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Sensor, CombinedSensorGraph } from '@/hooks/useProjects';
import { MultiSelect } from '@/components/ui/multi-select';

interface EditCombinedGraphFormProps {
    graph: CombinedSensorGraph;
    projectId: string;
    onSuccess: () => void;
}

export const EditCombinedGraphForm: React.FC<EditCombinedGraphFormProps> = ({ graph, projectId, onSuccess }) => {
    const [title, setTitle] = useState(graph.title);
    const [selectedSensors, setSelectedSensors] = useState<string[]>(graph.sensors.map(s => s.sensorid));
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getProjectSensors, updateCombinedGraph } = useProjects();

    useEffect(() => {
        const fetchSensors = async () => {
            const projectSensors = await getProjectSensors(projectId);
            setSensors(projectSensors);
        };
        fetchSensors();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || selectedSensors.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            await updateCombinedGraph(graph.id, {
                title: title.trim(),
                sensorIds: selectedSensors,
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to update combined sensor graph:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="graph-title">Graph Title</Label>
                <Input
                    id="graph-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="sensor-select">Select Sensors</Label>
                <MultiSelect
                    options={sensors.map(sensor => ({ value: sensor.id, label: sensor.title }))}
                    selected={selectedSensors}
                    onChange={setSelectedSensors}
                    className="w-full"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || !title.trim() || selectedSensors.length === 0}
                    className="bg-gradient-primary hover:opacity-90"
                >
                    {isLoading ? 'Updating...' : 'Update Graph'}
                </Button>
            </div>
        </form>
    );
};