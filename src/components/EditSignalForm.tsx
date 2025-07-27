import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects, Signal } from '@/hooks/useProjects';

interface EditSignalFormProps {
    signal: Signal;
    onSuccess: () => void;
}

export const EditSignalForm: React.FC<EditSignalFormProps> = ({ signal, onSuccess }) => {
    const [title, setTitle] = useState(signal.title);
    const [isLoading, setIsLoading] = useState(false);
    const { updateSignalTitle } = useProjects();

    useEffect(() => {
        setTitle(signal.title);
    }, [signal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            await updateSignalTitle(signal.id, title.trim());
            onSuccess();
        } catch (error) {
            console.error('Failed to update signal title:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="edit-signal-title">Signal Title</Label>
                <Input
                    id="edit-signal-title"
                    type="text"
                    placeholder="Enter signal title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="bg-gradient-primary hover:opacity-90"
                >
                    {isLoading ? 'Updating...' : 'Update Signal'}
                </Button>
            </div>
        </form>
    );
};
