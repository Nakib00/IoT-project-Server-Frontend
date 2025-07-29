import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Sensor, CombinedSensorGraph } from '@/hooks/useProjects';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditCombinedGraphFormProps {
    graph: CombinedSensorGraph;
    projectId: string;
    onSuccess: () => void;
}

const GRAPH_TYPE_OPTIONS = ["line", "bar", "stackedBar", "horizontalBar", "area", "stackedArea", "scatter", "bubble", "pie", "doughnut", "composed", "radar", "polarArea", "histogram", "boxPlot", "heatmap", "violin", "treemap", "waterfall", "funnel", "gauge", "candlestick", "ohlc", "sankey", "choropleth", "geoScatter"
];

export const EditCombinedGraphForm: React.FC<EditCombinedGraphFormProps> = ({ graph, projectId, onSuccess }) => {
    const [title, setTitle] = useState(graph.title);
    const [selectedSensors, setSelectedSensors] = useState<string[]>(graph.sensors.map(s => s.sensorid));
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [graphType, setGraphType] = useState(graph.convinegraphInfo.type);
    const [maxDataPoints, setMaxDataPoints] = useState(graph.convinegraphInfo.maxDataPoints);
    const [xAxisLabel, setXAxisLabel] = useState(graph.convinegraphInfo.xAxisLabel);
    const [yAxisLabel, setYAxisLabel] = useState(graph.convinegraphInfo.yAxisLabel);
    const { getProjectSensors, updateCombinedGraph, updateCombinedGraphInfo } = useProjects();

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
            await updateCombinedGraphInfo(graph.id, {
                type: graphType,
                maxDataPoints,
                xAxisLabel,
                yAxisLabel,
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

            <div className="space-y-2">
                <Label htmlFor="graph-type">Graph Type</Label>
                <Select value={graphType} onValueChange={setGraphType}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {GRAPH_TYPE_OPTIONS.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="max-data-points">Max Data Points</Label>
                <Input
                    id="max-data-points"
                    type="number"
                    value={maxDataPoints}
                    onChange={(e) => setMaxDataPoints(Number(e.target.value))}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="x-axis-label">X-Axis Label</Label>
                    <Input
                        id="x-axis-label"
                        type="text"
                        value={xAxisLabel}
                        onChange={(e) => setXAxisLabel(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="y-axis-label">Y-Axis Label</Label>
                    <Input
                        id="y-axis-label"
                        type="text"
                        value={yAxisLabel}
                        onChange={(e) => setYAxisLabel(e.target.value)}
                    />
                </div>
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