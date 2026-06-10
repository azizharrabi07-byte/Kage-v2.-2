import React from 'react';

export default class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#0A0A0F', color: '#E31E24',
          flexDirection: 'column', padding: 20, fontFamily: 'monospace', zIndex: 9999
        }}>
          <div style={{fontSize: 24, marginBottom: 12}}>⚡ REACT ERROR</div>
          <pre style={{color: '#fff', fontSize: 12, maxWidth: 500, whiteSpace: 'pre-wrap', textAlign: 'center'}}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{
            marginTop: 20, padding: '8px 24px', background: '#E31E24', color: '#fff',
            border: 'none', borderRadius: 8, fontFamily: 'monospace', cursor: 'pointer'
          }}>
            RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
