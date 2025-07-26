import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects, Project } from '@/hooks/useProjects';
import { ArrowLeft, Edit, Trash2, Calendar, Cpu, FileText, Copy, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditProjectForm } from '@/components/EditProjectForm';
import { AddSensorForm } from '@/components/AddSensorForm';
import { useToast } from '@/hooks/use-toast';
import { SensorCard } from '@/components/SensorCard';

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddSensorDialog, setShowAddSensorDialog] = useState(false);
  const { fetchProject, deleteProject } = useProjects();
  const { toast } = useToast();

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
  }, [projectId]);

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
          <h2 className="text-2xl font-bold">Sensors</h2>
          <Dialog open={showAddSensorDialog} onOpenChange={setShowAddSensorDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Sensor
              </Button>
            </DialogTrigger>
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
    </>
  );
};

export default ProjectView;