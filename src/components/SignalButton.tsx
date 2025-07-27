import { useState } from 'react';
import { Button as ButtonType } from '@/hooks/useProjects';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, ToggleLeft, Touchpad } from 'lucide-react';

interface SignalButtonProps {
    button: ButtonType;
}

export const SignalButton: React.FC<SignalButtonProps> = ({ button }) => {
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

    const renderButton = () => {
        switch (button.type) {
            case 'momentary':
                return (
                    <Button
                        onMouseDown={handleMomentaryPress}
                        onMouseUp={handleMomentaryRelease}
                        onTouchStart={handleMomentaryPress}
                        onTouchEnd={handleMomentaryRelease}
                        className="w-full justify-start"
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        {button.title}
                    </Button>
                );
            case 'toggle':
                return (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                            <ToggleLeft className="h-4 w-4" />
                            <label>{button.title}</label>
                        </div>
                        <Switch checked={isToggleOn} onCheckedChange={handleToggle} />
                    </div>
                );
            case 'touch':
                return (
                    <Button onClick={handleTouch} className="w-full justify-start">
                        <Touchpad className="h-4 w-4 mr-2" />
                        {button.title}
                    </Button>
                );
            default:
                return <Button disabled>{button.title}</Button>;
        }
    };

    return (
        <div className="p-2 border-b flex items-center justify-between">
            {renderButton()}
        </div>
    );
};
