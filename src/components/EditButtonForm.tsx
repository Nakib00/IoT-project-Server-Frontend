import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Button as ButtonType, NewButtonPayload } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditButtonFormProps {
    button: ButtonType;
    onSuccess: () => void;
}

export const EditButtonForm: React.FC<EditButtonFormProps> = ({ button, onSuccess }) => {
    const [formData, setFormData] = useState<NewButtonPayload>({
        title: button.title,
        type: button.type,
        pinnumber: button.pinnumber,
        action: button.action,
        sendingdata: Array.isArray(button.sendingdata) ? button.sendingdata : [button.sendingdata || '1', '0'],
        releaseddata: button.releaseddata || '0',
        char: button.char || '',
        ondata: button.ondata || '',
        offdata: button.offdata || '',
        defaultState: button.defaultState || 'off',
        sensitivity: button.sensitivity || 40,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { updateButton } = useProjects();

    useEffect(() => {
        setFormData({
            title: button.title,
            type: button.type,
            pinnumber: button.pinnumber,
            action: button.action,
            sendingdata: Array.isArray(button.sendingdata) ? button.sendingdata : [button.sendingdata || '1', '0'],
            releaseddata: button.releaseddata || '0',
            char: button.char || '',
            ondata: button.ondata || '',
            offdata: button.offdata || '',
            defaultState: button.defaultState || 'off',
            sensitivity: button.sensitivity || 40,
        });
    }, [button]);

    const handleChange = (field: keyof NewButtonPayload, value: any) => {
        const newFormData = { ...formData, [field]: value };
        if (field === 'type') {
            if (value === 'touch') {
                newFormData.action = 'touch-toggle';
            } else if (newFormData.action === 'touch-toggle') {
                newFormData.action = '';
            }
        }
        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload: Partial<NewButtonPayload> = {
            title: formData.title,
            type: formData.type,
            pinnumber: formData.pinnumber,
            action: formData.action,
        };

        if (formData.type === 'momentary') {
            payload.sendingdata = formData.sendingdata;
            payload.char = formData.char;
        } else if (formData.type === 'toggle') {
            payload.ondata = formData.ondata;
            payload.offdata = formData.offdata;
            payload.char = formData.char;
            payload.defaultState = formData.defaultState;
        } else if (formData.type === 'touch') {
            payload.sensitivity = Number(formData.sensitivity);
            payload.sendingdata = formData.sendingdata;
            payload.action = 'touch-toggle';
        }

        try {
            await updateButton(button.id, payload as NewButtonPayload);
            onSuccess();
        } catch (error) {
            console.error('Failed to update button:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-button-title">Button Title</Label>
                    <Input id="edit-button-title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-button-type">Button Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                        <SelectTrigger id="edit-button-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="momentary">Momentary</SelectItem>
                            <SelectItem value="toggle">Toggle</SelectItem>
                            <SelectItem value="touch">Touch</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {formData.type === 'momentary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Pin Number" value={formData.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input placeholder="On Data" value={formData.sendingdata[0]} onChange={(e) => handleChange('sendingdata', [e.target.value, formData.sendingdata[1]])} required />
                    <Input placeholder="Off Data" value={formData.sendingdata[1]} onChange={(e) => handleChange('sendingdata', [formData.sendingdata[0], e.target.value])} required />
                    <Input placeholder="Char" value={formData.char} onChange={(e) => handleChange('char', e.target.value)} />
                    <Input placeholder="Action" value={formData.action} onChange={(e) => handleChange('action', e.target.value)} required />
                </div>
            )}

            {formData.type === 'toggle' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Pin Number" value={formData.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input placeholder="On Data" value={formData.ondata} onChange={(e) => handleChange('ondata', e.target.value)} required />
                    <Input placeholder="Off Data" value={formData.offdata} onChange={(e) => handleChange('offdata', e.target.value)} required />
                    <Input placeholder="Char" value={formData.char} onChange={(e) => handleChange('char', e.target.value)} />
                    <Select value={formData.defaultState} onValueChange={(value) => handleChange('defaultState', value)}>
                        <SelectTrigger><SelectValue placeholder="Default State" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="on">On</SelectItem>
                            <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="Action" value={formData.action} onChange={(e) => handleChange('action', e.target.value)} required />
                </div>
            )}

            {formData.type === 'touch' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Pin Number" value={formData.pinnumber} onChange={(e) => handleChange('pinnumber', e.target.value)} required />
                    <Input type="number" placeholder="Sensitivity" value={formData.sensitivity} onChange={(e) => handleChange('sensitivity', e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="On Data" value={formData.sendingdata[0]} onChange={(e) => handleChange('sendingdata', [e.target.value, formData.sendingdata[1]])} required />
                        <Input placeholder="Off Data" value={formData.sendingdata[1]} onChange={(e) => handleChange('sendingdata', [formData.sendingdata[0], e.target.value])} required />
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
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