import React from 'react';
import { Zap, ToggleLeft, Touchpad } from 'lucide-react';

export const ButtonPreview: React.FC<{ type: string }> = ({ type }) => {
    const iconProps = { className: "h-4 w-4 mr-2 text-muted-foreground" };

    switch (type) {
        case 'momentary':
            return <Zap {...iconProps} />;
        case 'toggle':
            return <ToggleLeft {...iconProps} />;
        default:
            return null;
    }
};