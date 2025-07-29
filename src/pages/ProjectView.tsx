import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects, Project, Signal, Button as ButtonType } from '@/hooks/useProjects';
import { useSocket } from '@/hooks/useSocket';
import { ArrowLeft, Edit, Trash2, Calendar, Cpu, FileText, Copy, Plus, LineChart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectForm } from '@/components/EditProjectForm';
import { AddSensorForm } from '@/components/AddSensorForm';
import { AddSignalForm } from '@/components/AddSignalForm';
import { EditSignalForm } from '@/components/EditSignalForm';
import { AddButtonForm } from '@/components/AddButtonForm';
import { EditButtonForm } from '@/components/EditButtonForm';
import { useToast } from '@/hooks/use-toast';
import { SensorCard } from '@/components/SensorCard';
import { SignalSection } from '@/components/SignalSection'; // Import the new component
import { CombineSensorsForm } from '@/components/CombineSensorsForm';
import { CombinedSensorGraphCard } from '@/components/CombinedSensorGraphCard';

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddSensorDialog, setShowAddSensorDialog] = useState(false);
  const [showAddSignalDialog, setShowAddSignalDialog] = useState(false);
  const [showCombineSensorsDialog, setShowCombineSensorsDialog] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [addingButtonToSignal, setAddingButtonToSignal] = useState<string | null>(null);
  const [editingButton, setEditingButton] = useState<ButtonType | null>(null);
  const { fetchProject, deleteProject, deleteSignal, deleteButton } = useProjects();
  const { toast } = useToast();
  const { joinProject, leaveProject, sensorData } = useSocket();

  const loadProject = async () => {
    if (projectId) {
      setLoading(true);
      const projectData = await fetchProject(projectId);
      setProject(projectData);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    if (projectId) {
      joinProject(projectId);
    }
    return () => {
      if (projectId) {
        leaveProject(projectId);
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (sensorData && project) {
      const updatedSensordata = project.sensordata?.map(sensor => {
        if (sensor.pinNumber === sensorData.pinNumber) {
          return {
            ...sensor,
            data: [...sensor.data, sensorData],
          };
        }
        return sensor;
      });
      setProject({ ...project, sensordata: updatedSensordata });
    }
  }, [sensorData]);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    loadProject();
  };

  const handleDelete = async () => {
    if (project && window.confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
      await deleteProject(project.projectId);
      navigate('/dashboard');
    }
  };

  const handleCopyToken = () => {
    if (project && project.token) {
      navigator.clipboard.writeText(project.token);
      toast({
        title: "Copied!",
        description: "Project token has been copied to your clipboard.",
      });
    }
  };

  const handleAddSensorSuccess = () => {
    setShowAddSensorDialog(false);
    loadProject();
  };

  const handleAddSignalSuccess = () => {
    setShowAddSignalDialog(false);
    loadProject();
  };

  const handleCombineSensorsSuccess = () => {
    setShowCombineSensorsDialog(false);
    loadProject();
  };

  const handleEditSignal = (signal: Signal) => {
    setEditingSignal(signal);
  };

  const handleEditSignalSuccess = () => {
    setEditingSignal(null);
    loadProject();
  };

  const handleDeleteSignal = async (signalId: string) => {
    if (window.confirm('Are you sure you want to delete this signal section?')) {
      await deleteSignal(signalId);
      loadProject();
    }
  };

  const handleAddButton = (signalId: string) => {
    setAddingButtonToSignal(signalId);
  };

  const handleAddButtonSuccess = () => {
    setAddingButtonToSignal(null);
    loadProject();
  };

  const handleEditButton = (button: ButtonType) => {
    setEditingButton(button);
  };

  const handleEditButtonSuccess = () => {
    setEditingButton(null);
    loadProject();
  };

  const handleDeleteButton = async (buttonId: string) => {
    if (window.confirm('Are you sure you want to delete this button?')) {
      await deleteButton(buttonId);
      loadProject();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.projectName}</h1>
            <p className="text-muted-foreground">Project Details</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Project Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Development Board</h4>
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <Cpu className="h-3 w-3 mr-1" />
                    {project.developmentBoard}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">Total Sensors</h4>
                  <Badge variant={project.totalsensor > 0 ? "default" : "outline"}>
                    {project.totalsensor} sensor{project.totalsensor !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={project.totalsensor > 0 ? "default" : "secondary"}>
                  {project.totalsensor > 0 ? "Active" : "Setup Required"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Project Token</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {project.token}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyToken}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Created</p>
                <p className="text-sm text-muted-foreground">
                  {project.createdAt && !isNaN(new Date(project.createdAt).getTime())
                    ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })
                    : 'Unknown'
                  }
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {project.updatedAt && !isNaN(new Date(project.updatedAt).getTime())
                    ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
                    : 'Unknown'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sensors Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Sensors & Signals</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowAddSensorDialog(true)}>
                Add Sensor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAddSignalDialog(true)}>
                Add New Signal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowCombineSensorsDialog(true)}>
                <LineChart className="h-4 w-4 mr-2" />
                Combine Sensors
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {project.sensordata && project.sensordata.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.sensordata.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} onUpdate={loadProject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No sensors added yet.</p>
          </div>
        )}
      </div>

      {/* Combined Sensor Graphs Section */}
      {project.convinesensorgraph && project.convinesensorgraph.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Combined Sensor Graphs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.convinesensorgraph.map((graph) => (
              <CombinedSensorGraphCard key={graph.id} graph={graph} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Sending Signal Section */}
      <SignalSection
        project={project}
        onEditSignal={handleEditSignal}
        onDeleteSignal={handleDeleteSignal}
        onAddButton={handleAddButton}
        onEditButton={handleEditButton}
        onDeleteButton={handleDeleteButton}
      />

      {/* Edit Dialog */}
      {project && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update your project information and settings.
              </DialogDescription>
            </DialogHeader>
            <EditProjectForm project={project} onSuccess={handleEditSuccess} />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Sensor Dialog */}
      <Dialog open={showAddSensorDialog} onOpenChange={setShowAddSensorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Sensor</DialogTitle>
            <DialogDescription>
              Enter the details for your new sensor.
            </DialogDescription>
          </DialogHeader>
          <AddSensorForm projectId={project.projectId} onSuccess={handleAddSensorSuccess} />
        </DialogContent>
      </Dialog>

      {/* Add Signal Dialog */}
      <Dialog open={showAddSignalDialog} onOpenChange={setShowAddSignalDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Signal</DialogTitle>
            <DialogDescription>
              Configure a new signal section with buttons.
            </DialogDescription>
          </DialogHeader>
          <AddSignalForm projectId={project.projectId} onSuccess={handleAddSignalSuccess} />
        </DialogContent>
      </Dialog>

      {/* Combine Sensors Dialog */}
      <Dialog open={showCombineSensorsDialog} onOpenChange={setShowCombineSensorsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Combine Sensors</DialogTitle>
            <DialogDescription>
              Create a new graph that combines data from multiple sensors.
            </DialogDescription>
          </DialogHeader>
          <CombineSensorsForm projectId={project.projectId} onSuccess={handleCombineSensorsSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Signal Dialog */}
      {editingSignal && (
        <Dialog open={!!editingSignal} onOpenChange={() => setEditingSignal(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Signal</DialogTitle>
              <DialogDescription>
                Update your signal's title.
              </DialogDescription>
            </DialogHeader>
            <EditSignalForm signal={editingSignal} onSuccess={handleEditSignalSuccess} />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Button Dialog */}
      {addingButtonToSignal && (
        <Dialog open={!!addingButtonToSignal} onOpenChange={() => setAddingButtonToSignal(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Button</DialogTitle>
              <DialogDescription>
                Add a new button to your signal.
              </DialogDescription>
            </DialogHeader>
            <AddButtonForm signalId={addingButtonToSignal} onSuccess={handleAddButtonSuccess} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Button Dialog */}
      {editingButton && (
        <Dialog open={!!editingButton} onOpenChange={() => setEditingButton(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Button</DialogTitle>
              <DialogDescription>
                Update your button's information.
              </DialogDescription>
            </DialogHeader>
            <EditButtonForm button={editingButton} onSuccess={handleEditButtonSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProjectView;