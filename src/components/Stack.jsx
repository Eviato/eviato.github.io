const STACK = [
  'Terraform',
  'Kubernetes',
  'OpenShift',
  'JBoss EAP',
  'WildFly',
  'Docker',
  'Apache',
  'Nginx',
  'Tomcat',
  'AWS',
  'GCP',
  'Azure',
  'Helm',
  'ArgoCD',
  'Ansible',
  'Prometheus',
  'Grafana',
  'GitHub Actions',
  'GitLab CI',
  'Kafka',
  'RabbitMQ',
]

export default function Stack() {
  return (
    <section id="stack" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight text-ink">Stack</h2>
        <p className="mt-4 max-w-xl text-muted">
          Tools I reach for most often — picked for what fits the problem,
          not novelty.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {STACK.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-ink/90"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
