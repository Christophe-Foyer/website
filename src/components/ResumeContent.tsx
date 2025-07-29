import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ResumeContent = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch('/src/data/resume.md');
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
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="resume-content prose prose-lg max-w-none">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ResumeContent;