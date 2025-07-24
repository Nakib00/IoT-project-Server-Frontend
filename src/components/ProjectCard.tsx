import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/hooks/useProjects';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Cpu, 
  Wifi, 
  WifiOff, 
  AlertCircle,
  Activity 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = () => {
    return project.totalsensor > 0 ? 'bg-success text-white' : 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = () => {
    return project.totalsensor > 0 ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />;
  };

  const getStatusText = () => {
    return project.totalsensor > 0 ? 'Active' : 'No Sensors';
  };

  return (
    <Card className="hover:shadow-card transition-all duration-200 bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{project.projectName}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4" />
            <span>{project.developmentBoard}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>{project.totalsensor} sensors</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated {project.updatedAt && !isNaN(new Date(project.updatedAt).getTime()) 
            ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
            : 'Unknown'
          }
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(project)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(project)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(project)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};