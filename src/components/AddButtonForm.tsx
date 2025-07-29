import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, NewSignalButtonPayload } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddButtonFormProps {
    signalId: string;
    onSuccess: () => void;
}

// Simplified state for the form
const initialButtonState: Omit<NewSignalButtonPayload, 'releaseddata'> & { sendingdata1: string; sendingdata2: string } = {
    title: '',
    type: 'momentary',
    pinnumber: '',
    sendingdata1: '1',
    sendingdata2: '0',
};

export const AddButtonForm: React.FC<AddButtonFormProps> = ({ signalId, onSuccess }) => {
    const [button, setButton] = useState(initialButtonState);
    const [isLoading, setIsLoading] = useState(false);
    const { addButtonToSignal } = useProjects();

    const handleChange = (field: keyof typeof initialButtonState, value: any) => {
        setButton(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Construct the payload in the required API format
        const payload: NewSignalButtonPayload = {
            title: button.title,
            type: button.type,
            pinnumber: button.pinnumber,
            sendingdata: [button.sendingdata1, button.sendingdata2],
            releaseddata: "0", // Default hidden value
        };

        try {
            await addButtonToSignal(signalId, payload);
            onSuccess();
        } catch (error) {
            console.error('Failed to add button:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="button-title">Button Title</Label>
                <Input 
                    id="button-title" 
                    placeholder="e.g., Push Button" 
                    value={button.title} 
                    onChange={(e) => handleChange('title', e.target.value)} 
                    required 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="button-type">Button Type</Label>
                    <Select value={button.type} onValueChange={(value: 'momentary' | 'toggle') => handleChange('type', value)}>
                        <SelectTrigger id="button-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="momentary">Momentary</SelectItem>
                            <SelectItem value="toggle">Toggle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pinnumber">Pin Number</Label>
                    <Input 
                        id="pinnumber" 
                        placeholder="e.g., D1, T0" 
                        value={button.pinnumber} 
                        onChange={(e) => handleChange('pinnumber', e.target.value)} 
                        required 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sendingdata1">Sending Data 1</Label>
                    <Input 
                        id="sendingdata1" 
                        placeholder="e.g., 1" 
                        value={button.sendingdata1} 
                        onChange={(e) => handleChange('sendingdata1', e.target.value)} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sendingdata2">Sending Data 2</Label>
                    <Input 
                        id="sendingdata2" 
                        placeholder="e.g., 0" 
                        value={button.sendingdata2} 
                        onChange={(e) => handleChange('sendingdata2', e.target.value)} 
                        required 
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
