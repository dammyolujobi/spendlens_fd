import type { Metadata } from 'next'
import { Playfair_Display, DM_Mono, DM_Sans, Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { AppLayout } from '@/components/app-layout'
import './globals.css'
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", weight: ["300", "400", "500"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["300", "400", "500"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: 'SpendLens',
  description: 'Track your spending with ease',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmMono.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
      </head>
      <body>
        <AuthProvider>
          <SettingsProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AppLayout>
                {children}
              </AppLayout>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
