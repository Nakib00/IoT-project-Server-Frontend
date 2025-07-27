import { useState } from 'react';
import { Button as ButtonType } from '@/hooks/useProjects';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, ToggleLeft, Touchpad } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignalButtonProps {
    button: ButtonType;
}

export const SignalButton: React.FC<SignalButtonProps> = ({ button }) => {
    const { sendButtonData } = useProjects();
    const [isToggleOn, setIsToggleOn] = useState(button.defaultState === 'on');
    const [isPressed, setIsPressed] = useState(false); // State for visual feedback

    const handleMomentaryPress = () => {
        setIsPressed(true);
        if (button.sendingdata) {
            sendButtonData(button.pinnumber, button.sendingdata);
        }
    };

    const handleMomentaryRelease = () => {
        setIsPressed(false);
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
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200); // Visual flash for 200ms
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
                    onMouseLeave={handleMomentaryRelease} // Reset if mouse leaves while pressed
                    onTouchStart={handleMomentaryPress}
                    onTouchEnd={handleMomentaryRelease}
                    className={cn(
                        "w-full justify-start text-base md:text-sm",
                        isPressed && "bg-accent text-accent-foreground"
                    )}
                >
                    <Zap className="h-4 w-4 mr-2" />
                    {button.title}
                </Button>
            );
        case 'toggle':
            return (
                <div className="flex items-center justify-between w-full h-10 px-3">
                    <div className="flex items-center space-x-2">
                        <ToggleLeft className="h-4 w-4" />
                        <label className="font-medium text-base md:text-sm">{button.title}</label>
                    </div>
                    <Switch checked={isToggleOn} onCheckedChange={handleToggle} />
                </div>
            );
        case 'touch':
            return (
                <Button 
                    onClick={handleTouch} 
                    className={cn(
                        "w-full justify-start text-base md:text-sm",
                        isPressed && "bg-accent text-accent-foreground"
                    )}
                >
                    <Touchpad className="h-4 w-4 mr-2" />
                    {button.title}
                </Button>
            );
        default:
            return <Button disabled>{button.title}</Button>;
    }
};
