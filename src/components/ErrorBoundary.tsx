// components/ErrorBoundary.tsx
// catches render errors and shows a fallback instead of a blank screen
// has to be a class component — function components can't do this yet

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError:   boolean
  errorMsg:   string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMsg: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[CSS Battle Arena] Caught error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="text-center max-w-md px-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              The game hit an unexpected error. Your progress is saved —
              refreshing the page will bring you back to where you were.
            </p>
            {this.state.errorMsg && (
              <code className="text-xs text-red-400 font-mono block mb-6 bg-red-500/10 px-4 py-3 rounded-lg text-left">
                {this.state.errorMsg}
              </code>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors"
            >
              Reload game
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}