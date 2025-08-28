import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Almastack - Trasformiamo idee in realtà digitali',
    description: 'Sviluppiamo soluzioni web innovative e scalabili per far crescere il tuo business nel mondo digitale.'
}

export default function RootLayout({
    children,
}) {
    return (
        <html lang="it">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
