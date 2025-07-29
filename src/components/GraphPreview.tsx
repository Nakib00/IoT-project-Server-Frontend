import React from 'react';
import { LineChart, BarChart, AreaChart, ScatterChart, Layers } from 'lucide-react';

export const GraphPreview: React.FC<{ type: string }> = ({ type }) => {
    const iconProps = { className: "h-4 w-4 mr-2 text-muted-foreground" };

    switch (type) {
        case 'line':
            return <LineChart {...iconProps} />;
        case 'bar':
            return <BarChart {...iconProps} />;
        case 'area':
            return <AreaChart {...iconProps} />;
        case 'composed':
            return <Layers {...iconProps} />;
        case 'scatter':
            return <ScatterChart {...iconProps} />;
        default:
            return <div className="w-4 h-4 mr-2" />;
    }
};