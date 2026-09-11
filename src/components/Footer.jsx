export default function Footer() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <span className="font-mono">dawtio.cloud</span>
        <span>© {new Date().getFullYear()} Dawtio — Maxime Brunet</span>
        <a href="mailto:mbrunet@dawtio.cloud" className="hover:text-ink">
          mbrunet@dawtio.cloud
        </a>
      </div>
    </footer>
  )
}
