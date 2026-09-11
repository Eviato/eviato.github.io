import { Search, Hammer, PhoneCall } from 'lucide-react'

const ENGAGEMENTS = [
  {
    icon: Search,
    title: 'Infrastructure audits',
    description: 'A focused review of what you have, what it costs, and where it will break first.',
  },
  {
    icon: Hammer,
    title: 'Platform builds',
    description: 'New infrastructure and platforms, designed and shipped from the ground up.',
  },
  {
    icon: PhoneCall,
    title: 'Ongoing support',
    description: 'Embedded or on-call, keeping platforms and pipelines healthy over time.',
  },
]

export default function About() {
  return (
    <section id="about" className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink">About</h2>
          <p className="mt-6 leading-relaxed text-muted">
            I'm Maxime Brunet, an independent contractor working at the
            infrastructure layer — Terraform-managed cloud, Kubernetes and
            OpenShift platforms, and the web and application servers they
            host. I partner with engineering teams to design that
            infrastructure and build the platforms that ship code safely,
            with enough middleware and integration knowledge to make sure it
            all fits together.
          </p>
        </div>

        <div className="space-y-6">
          {ENGAGEMENTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-accent">
                <Icon size={16} strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
