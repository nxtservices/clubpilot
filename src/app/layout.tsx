import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClubPilot - De slimme cockpit voor je vereniging',
  description: 'ClubPilot helps associations organize volunteers, committees, tasks, agenda, documents, meetings, decisions and voting in one central smart workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
