import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{ background: '#0d0d0d', color: '#fff', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <div className="text-5xl font-black" style={{ fontFamily: 'Raleway, sans-serif' }}>
        Ku<span style={{ color: '#00af51' }}>do</span>
      </div>
      <div>
        <h1 className="mb-2 text-xl font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Page not found
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.52)' }}>
          This page doesn&apos;t exist.
        </p>
      </div>
      <Link href="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  )
}
