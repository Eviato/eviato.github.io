import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Have infrastructure that needs attention?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Tell me about the platform, the pipeline, or the middleware that's
          slowing you down.
        </p>

        <a
          href="mailto:mbrunet@dawtio.cloud"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          <Mail size={16} />
          mbrunet@dawtio.cloud
        </a>
      </div>
    </section>
  )
}
