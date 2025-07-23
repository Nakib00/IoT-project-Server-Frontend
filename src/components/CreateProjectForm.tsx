import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';

interface CreateProjectFormProps {
  onSuccess: () => void;
}

const BOARD_OPTIONS = [
  { value: 'ESP32', label: 'ESP32' },
  { value: 'ESP8266', label: 'ESP8266' },
  { value: 'Arduino Uno', label: 'Arduino Uno' },
  { value: 'Arduino Nano', label: 'Arduino Nano' },
  { value: 'Raspberry Pi', label: 'Raspberry Pi' },
  { value: 'Custom', label: 'Custom Board' },
];

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [board, setBoard] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !board) {
      return;
    }

    setIsLoading(true);
    
    try {
      await createProject({
        name: name.trim(),
        description: description.trim(),
        board,
      });
      
      // Reset form
      setName('');
      setDescription('');
      setBoard('');
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          type="text"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          placeholder="Describe your IoT project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="board-select">Board Type</Label>
        <Select value={board} onValueChange={setBoard} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a board type" />
          </SelectTrigger>
          <SelectContent>
            {BOARD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !name.trim() || !description.trim() || !board}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            'Create Project'
          )}
        </Button>
      </div>
    </form>
  );
};