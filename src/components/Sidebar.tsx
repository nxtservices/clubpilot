'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare2,
  Users2,
  Users3,
  FileText,
  BookOpen,
  Gavel,
  Vote,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { TenantSelector } from '@/components/TenantSelector';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      label: 'Cockpit',
      href: '/cockpit',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Agenda',
      href: '/agenda',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Vrijwilligers',
      href: '/vrijwilligers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Taken',
      href: '/taken',
      icon: <CheckSquare2 className="w-5 h-5" />,
    },
    {
      label: 'Commissies',
      href: '/commissies',
      icon: <Users2 className="w-5 h-5" />,
    },
    {
      label: 'Teams',
      href: '/teams',
      icon: <Users3 className="w-5 h-5" />,
    },
    {
      label: 'Documenten',
      href: '/documenten',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Vergaderingen',
      href: '/vergaderingen',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Besluiten',
      href: '/besluiten',
      icon: <Gavel className="w-5 h-5" />,
    },
    {
      label: 'Stemmingen',
      href: '/stemmingen',
      icon: <Vote className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 lg:hidden bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-brand-navy" />
        ) : (
          <Menu className="w-6 h-6 text-brand-navy" />
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-brand-border z-40 transform transition-all duration-300 lg:transform-none lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-brand-border bg-gradient-to-br from-white to-brand-light">
            <div className="flex items-center gap-2 mb-1">
              <Image
                src="/images/clubpilot-logo.svg"
                alt="ClubPilot"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-navy bg-clip-text text-transparent">
                ClubPilot
              </h1>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">De slimme cockpit</p>
          </div>

          {/* Tenant Selector */}
          <TenantSelector />

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="px-2 py-2 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-navy hover:bg-brand-light'
                }`}
              >
                <span className={isActive(item.href) ? 'text-white' : 'text-brand-primary'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {isActive(item.href) && (
                  <ChevronRight className="w-4 h-4 opacity-75" />
                )}
                {item.badge && (
                  <span className="ml-auto bg-brand-accent text-white text-xs font-bold rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer Menu */}
          <div className="p-4 border-t border-brand-border space-y-1 bg-brand-light">
            <Link
              href="/notificaties"
              className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/notificaties')
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-navy hover:bg-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-sm font-medium">Notificaties</span>
            </Link>

            <Link
              href="/instellingen"
              className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/instellingen')
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-navy hover:bg-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Instellingen</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Afmelden</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
