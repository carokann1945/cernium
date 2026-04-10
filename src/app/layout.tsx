import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Glegoo, IBM_Plex_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

const glegoo = Glegoo({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-glegoo',
});

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-ibmPlexSansKr',
});

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cernium.app'),
  title: {
    default: 'Cernium | GMS 점검 일정 & 진행중 이벤트',
    template: 'Cernium | %s',
  },
  description:
    'GMS 이벤트와 점검 공지를 자동으로 정리해 제공합니다. 진행 중 이벤트, 점검 일정, 한글 번역 요약본까지 한눈에 확인하세요.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${glegoo.variable} ${ibmPlexSansKr.variable}`}>
      <body className="antialiased font-ibmPlexSansKr bg-custom-bg text-main-white flex flex-col min-h-dvh scrollbar-custom">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
