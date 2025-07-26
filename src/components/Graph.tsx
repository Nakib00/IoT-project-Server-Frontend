import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
  BarChart, Bar, AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import { format } from 'date-fns';
import { SensorData, GraphInfo } from '@/hooks/useProjects';

interface GraphProps {
  data: SensorData[];
  graphInfo: GraphInfo;
}

export const Graph: React.FC<GraphProps> = ({ data, graphInfo }) => {
  const formattedData = data
    .slice(-graphInfo.maxDataPoints)
    .map(d => ({
      ...d,
      datetime: format(new Date(d.datetime), 'HH:mm:ss'),
  }));

  const renderChart = () => {
    switch (graphInfo.type) {
      case 'bar':
        return (
          <BarChart data={formattedData}>
            <Bar dataKey="value" fill="#8884d8" />
            <XAxis dataKey="datetime">
              <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={formattedData}>
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            <XAxis dataKey="datetime">
              <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart data={formattedData}>
            <XAxis dataKey="datetime">
              <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Area type="monotone" dataKey="value" fill="#82ca9d" stroke="#82ca9d" />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <XAxis type="category" dataKey="datetime" name="time">
              <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis type="number" dataKey="value" name="value">
              <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <CartesianGrid />
            <Scatter name="Sensor Data" data={formattedData} fill="#8884d8" />
          </ScatterChart>
        );
      case 'line':
      default:
        return (
          <LineChart data={formattedData}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            <XAxis dataKey="datetime">
              <Label value={graphInfo.xAxisLabel} offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={graphInfo.yAxisLabel} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
          </LineChart>
        );
    }
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};