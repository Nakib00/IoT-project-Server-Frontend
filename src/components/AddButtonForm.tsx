import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, NewButtonPayload } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddButtonFormProps {
    signalId: string;
    onSuccess: () => void;
}

const initialButtonState: NewButtonPayload = {
    title: '',
    type: 'momentary',
    pinnumber: '',
    action: 'trigger',
    sendingdata: ['1', '0'],
    releaseddata: '0',
    char: '',
    ondata: '',
    offdata: '',
    defaultState: 'off',
    sensitivity: 40,
};


export const AddButtonForm: React.FC<AddButtonFormProps> = ({ signalId, onSuccess }) => {
    const [button, setButton] = useState<NewButtonPayload>(initialButtonState);
    const [isLoading, setIsLoading] = useState(false);
    const { addButtonToSignal } = useProjects();

    const handleChange = (field: keyof NewButtonPayload, value: any) => {
        const newButton = { ...button, [field]: value };

        if (field === 'type') {
            if (value === 'touch') {
                newButton.action = 'touch-toggle';
            } else if (newButton.action === 'touch-toggle') {
                newButton.action = ''; // Reset action if not touch
            }
        }

        setButton(newButton);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload: Partial<NewButtonPayload> = {
            title: button.title,
            type: button.type,
            pinnumber: button.pinnumber,
            action: button.action,
        };

        if (button.type === 'momentary') {
            payload.sendingdata = button.sendingdata;
            payload.releaseddata = '0';
            payload.char = button.char;
        } else if (button.type === 'toggle') {
            payload.ondata = button.ondata;
            payload.offdata = button.offdata;
            payload.char = button.char;
            payload.defaultState = button.defaultState;
        } else if (button.type === 'touch') {
            payload.sensitivity = Number(button.sensitivity);
            payload.sendingdata = button.sendingdata;
            payload.releaseddata = '0';
            payload.action = 'touch-toggle';
        }

        try {
            await addButtonToSignal(signalId, payload as NewButtonPayload);
            onSuccess();
        } catch (error) {
            console.error('Failed to add button:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="button-title">Button Title</Label>
                    <Input id="button-title" value={button.title} onChange={(e) => handleChange('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="button-type">Button Type</Label>
                    <Select value={button.type} onValueChange={(value) => handleChange('type', value)}>
                        <SelectTrigger id="button-type"><SelectValue placeholder="Select type" /></SelectTrigger>
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
                    <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input placeholder="On Data" value={button.sendingdata[0]} onChange={(e) => handleChange('sendingdata', [e.target.value, button.sendingdata[1]])} required />
                    <Input placeholder="Off Data" value={button.sendingdata[1]} onChange={(e) => handleChange('sendingdata', [button.sendingdata[0], e.target.value])} required />
                    <Input placeholder="Char" value={button.char} onChange={(e) => handleChange('char', e.target.value)} />
                    <Input placeholder="Action" value={button.action} onChange={(e) => handleChange('action', e.target.value)} required />
                </div>
            )}

            {button.type === 'toggle' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input placeholder="On Data" value={button.ondata} onChange={(e) => handleChange('ondata', e.target.value)} required />
                    <Input placeholder="Off Data" value={button.offdata} onChange={(e) => handleChange('offdata', e.target.value)} required />
                    <Input placeholder="Char" value={button.char} onChange={(e) => handleChange('char', e.target.value)} />
                    <Select value={button.defaultState} onValueChange={(value) => handleChange('defaultState', value)}>
                        <SelectTrigger><SelectValue placeholder="Default State" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="on">On</SelectItem>
                            <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="Action" value={button.action} onChange={(e) => handleChange('action', e.target.value)} required />
                </div>
            )}

            {button.type === 'touch' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Pin Number" value={button.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input type="number" placeholder="Sensitivity" value={button.sensitivity} onChange={(e) => handleChange('sensitivity', e.target.value)} required />
                     <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="On Data" value={button.sendingdata[0]} onChange={(e) => handleChange('sendingdata', [e.target.value, button.sendingdata[1]])} required />
                        <Input placeholder="Off Data" value={button.sendingdata[1]} onChange={(e) => handleChange('sendingdata', [button.sendingdata[0], e.target.value])} required />
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-primary hover:opacity-90">
                    {isLoading ? 'Adding...' : 'Add Button'}
                </Button>
            </div>
        </form>
    );
};