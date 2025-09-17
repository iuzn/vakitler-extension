import { useContext, Component, ReactNode, useState, useEffect } from 'react';
import {
  VakitlerStoreProvider,
  VakitlerStoreContext,
} from '../../context/VakitlerStoreContext';
import { I18nProvider, useI18nContext } from '../../context/I18nProvider';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import Layout from '../../components/vakitler/Layout';
import Location from '../../components/vakitler/Location';
import Summary from '../../components/vakitler/Summary';
import TimeList from '../../components/vakitler/TimeList';
import CitySelection from '../../components/vakitler/CitySelection';
import Settings from '../../components/settings/Settings';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Extension Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryWithI18n error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Separate component to use i18n context
const ErrorBoundaryWithI18n = ({ error }: { error?: Error }) => {
  const { t } = useI18nContext();

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-2 text-lg font-semibold text-red-400">
          {t('error')}
        </div>
        <div className="text-sm text-white/70">
          {error?.message || t('error')}
        </div>
        <div className="mt-2 text-xs text-white/50">{t('retry')}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
};

const PopupContent = () => {
  const { times, settings, isLoading, error } =
    useContext(VakitlerStoreContext);
  const { t, initialize } = useI18nContext();
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');

  // Initialize i18n when component mounts
  useEffect(() => {
    console.log('Popup: Initializing i18n system');
    initialize();
  }, [initialize]);

  // Show error if there's an error
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-red-400">
            {t('error')}
          </div>
          <div className="text-sm text-white/70">{error}</div>
          <div className="mt-2 text-xs text-white/50">{t('retry')}</div>
        </div>
      </div>
    );
  }

  // Show loading while initializing or fetching data
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If no city is selected, show full-page country selection (first time)
  if (!settings?.city) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900">
        <CitySelection onComplete={() => {}} showCloseButton={false} />
      </div>
    );
  }

  // Settings page
  if (currentPage === 'settings') {
    return <Settings onBack={() => setCurrentPage('main')} />;
  }

  return (
    <Layout>
      <Location onSettingsClick={() => setCurrentPage('settings')} />
      <Summary />
      <TimeList />
    </Layout>
  );
};

const Popup = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <VakitlerStoreProvider>
          <PopupContent />
        </VakitlerStoreProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default Popup;
