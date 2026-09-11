import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pin, Search, X } from 'lucide-react'
import { allTags, posts } from '../lib/posts.js'

function formatDate(date) {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogIndex() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  function toggleTag(tag) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    )
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag))
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchesTags && matchesQuery
    })
  }, [query, selectedTags])

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Blog</h1>
      <p className="mt-4 text-muted">
        Notes from infrastructure and platform work — Terraform, Kubernetes,
        OpenShift, and everything running on top of them.
      </p>

      <div className="relative mt-10">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-muted focus:border-accent/50 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTags([])}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
              selectedTags.length === 0
                ? 'border-accent/50 bg-accent/10 text-accent'
                : 'border-border text-muted hover:text-ink'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={selectedTags.includes(tag)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                selectedTags.includes(tag)
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border text-muted hover:text-ink'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {filtered.length === 0 && (
          <p className="text-sm text-muted">No posts match your search.</p>
        )}

        {filtered.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block rounded-lg border border-border bg-surface p-6 transition hover:border-accent/40 hover:bg-surface-2"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-accent">
                  <Pin size={11} />
                  Pinned
                </span>
              )}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="mt-3 text-xl font-semibold text-ink">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>

            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Read post
              <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
