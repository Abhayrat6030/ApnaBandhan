
import { Service, Package, Order, WhyChooseUs, ServiceCategoryInfo } from './types';

// This file is now deprecated for services and packages.
// Data is fetched directly from Firestore.
export const services: Service[] = [];
export const packages: Package[] = [];


export const whyChooseUs: WhyChooseUs[] = [
  {
    icon: 'Sparkles',
    title: 'Professional Work',
    description: 'Our experienced designers create stunning visuals that tell your story beautifully.'
  },
  {
    icon: 'Film',
    title: 'On-Time Delivery',
    description: 'We understand the importance of deadlines and guarantee timely delivery of all projects.'
  },
  {
    icon: 'Heart',
    title: 'Affordable Pricing',
    description: 'Get premium quality services at prices that won’t stretch your wedding budget.'
  },
  {
    icon: 'Users',
    title: 'Real Human Support',
    description: 'Our team is always available on WhatsApp and phone to assist you at every step.'
  },
];

export const serviceCategories: ServiceCategoryInfo[] = [
    {
      id: 'invitation-videos',
      name: 'Invitation Videos',
      description: 'Announce your special day with a stunning video that captures your love story.',
      href: '/invitation-videos',
    },
    {
      id: 'invitation-cards',
      name: 'Invitation Cards',
      description: 'Elegant and modern digital & printable cards for every wedding style.',
      href: '/invitation-cards',
    },
    {
        id: 'video-editing',
        name: 'Wedding Video Editing',
        description: 'We edit your raw footage into a beautiful, cinematic wedding film.',
        href: '/video-editing',
    },
    {
      id: 'album-design',
      name: 'Album Designs',
      description: 'Treasure your memories with a beautifully designed, professional wedding album.',
      href: '/album-design',
    },
    {
      id: 'cdr-files',
      name: 'CDR Files',
      description: 'Get print-ready CorelDRAW source files for your invitation cards.',
      href: '/invitation-cards?filter=cdr',
    },
    {
      id: 'combo-packages',
      name: 'Combo Packages',
      description: 'Get the best value with our curated packages combining our most popular services.',
      href: '/packages',
    },
     {
      id: 'website-development',
      name: 'Full Professional Website',
      description: 'We can create a professional website for your personal or business needs.',
      href: '/contact',
    },
];
