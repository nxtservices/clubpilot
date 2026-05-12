'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutGrid,
  Calendar,
  Users,
  CheckSquare,
  FolderOpen,
  FileText,
  Users2,
  ClipboardList,
  Vote,
  Bell,
  Settings,
  LogOut,
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
      icon: <LayoutGrid className="w-5 h-5" />,
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
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      label: 'Commissies',
      href: '/commissies',
      icon: <Users2 className="w-5 h-5" />,
    },
    {
      label: 'Teams',
      href: '/teams',
      icon: <Users2 className="w-5 h-5" />,
    },
    {
      label: 'Documenten',
      href: '/documenten',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Vergaderingen',
      href: '/vergaderingen',
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      label: 'Besluiten',
      href: '/besluiten',
      icon: <ClipboardList className="w-5 h-5" />,
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
        className="fixed top-4 left-4 z-50 p-2 lg:hidden bg-white rounded-lg shadow-md hover:bg-gray-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-brand-dark" />
        ) : (
          <Menu className="w-6 h-6 text-brand-dark" />
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 transform transition-transform lg:transform-none lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-brand-dark">ClubPilot</h1>
            <p className="text-xs text-gray-500 mt-1">De slimme cockpit</p>
          </div>

          {/* Tenant Selector */}
          <TenantSelector />

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-brand-highlight text-brand-dark text-xs font-bold rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer Menu */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <Link
              href="/notificaties"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive('/notificaties')
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-sm font-medium">Notificaties</span>
            </Link>

            <Link
              href="/instellingen"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive('/instellingen')
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Instellingen</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Afmelden</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
