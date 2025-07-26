import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { format } from 'date-fns';
import { SensorData, GraphInfo } from '@/hooks/useProjects';

interface GraphProps {
  data: SensorData[];
  graphInfo: GraphInfo;
}

export const Graph: React.FC<GraphProps> = ({ data, graphInfo }) => {
  const formattedData = data.map(d => ({
    ...d,
    datetime: format(new Date(d.datetime), 'HH:mm:ss'),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime">
            <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};