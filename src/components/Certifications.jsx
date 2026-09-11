import { Award } from 'lucide-react'

const CERTS = [
  'HashiCorp Certified — Terraform Enterprise',
  'CKA — Certified Kubernetes Administrator',
]

export default function Certifications() {
  return (
    <div className="border-b border-border bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-sm text-muted sm:justify-start">
        {CERTS.map((cert) => (
          <span key={cert} className="inline-flex items-center gap-2">
            <Award size={15} className="text-accent" strokeWidth={2} />
            {cert}
          </span>
        ))}
      </div>
    </div>
  )
}
