import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const ResumeContent = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch('/data/resume.md');
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error('Error loading resume:', error);
        setMarkdownContent('# Error loading resume\nPlease check the resume.md file.');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 md:px-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:px-8 px-4">
      <div className="flex justify-end mb-4">
        <Button asChild>
          <a 
            href="/data/resume.pdf" 
            download="resume.pdf"
            className="inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>
      <div className="bg-card/80 border border-border/30 rounded-lg shadow-lg md:p-12 p-6 resume-content prose prose-lg max-w-none">
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
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ResumeContent;