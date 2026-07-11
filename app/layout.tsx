import type { Metadata } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Site';
import { site } from '@/config/site';
const inter=Inter({subsets:['latin'],variable:'--font-sans'}); const mono=DM_Mono({subsets:['latin'],weight:['400','500'],variable:'--font-mono'});
export const metadata: Metadata={title:'Austin Liu — Dental Student in Adelaide',description:site.description,metadataBase:new URL('https://austinliu.com'),openGraph:{title:'Austin Liu — Dental Student in Adelaide',description:site.description,type:'website'},twitter:{card:'summary_large_image',title:'Austin Liu — Dental Student in Adelaide',description:site.description}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body className={`${inter.variable} ${mono.variable}`}><Providers>{children}</Providers></body></html>}
