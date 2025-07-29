import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project, Signal, Button as ButtonType } from '@/hooks/useProjects';
import { Edit, Trash2, Plus } from 'lucide-react';
import { SignalButton } from './SignalButton';

interface SignalSectionProps {
    project: Project;
    onEditSignal: (signal: Signal) => void;
    onDeleteSignal: (signalId: string) => void;
    onAddButton: (signalId: string) => void;
    onEditButton: (button: ButtonType) => void;
    onDeleteButton: (buttonId: string) => void;
}

export const SignalSection: React.FC<SignalSectionProps> = ({
    project,
    onEditSignal,
    onDeleteSignal,
    onAddButton,
    onEditButton,
    onDeleteButton,
}) => {
    if (!project.sendingsignal || project.sendingsignal.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg mt-6">
                <p className="text-muted-foreground">No sending signals configured.</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {project.sendingsignal.map((sendingSignal) =>
                    sendingSignal.signal.map((signal) => (
                        <Card key={signal.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{signal.title}</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEditSignal(signal)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDeleteSignal(signal.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onAddButton(signal.id)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {signal.button.map((button) => (
                                        <div key={button.id} className="rounded-lg border bg-background p-3 flex flex-col justify-between gap-4">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold">{button.title}</p>
                                                    <div>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditButton(button)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteButton(button.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">{button.type}</Badge>
                                                    <Badge variant="secondary" className="ml-2">{button.pinnumber}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <SignalButton button={button} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};