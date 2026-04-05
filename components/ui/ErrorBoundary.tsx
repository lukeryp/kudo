'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.label ?? 'unknown'}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-[12px] p-8 text-center text-sm"
          style={{
            background: 'rgba(255,80,80,0.06)',
            border: '1px solid rgba(255,80,80,0.18)',
            color: 'rgba(255,255,255,0.52)',
          }}
        >
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-white">Failed to load</p>
            <p className="mt-1 text-xs">{this.state.error?.message}</p>
          </div>
          <button
            className="btn btn-ghost text-xs"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
