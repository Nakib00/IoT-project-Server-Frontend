import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Button as ButtonType, useProjects } from '@/hooks/useProjects';
import { Edit, Trash2 } from 'lucide-react';
import { EditButtonForm } from './EditButtonForm';
import { SignalButton } from './SignalButton';

interface SignalCardProps {
    button: ButtonType;
    onUpdate: () => void;
    onDelete: (buttonId: string) => void;
    onEdit: (button: ButtonType) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ button, onUpdate, onDelete, onEdit }) => {
    const { deleteButton } = useProjects();

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${button.title}"?`)) {
            await deleteButton(button.id);
            onUpdate();
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{button.title}</CardTitle>
                    <div>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(button)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{button.type}</Badge>
                    <Badge variant="secondary" className="ml-2">{button.pinnumber}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <SignalButton button={button} />
                </div>
            </CardContent>
        </Card>
    );
};