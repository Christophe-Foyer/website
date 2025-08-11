import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (ref.current) {
      // Generate unique ID for each diagram
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(uniqueId, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={ref} className="mermaid-diagram my-4" />;
};

export default MermaidDiagram;