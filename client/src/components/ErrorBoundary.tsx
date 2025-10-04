import { Component, ReactNode } from 'react';
import { Typography, Button, CssBaseline } from '@mui/material';
import Column from '@/components/Layout/Containers/Column';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Column
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1328 100%)',
            color: '#e0e0e0',
            padding: 0,
            margin: 0,
          }}
        >
          <CssBaseline />
          <img src="/assets/finsightIcon.png" alt="App Logo" width={200} height={200} />
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: '#fafafa',
              mb: 0.5,
              textShadow: '0 0 10px rgba(156, 136, 255, 0.3)',
            }}
          >
            Something went wrong
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.65)',
              maxWidth: 300,
              mb: 3,
            }}
          >
            Please try refreshing the page.
          </Typography>
          <Button
            variant="outlined"
            onClick={this.handleReload}
            sx={{
              textTransform: 'none',
              borderColor: 'rgba(156, 136, 255, 0.4)',
              color: 'rgba(156, 136, 255, 0.9)',
              px: 4,
            }}
          >
            Reload
          </Button>
        </Column>
      );
    }

    return this.props.children;
  }
}
