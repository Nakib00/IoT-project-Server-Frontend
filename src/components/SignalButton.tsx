import { useState, useEffect } from 'react';
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
    const { sendButtonData, updateButtonReleasedData } = useProjects();
    
    // State to track the current value of the button
    const [currentValue, setCurrentValue] = useState(button.releaseddata);

    // Effect to update the local state if the prop changes (e.g., after a project reload)
    useEffect(() => {
        setCurrentValue(button.releaseddata);
    }, [button.releaseddata]);

    const handlePress = () => {
        if (!button.sendingdata || button.sendingdata.length < 2) return;

        // Determine the next value to send by toggling
        const nextValue = currentValue === button.sendingdata[0] 
            ? button.sendingdata[1] 
            : button.sendingdata[0];
        
        // 1. Send the new value via WebSocket
        sendButtonData(button.pinnumber, nextValue);
        
        // 2. Update the state on the server
        updateButtonReleasedData(button.id, nextValue);

        // 3. Update the local state
        setCurrentValue(nextValue);
    };

    const handleToggle = (isChecked: boolean) => {
        const valueToSend = isChecked ? "1" : "0";
        sendButtonData(button.pinnumber, valueToSend);
        updateButtonReleasedData(button.id, valueToSend);
        setCurrentValue(valueToSend);
    };

    switch (button.type) {
        case 'momentary':
        case 'touch':
            // Both momentary and touch now use the same toggle logic on press
            const isPressed = currentValue === (button.sendingdata?.[0] || '1');
            return (
                <Button
                    onClick={handlePress}
                    className={cn(
                        "w-full justify-start text-base md:text-sm",
                        isPressed && "bg-accent text-accent-foreground"
                    )}
                >
                    {button.type === 'momentary' ? <Zap className="h-4 w-4 mr-2" /> : <Touchpad className="h-4 w-4 mr-2" />}
                    {button.title}
                </Button>
            );
        case 'toggle':
            const isToggleOn = currentValue === "1";
            return (
                <div className="flex items-center justify-between w-full h-10 px-3">
                    <div className="flex items-center space-x-2">
                        <ToggleLeft className="h-4 w-4" />
                        <label className="font-medium text-base md:text-sm">{button.title}</label>
                    </div>
                    <Switch checked={isToggleOn} onCheckedChange={handleToggle} />
                </div>
            );
        default:
            return <Button disabled>{button.title}</Button>;
    }
};
