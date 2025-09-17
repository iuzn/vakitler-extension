import Layout from '@/components/layout/Layout';
import Main from '@/components/views/Main';
import RootLayout from '@/components/layout/RootLayout';
import { VisibilityProvider } from '@/context/VisibilityContext';

export default function App() {
  return (
    <VisibilityProvider>
      <RootLayout>
        <Layout>
          <Main />
        </Layout>
      </RootLayout>
    </VisibilityProvider>
  );
}
