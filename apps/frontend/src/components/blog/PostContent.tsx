import ReactMarkdown from 'react-markdown';
import { Highlight, themes } from 'prism-react-renderer';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <Highlight
                theme={themes.nightOwl}
                code={String(children).replace(/\n$/, '')}
                language={match[1]}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} rounded-lg overflow-x-auto`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="select-none opacity-50 mr-4 text-sm">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            );
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-md"
                loading="lazy"
              />
            );
          },
          a({ href, children }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
