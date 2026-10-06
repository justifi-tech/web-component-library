import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({ children, language = 'html' }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{ borderRadius: '4px', fontSize: '14px', lineHeight: 1.5 }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
