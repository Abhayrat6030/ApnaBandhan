
import type { NavItem } from './types';

export const siteConfig = {
  name: 'ApnaBandhan',
  tagline: 'Wedding Invitations • Videos • Albums',
  phone: '918463062603',
  email: 'abhayrat600@gmail.com',
  address: 'New Delhi, India',
  workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Services', href: '/admin/services' },
  { label: 'AI Enhancer', href: '/admin/ai-enhancer' },
];

export const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Profile', href: '/profile' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
  ],
};
