import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  filename: string;
  date: string;
  title: string;
  content: string;
}

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Fetch the projects manifest
        const manifestResponse = await fetch('/data/projects/projects-manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Failed to load projects manifest');
        }
        const projectFiles = await manifestResponse.json();

        const projectPromises = projectFiles.map(async (filename) => {
          try {
            const response = await fetch(`/data/projects/${filename}`);
            if (!response.ok) {
              console.warn(`Project file ${filename} not found`);
              return null;
            }
            const content = await response.text();
            
            // Extract date from filename
            const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
            const date = dateMatch ? dateMatch[1] : '';
            
            // Extract title from filename (remove date and .md extension)
            const title = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
            
            return {
              filename,
              date,
              title,
              content
            };
          } catch (error) {
            console.warn(`Error loading project ${filename}:`, error);
            return null;
          }
        });

        const loadedProjects = await Promise.all(projectPromises);
        const validProjects = loadedProjects.filter((p): p is Project => p !== null);
        
        // Sort by date descending (newest first)
        validProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setProjects(validProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:px-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Projects</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:px-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Projects</h2>
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No projects found. Add markdown files to /public/data/projects/</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.filename} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{project.date}</p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkEmoji, remarkGfm]}
                    components={{
                      img: ({alt, src, title}) => (
                        <img 
                          alt={alt} 
                          src={src} 
                          title={title}
                          className="rounded-lg shadow-md max-w-full h-auto my-4"
                        />
                      )
                    }}
                  >
                    {project.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;