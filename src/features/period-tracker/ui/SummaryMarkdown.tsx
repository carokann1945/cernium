'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

export default function SummaryMarkdown({ value }: { value: string | null }) {
  if (!value?.trim()) {
    return <p className={cn('text-sm text-custom-lightgray')}>요약본 데이터가 없어요</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className={cn('mt-8 text-2xl font-bold first:mt-0 text-custom-green')}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={cn('text-2xl font-bold mt-5 text-rose-300 underline underline-offset-7')}>📌 {children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={cn('text-xl font-bold mt-5 text-emerald-300 underline underline-offset-7')}>{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className={cn('text-lg font-bold mt-5 text-sky-300 underline underline-offset-7')}>{children}</h4>
        ),
        p: ({ children }) => <p className={cn('leading-7 text-base text-sub-white')}>{children}</p>,
        ul: ({ children }) => (
          <ul className={cn('list-disc pl-5 mt-3 mb-5 text-base space-y-3 text-sub-white')}>{children}</ul>
        ),
        ol: ({ children }) => <ol className={cn('list-decimal pl-5 mb-5 text-base text-sub-white')}>{children}</ol>,
        li: ({ children }) => <li className={cn('mb-3 text-base text-sub-white leading-7')}>{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-custom-green underline underline-offset-4')}>
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className={cn('border-l-4 border-custom-green/70 pl-4 text-sub-white')}>{children}</blockquote>
        ),
        pre: ({ children }) => (
          <pre className={cn('overflow-x-auto rounded-lg bg-black/30 p-4 text-sm')}>{children}</pre>
        ),
        code: ({ children, className }) =>
          className ? (
            <code className={className}>{children}</code>
          ) : (
            <code className={cn('rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]')}>{children}</code>
          ),
        table: ({ children }) => (
          <div className={cn('overflow-x-auto rounded-lg border border-white/10')}>
            <table className={cn('min-w-full border-collapse text-left text-sm lg:text-[16px] text-gray-300')}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className={cn('bg-white/5 text-gray-300')}>{children}</thead>,
        tr: ({ children }) => <tr className={cn('border-b border-white/10 align-top text-gray-300')}>{children}</tr>,
        th: ({ children }) => <th className={cn('px-3 py-2 font-semibold text-gray-300')}>{children}</th>,
        td: ({ children }) => <td className={cn('px-3 py-2 leading-7 text-gray-300')}>{children}</td>,
        strong: ({ children }) => <strong className={cn('font-normal text-gray-200')}>{children}</strong>,
      }}>
      {value}
    </ReactMarkdown>
  );
}
