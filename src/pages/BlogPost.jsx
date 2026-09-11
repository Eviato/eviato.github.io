import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { ArrowLeft } from 'lucide-react'
import { getPost } from '../lib/posts.js'
import Mermaid from '../components/Mermaid.jsx'

function isMermaidCode(node) {
  const className = node?.properties?.className
  return Array.isArray(className) && className.includes('language-mermaid')
}

const markdownComponents = {
  pre({ node, children }) {
    const codeNode = node?.children?.[0]
    if (codeNode && isMermaidCode(codeNode)) return children
    return <pre>{children}</pre>
  },
  code({ className, children, ...props }) {
    if (className?.includes('language-mermaid')) {
      return <Mermaid chart={String(children).replace(/\n$/, '')} />
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

function formatDate(date) {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent">
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 font-mono">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:text-ink prose-p:text-muted prose-li:text-muted prose-strong:text-ink prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent-2 prose-blockquote:border-accent/40 prose-blockquote:text-muted">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={markdownComponents}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
