import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';

const AboutMe = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutMe = async () => {
      try {
        const response = await fetch('/data/about.md');
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error('Error loading about me:', error);
        setMarkdownContent('# About Me\nContent coming soon...');
      } finally {
        setLoading(false);
      }
    };

    loadAboutMe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="about-content resume-content max-w-none">
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

export default AboutMe;