import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Button as ButtonType, NewSignalButtonPayload } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditButtonFormProps {
    button: ButtonType;
    onSuccess: () => void;
}

// Simplified state for the form
interface ButtonFormState {
    title: string;
    type: 'momentary' | 'toggle' | 'touch';
    pinnumber: string;
    sendingdata1: string;
    sendingdata2: string;
}

export const EditButtonForm: React.FC<EditButtonFormProps> = ({ button, onSuccess }) => {
    const [formData, setFormData] = useState<ButtonFormState>({
        title: '',
        type: 'momentary',
        pinnumber: '',
        sendingdata1: '',
        sendingdata2: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { updateButton } = useProjects();

    useEffect(() => {
        // Populate form with existing button data when the component mounts or button prop changes
        if (button) {
            setFormData({
                title: button.title || '',
                type: button.type || 'momentary',
                pinnumber: button.pinnumber || '',
                sendingdata1: button.sendingdata?.[0] || '1',
                sendingdata2: button.sendingdata?.[1] || '0',
            });
        }
    }, [button]);

    const handleChange = (field: keyof ButtonFormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Construct the payload in the required API format
        const payload: NewSignalButtonPayload = {
            title: formData.title,
            type: formData.type,
            pinnumber: formData.pinnumber,
            sendingdata: [formData.sendingdata1, formData.sendingdata2],
            releaseddata: "0", // Default hidden value
        };

        try {
            await updateButton(button.id, payload);
            onSuccess();
        } catch (error) {
            console.error('Failed to update button:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="edit-button-title">Button Title</Label>
                <Input 
                    id="edit-button-title" 
                    value={formData.title} 
                    onChange={(e) => handleChange('title', e.target.value)} 
                    required 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-button-type">Button Type</Label>
                    <Select 
                        value={formData.type} 
                        onValueChange={(value: ButtonFormState['type']) => handleChange('type', value)}
                    >
                        <SelectTrigger id="edit-button-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="momentary">Momentary</SelectItem>
                            <SelectItem value="toggle">Toggle</SelectItem>
                            <SelectItem value="touch">Touch</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-pinnumber">Pin Number</Label>
                    <Input 
                        id="edit-pinnumber" 
                        value={formData.pinnumber} 
                        onChange={(e) => handleChange('pinnumber', e.target.value)} 
                        required 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="edit-sendingdata1">Sending Data 1</Label>
                    <Input 
                        id="edit-sendingdata1" 
                        value={formData.sendingdata1} 
                        onChange={(e) => handleChange('sendingdata1', e.target.value)} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-sendingdata2">Sending Data 2</Label>
                    <Input 
                        id="edit-sendingdata2" 
                        value={formData.sendingdata2} 
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
                    {isLoading ? 'Updating...' : 'Update Button'}
                </Button>
            </div>
        </form>
    );
};
