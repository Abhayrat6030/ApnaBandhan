
import type { NavItem } from './types';

export const siteConfig = {
  name: 'ApnaBandhan',
  tagline: 'Wedding Invitations • Videos • Albums • Wedding Card Design',
  phone: '+91 8463062603',
  email: 'abhayrat603@gmail.com',
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
  { label: 'Intelligence', href: '/admin/intelligence' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Users', href: '/admin/users'},
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Downloads', href: '/admin/downloads' },
  { label: 'Requests', href: '/admin/requests' },
  { label: 'Coupons', href: '/admin/rewards' },
  { label: 'Referrals', href: '/admin/referrals' },
  { label: 'App Settings', href: '/admin/settings' },
  { label: 'AI Settings', href: '/admin/ai-settings' },
];

export const mainAppNavItems: NavItem[] = [
    { label: 'Return to Main Site', href: '/' },
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
