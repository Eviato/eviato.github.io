import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'

const TERMINAL_LINES = [
  { prompt: true, text: 'terraform apply' },
  { text: 'module.platform.openshift_cluster: Creating…' },
  { text: 'module.platform.openshift_cluster: Creation complete' },
  { text: 'module.middleware.eap_server: Creation complete' },
  { ok: true, text: 'Apply complete. 3 resources added, 0 changed, 0 destroyed.' },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Independent DevOps &amp; middleware contractor
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Infrastructure that runs <span className="text-gradient">itself.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            I'm Maxime Brunet — I design, build, and operate the
            infrastructure behind production systems: Terraform-managed
            cloud, Kubernetes &amp; OpenShift platforms, and the web and
            application server layer (JBoss EAP and friends) they run on.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
            >
              Get in touch
              <ArrowRight size={16} />
            </a>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-ink transition hover:border-muted"
            >
              <BookOpen size={16} />
              Read the blog
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-2xl shadow-black/40">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-xs text-muted">platform.tf</span>
            </div>
            <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.ok
                      ? 'text-accent'
                      : line.prompt
                        ? 'text-ink'
                        : 'text-muted'
                  }
                >
                  {line.prompt && <span className="text-accent-2">$ </span>}
                  {line.text}
                </div>
              ))}
              <div className="text-ink">
                <span className="text-accent-2">$ </span>
                <span className="animate-pulse">▍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
