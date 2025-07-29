import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects } from '@/hooks/useProjects';
import { PlusCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ButtonPreview } from './ButtonPreview'; // Import the new component

interface AddSignalFormProps {
    projectId: string;
    onSuccess: () => void;
}

// Simplified state for the form, matching the new UI fields
interface ButtonFormState {
    title: string;
    type: 'momentary' | 'toggle' | 'touch';
    pinnumber: string;
    sendingdata1: string;
    sendingdata2: string;
}

const initialButtonState: ButtonFormState = {
    title: '',
    type: 'momentary',
    pinnumber: '',
    sendingdata1: '1',
    sendingdata2: '0',
};

export const AddSignalForm: React.FC<AddSignalFormProps> = ({ projectId, onSuccess }) => {
    const [sectionTitle, setSectionTitle] = useState('');
    const [buttons, setButtons] = useState<ButtonFormState[]>([initialButtonState]);
    const [isLoading, setIsLoading] = useState(false);
    const { createSendingSignal } = useProjects();

    const handleAddButton = () => {
        setButtons([...buttons, { ...initialButtonState }]);
    };

    const handleRemoveButton = (index: number) => {
        const newButtons = buttons.filter((_, i) => i !== index);
        setButtons(newButtons);
    };

    const handleButtonChange = (index: number, field: keyof ButtonFormState, value: any) => {
        const newButtons = [...buttons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        setButtons(newButtons);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Format the buttons from the form state to match the required API payload structure
        const formattedButtonsForApi = buttons.map(button => ({
            title: button.title,
            type: button.type,
            pinnumber: button.pinnumber,
            sendingdata: [button.sendingdata1, button.sendingdata2],
            releaseddata: "0", // Default hidden value as requested
        }));
        
        const payload = {
            title: sectionTitle,
            buttons: formattedButtonsForApi,
        };

        try {
            await createSendingSignal(projectId, payload);
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
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
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
                    
                    <div className="space-y-2">
                        <Label htmlFor={`button-title-${index}`}>Button Title</Label>
                        <Input 
                            id={`button-title-${index}`} 
                            placeholder="e.g., Push Button" 
                            value={button.title} 
                            onChange={(e) => handleButtonChange(index, 'title', e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`button-type-${index}`}>Button Type</Label>
                            <Select value={button.type} onValueChange={(value: ButtonFormState['type']) => handleButtonChange(index, 'type', value)}>
                                <SelectTrigger id={`button-type-${index}`}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="momentary"><div className="flex items-center"><ButtonPreview type="momentary" /> Momentary</div></SelectItem>
                                    <SelectItem value="toggle"><div className="flex items-center"><ButtonPreview type="toggle" /> Toggle</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`pinnumber-${index}`}>Pin Number</Label>
                            <Input 
                                id={`pinnumber-${index}`} 
                                placeholder="e.g., D1, T0" 
                                value={button.pinnumber} 
                                onChange={(e) => handleButtonChange(index, 'pinnumber', e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`sendingdata1-${index}`}>Sending Data 1</Label>
                            <Input 
                                id={`sendingdata1-${index}`} 
                                placeholder="e.g., 1" 
                                value={button.sendingdata1} 
                                onChange={(e) => handleButtonChange(index, 'sendingdata1', e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`sendingdata2-${index}`}>Sending Data 2</Label>
                            <Input 
                                id={`sendingdata2-${index}`} 
                                placeholder="e.g., 0" 
                                value={button.sendingdata2} 
                                onChange={(e) => handleButtonChange(index, 'sendingdata2', e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddButton}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Button
            </Button>

            <div className="flex justify-end space-x-3 pt-4">
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