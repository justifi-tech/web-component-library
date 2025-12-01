import React from 'react';

interface UsageSnippetProps {
  title: string;
  code: string;
  language?: string;
  description?: string;
}

export const UsageSnippet: React.FC<UsageSnippetProps> = ({
  title,
  code,
  language = 'html',
  description,
}) => (
  <section className="docs-usage-snippet">
    <header>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </header>
    <pre>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  </section>
);

