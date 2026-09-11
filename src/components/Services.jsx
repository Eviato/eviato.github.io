import { FileCode2, Boxes, Server, GitBranch, Cloud, Waypoints } from 'lucide-react'

const SERVICES = [
  {
    icon: FileCode2,
    title: 'Infrastructure as Code',
    description:
      'Cloud infrastructure modeled in Terraform — modular, reviewable, and reproducible across environments. HashiCorp Terraform Enterprise certified.',
  },
  {
    icon: Boxes,
    title: 'Kubernetes & OpenShift',
    description:
      'Cluster design, hardening, and day-two operations on Kubernetes and OpenShift. CKA certified.',
  },
  {
    icon: Server,
    title: 'Web & App Servers',
    description:
      'Installation, tuning, and configuration of application and web servers — JBoss EAP, WildFly, Apache, Nginx, Tomcat.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD Pipelines',
    description:
      'Build, test, and deployment pipelines that ship confidently — GitHub Actions, GitLab CI, ArgoCD.',
  },
  {
    icon: Cloud,
    title: 'Cloud Platforms',
    description:
      'Architecture and cost-aware operations across AWS, GCP, and Azure.',
  },
  {
    icon: Waypoints,
    title: 'Messaging & Integration',
    description:
      'Working knowledge of the integration layer between systems — Kafka, RabbitMQ, and API gateways — when a platform needs it.',
  },
]

export default function Services() {
  return (
    <section id="services" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Services</h2>
          <p className="mt-4 text-muted">
            Engagements ranging from focused infrastructure audits to
            long-term platform ownership.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-surface p-6 transition hover:border-accent/40 hover:bg-surface-2"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-bg text-accent">
                <Icon size={18} strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
