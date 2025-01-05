import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'} rounded-lg p-4 shadow`}>
        <div className="flex items-center mb-2">
          {message.sender === 'user' ? (
            <User className="w-6 h-6 mr-2 text-white" />
          ) : (
            <Bot className="w-6 h-6 mr-2 text-blue-500" />
          )}
          <span className="font-semibold">{message.sender === 'user' ? 'You' : 'Assistant'}</span>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;

