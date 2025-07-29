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
    
    // State for the toggle switch's on/off status, initialized from the database
    const [isToggleOn, setIsToggleOn] = useState(button.releaseddata === '1');
    // State for visual feedback on momentary/touch buttons
    const [isPressed, setIsPressed] = useState(false);

    // Ensure local UI state is updated if the prop changes from a parent re-render
    useEffect(() => {
        setIsToggleOn(button.releaseddata === '1');
    }, [button.releaseddata]);

    // --- Event Handlers for Momentary (Push) & Touch Buttons ---
    const handlePress = () => {
        setIsPressed(true);
        const valueToSend = button.sendingdata?.[0] || '1'; // "On" value
        sendButtonData(button.pinnumber, valueToSend);
        updateButtonReleasedData(button.id, valueToSend);
    };

    const handleRelease = () => {
        setIsPressed(false);
        const valueToSend = button.sendingdata?.[1] || '0'; // "Off" value
        sendButtonData(button.pinnumber, valueToSend);
        updateButtonReleasedData(button.id, valueToSend);
    };

    // --- Event Handler for Toggle Switch ---
    const handleToggle = (isChecked: boolean) => {
        const valueToSend = isChecked ? "1" : "0";
        setIsToggleOn(isChecked); // Update UI state immediately
        sendButtonData(button.pinnumber, valueToSend);
        updateButtonReleasedData(button.id, valueToSend);
    };

    // --- UI Styles for a more realistic button look ---
    const buttonBaseClasses = "w-full justify-center text-base md:text-sm font-semibold h-12 shadow-lg border-b-4 rounded-lg transition-all duration-150 ease-in-out";
    const buttonPressedClasses = "translate-y-0.5 border-b-2";
    const buttonDefaultClasses = "bg-slate-200 border-slate-400 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:border-slate-900 dark:text-slate-200 dark:hover:bg-slate-600";
    
    switch (button.type) {
        case 'momentary':
        case 'touch':
            return (
                <Button
                    onMouseDown={handlePress}
                    onMouseUp={handleRelease}
                    onMouseLeave={handleRelease} 
                    onTouchStart={handlePress}
                    onTouchEnd={handleRelease}
                    className={cn(
                        buttonBaseClasses,
                        buttonDefaultClasses,
                        isPressed && buttonPressedClasses
                    )}
                >
                    {button.type === 'momentary' ? <Zap className="h-5 w-5 mr-2" /> : <Touchpad className="h-5 w-5 mr-2" />}
                    {button.title}
                </Button>
            );
        case 'toggle':
            return (
                <div className="flex items-center justify-between w-full h-12 px-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <ToggleLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        <label className="font-semibold text-base md:text-sm text-slate-700 dark:text-slate-200">{button.title}</label>
                    </div>
                    <Switch checked={isToggleOn} onCheckedChange={handleToggle} />
                </div>
            );
        default:
            return <Button disabled className={buttonBaseClasses}>{button.title}</Button>;
    }
};
