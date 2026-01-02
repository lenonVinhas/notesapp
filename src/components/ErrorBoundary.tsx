import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-zinc-50 z-[200]">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-zinc-100 max-w-lg w-full text-center flex flex-col items-center">
            <div className="bg-amber-50 p-6 rounded-3xl mb-8 border border-amber-100">
              <AlertTriangle className="w-16 h-16 text-amber-500" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
              Algo deu errado
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-10">
              Ocorreu um erro inesperado na aplicação. Tente recarregar ou voltar para a página inicial.
            </p>

            <div className="flex gap-4 w-full">
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1 py-7 text-lg gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Recarregar App
              </Button>
              <Button 
                variant="secondary"
                onClick={this.handleReset}
                className="flex-1 py-7 text-lg bg-zinc-100 border-none"
              >
                Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
