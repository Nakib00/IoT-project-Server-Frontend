import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, NewButtonPayload } from '@/hooks/useProjects';
import { PlusCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddSignalFormProps {
    projectId: string;
    onSuccess: () => void;
}

type ButtonState = Omit<NewButtonPayload, 'sensitivity'> & {
    sensitivity: number | string;
};


const initialButtonState: ButtonState = {
    title: '',
    type: 'momentary',
    pinnumber: '',
    action: 'trigger',
    sendingdata: '',
    releaseddata: '',
    char: '',
    ondata: '',
    offdata: '',
    defaultState: 'off',
    sensitivity: 40,
};

export const AddSignalForm: React.FC<AddSignalFormProps> = ({ projectId, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [buttons, setButtons] = useState<ButtonState[]>([initialButtonState]);
    const [isLoading, setIsLoading] = useState(false);
    const { createSendingSignal } = useProjects();

    const handleAddButton = () => {
        setButtons([...buttons, { ...initialButtonState }]);
    };

    const handleRemoveButton = (index: number) => {
        const newButtons = buttons.filter((_, i) => i !== index);
        setButtons(newButtons);
    };

    const handleButtonChange = (index: number, field: keyof ButtonState, value: any) => {
        const newButtons = [...buttons];
        const button = newButtons[index];
        (button[field] as any) = value;

        if (field === 'type') {
            if (value === 'touch') {
                button.action = 'touch-toggle';
            } else if (button.action === 'touch-toggle') {
                button.action = '';
            }
        }
        setButtons(newButtons);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        const formattedButtons = buttons.map(button => {
            const common = {
                title: button.title,
                pinnumber: button.pinnumber,
                type: button.type,
            };
            if (button.type === 'momentary') {
                return {
                    ...common,
                    sendingdata: button.sendingdata,
                    releaseddata: button.releaseddata,
                    char: button.char,
                    action: button.action,
                };
            }
            if (button.type === 'toggle') {
                return {
                    ...common,
                    ondata: button.ondata,
                    offdata: button.offdata,
                    char: button.char,
                    defaultState: button.defaultState,
                    action: button.action,
                };
            }
            if (button.type === 'touch') {
                return {
                    ...common,
                    sensitivity: Number(button.sensitivity),
                    sendingdata: button.sendingdata,
                    action: 'touch-toggle',
                };
            }
            return button;
        });

        try {
            await createSendingSignal(projectId, { title, buttons: formattedButtons as NewButtonPayload[] });
            onSuccess();
        } catch (error) {
            console.error('Failed to create sending signal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="signal-title">Signal Section Title</Label>
                <Input
                    id="signal-title"
                    placeholder="e.g., Living Room Controls"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            {buttons.map((button, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-md relative">
                    {buttons.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => handleRemoveButton(index)}
                        >
                            <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`button-title-${index}`}>Button Title</Label>
                            <Input id={`button-title-${index}`} value={button.title} onChange={(e) => handleButtonChange(index, 'title', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`button-type-${index}`}>Button Type</Label>
                            <Select value={button.type} onValueChange={(value) => handleButtonChange(index, 'type', value)}>
                                <SelectTrigger id={`button-type-${index}`}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="momentary">Momentary</SelectItem>
                                    <SelectItem value="toggle">Toggle</SelectItem>
                                    <SelectItem value="touch">Touch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {button.type === 'momentary' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleButtonChange(index, 'pinnumber', e.target.value)} required />
                            <Input placeholder="Sending Data" value={button.sendingdata} onChange={(e) => handleButtonChange(index, 'sendingdata', e.target.value)} required />
                            <Input placeholder="Released Data" value={button.releaseddata} onChange={(e) => handleButtonChange(index, 'releaseddata', e.target.value)} required />
                            <Input placeholder="Char" value={button.char} onChange={(e) => handleButtonChange(index, 'char', e.target.value)} required />
                            <Input placeholder="Action" value={button.action} onChange={(e) => handleButtonChange(index, 'action', e.target.value)} required />
                        </div>
                    )}

                    {button.type === 'toggle' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleButtonChange(index, 'pinnumber', e.target.value)} required />
                            <Input placeholder="On Data" value={button.ondata} onChange={(e) => handleButtonChange(index, 'ondata', e.target.value)} required />
                            <Input placeholder="Off Data" value={button.offdata} onChange={(e) => handleButtonChange(index, 'offdata', e.target.value)} required />
                            <Input placeholder="Char" value={button.char} onChange={(e) => handleButtonChange(index, 'char', e.target.value)} required />
                            <Select value={button.defaultState} onValueChange={(value) => handleButtonChange(index, 'defaultState', value)}>
                                <SelectTrigger><SelectValue placeholder="Default State" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="on">On</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="Action" value={button.action} onChange={(e) => handleButtonChange(index, 'action', e.target.value)} required />
                        </div>
                    )}

                    {button.type === 'touch' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleButtonChange(index, 'pinnumber', e.target.value)} required />
                            <Input type="number" placeholder="Sensitivity" value={button.sensitivity} onChange={(e) => handleButtonChange(index, 'sensitivity', e.target.value)} required />
                            <Input placeholder="Sending Data" value={button.sendingdata} onChange={(e) => handleButtonChange(index, 'sendingdata', e.target.value)} required />
                        </div>
                    )}
                </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddButton}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Button to Section
            </Button>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-primary hover:opacity-90">
                    {isLoading ? 'Creating...' : 'Create Signal Section'}
                </Button>
            </div>
        </form>
    );
};
