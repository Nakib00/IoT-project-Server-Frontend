import { useState } from 'react';
import { Button as ButtonType } from '@/hooks/useProjects';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface InteractiveButtonProps {
    button: ButtonType;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({ button }) => {
    const { sendButtonData } = useProjects();
    const [isToggleOn, setIsToggleOn] = useState(button.defaultState === 'on');

    const handleMomentaryPress = () => {
        if (button.sendingdata) {
            sendButtonData(button.pinnumber, button.sendingdata);
        }
    };

    const handleMomentaryRelease = () => {
        if (button.releaseddata) {
            sendButtonData(button.pinnumber, button.releaseddata);
        }
    };

    const handleToggle = () => {
        const newState = !isToggleOn;
        setIsToggleOn(newState);
        const dataToSend = newState ? button.ondata : button.offdata;
        if (dataToSend) {
            sendButtonData(button.pinnumber, dataToSend);
        }
    };

    const handleTouch = () => {
        if (button.sendingdata) {
            sendButtonData(button.pinnumber, button.sendingdata);
        }
    };

    switch (button.type) {
        case 'momentary':
            return (
                <Button
                    onMouseDown={handleMomentaryPress}
                    onMouseUp={handleMomentaryRelease}
                    onTouchStart={handleMomentaryPress}
                    onTouchEnd={handleMomentaryRelease}
                >
                    {button.title}
                </Button>
            );
        case 'toggle':
            return (
                <div className="flex items-center space-x-2">
                    <Switch checked={isToggleOn} onCheckedChange={handleToggle} />
                    <label>{button.title}</label>
                </div>
            );
        case 'touch':
            return <Button onClick={handleTouch}>{button.title}</Button>;
        default:
            return <Button disabled>{button.title}</Button>;
    }
};
