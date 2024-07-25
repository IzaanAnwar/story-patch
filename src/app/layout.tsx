import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Topbar } from '@/components/topbar';
import { ReactQueryProvider } from '@/providers/react-query';
import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Story Patch',
  description: 'Contribute to stories, one patch at a time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Toaster
        duration={3000}
        position='bottom-center'
        toastOptions={{
          classNames: {
            success: 'bg-green-500 text-white border-green-700',
            error: 'bg-destructive text-white border-destructive',
          },
        }}
      />
      <body className={inter.className}>
        <NextTopLoader />
        <ReactQueryProvider>
          <>
            <Topbar />
            {children}
            <Footer />
          </>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
