import { Service, Package, Order, WhyChooseUs, ServiceCategory } from './types';

export const services: Service[] = [
  {
    id: 'save-the-date-video',
    name: 'Save The Date Video',
    slug: 'save-the-date-video',
    category: 'invitation-videos',
    description: 'Create excitement with a beautiful Save The Date video. Perfect for sharing on social media.',
    price: 1500,
    priceType: 'starting',
    isFeatured: true,
    samples: [
      { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'image', url: 'https://picsum.photos/seed/sv1/600/400', imageHint: 'wedding couple' },
    ],
    inclusions: ['HD Quality Video (1080p)', 'Custom Text & Couple Names', '1 Song of Your Choice', 'Delivery in 2 days'],
    deliveryTime: '2-3 Business Days',
  },
  {
    id: 'wedding-invitation-video',
    name: 'Wedding Invitation Video',
    slug: 'wedding-invitation-video',
    category: 'invitation-videos',
    description: 'A cinematic wedding invitation video to impress your guests.',
    price: 2500,
    priceType: 'starting',
    isFeatured: true,
    samples: [
      { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
       { type: 'image', url: 'https://picsum.photos/seed/wv1/600/400', imageHint: 'wedding ceremony' },
    ],
    inclusions: ['2-3 Minute Full HD Video', 'Detailed Event Information', 'Photo & Video Integration', 'Voice Over option'],
    deliveryTime: '4-5 Business Days',
  },
  {
    id: 'digital-cards',
    name: 'Digital Invitation Cards',
    slug: 'digital-cards',
    category: 'invitation-cards',
    description: 'Eco-friendly and modern digital cards (Image/PDF) for WhatsApp and email.',
    price: 800,
    priceType: 'fixed',
    isFeatured: true,
    samples: [
      { type: 'image', url: 'https://picsum.photos/seed/dc1/600/800', imageHint: 'invitation card' },
      { type: 'image', url: 'https://picsum.photos/seed/dc2/600/800', imageHint: 'floral invitation' },
    ],
    inclusions: ['High-Resolution JPEG/PNG', 'Print-ready PDF file', 'Clickable Google Maps Link', '2 Design Revisions'],
    deliveryTime: '1-2 Business Days',
  },
    {
    id: 'cdr-file-card',
    name: 'Print-Ready (CDR) Cards',
    slug: 'cdr-file-card',
    category: 'invitation-cards',
    description: 'Get the source file of your card design in CorelDRAW (CDR) format for unlimited printing.',
    price: 1200,
    priceType: 'fixed',
    isFeatured: false,
    samples: [
      { type: 'image', url: 'https://picsum.photos/seed/cdr1/600/800', imageHint: 'elegant invitation' },
    ],
    inclusions: ['Fully-editable CDR file', 'All fonts used', 'Color palette information', 'Guidance for printing press'],
    deliveryTime: '2-3 Business Days',
  },
  {
    id: 'full-wedding-video-editing',
    name: 'Full Wedding Video Editing',
    slug: 'full-wedding-video-editing',
    category: 'video-editing',
    description: 'We edit your raw wedding footage into a beautiful, cinematic full-length movie.',
    price: 15000,
    priceType: 'starting',
    isFeatured: true,
    samples: [
       { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
       { type: 'image', url: 'https://picsum.photos/seed/fve1/600/400', imageHint: 'wedding film' },
    ],
    inclusions: ['Editing up to 8 hours of footage', 'Color Grading & Correction', 'Sound Design & Mixing', 'Cinematic Highlight Reel (3-5 min)'],
    deliveryTime: '15-20 Business Days',
  },
    {
    id: 'album-design',
    name: 'Wedding Album Design',
    slug: 'album-design',
    category: 'album-design',
    description: 'Professional and creative design for your wedding photo album.',
    price: 5000,
    priceType: 'starting',
    isFeatured: true,
    samples: [
       { type: 'image', url: 'https://picsum.photos/seed/ad1/800/600', imageHint: 'wedding album' },
       { type: 'image', url: 'https://picsum.photos/seed/ad2/800/600', imageHint: 'photo album' },
    ],
    inclusions: ['Design for 30-page album', 'Upto 150 photos', 'Creative Layouts', 'Print-ready soft copy'],
    deliveryTime: '7-10 Business Days',
  },
  {
    id: 'combo-premium',
    name: 'Premium Invite Combo',
    slug: 'combo-premium',
    category: 'combo-packages',
    description: 'The ultimate package for a grand wedding announcement.',
    price: 4999,
    priceType: 'fixed',
    isFeatured: true,
    samples: [
       { type: 'image', url: 'https://picsum.photos/seed/cp1/600/400', imageHint: 'luxury wedding' },
    ],
    inclusions: ['Premium Cinematic Video', 'Matching Digital Card (PDF/JPG)', 'Animated Save the Date GIF', 'Priority Support'],
    deliveryTime: '5-7 Business Days',
  },
];

export const packages: Package[] = [
  {
    id: 'combo-basic',
    name: 'Card + Video Combo',
    price: '₹2,999',
    description: 'Perfect for getting started with a beautiful invitation set.',
    features: [
      'Standard Invitation Video',
      'Matching Digital Card',
      '2 Revisions',
      'Delivery in 4 days',
    ],
    isBestValue: false,
  },
  {
    id: 'combo-premium',
    name: 'Premium Cinematic Combo',
    price: '₹4,999',
    description: 'Our most popular package for a stunning impression.',
    features: [
      'Premium Cinematic Video',
      'Matching Premium Digital Card',
      'Save The Date GIF',
      '4 Revisions',
      'Priority Delivery (3 days)',
    ],
    isBestValue: true,
  },
  {
    id: 'combo-full',
    name: 'Full Wedding Invite Combo',
    price: '₹7,999',
    description: 'A complete solution for all your wedding invitation needs.',
    features: [
      'Everything in Premium Combo',
      'Reception Invitation Video',
      'Thank You Card Digital',
      'Unlimited Revisions',
      'Dedicated Designer',
    ],
    isBestValue: false,
  },
];

export const whyChooseUs: WhyChooseUs[] = [
  {
    icon: 'Heart',
    title: 'Professional Work',
    description: 'Our experienced designers create stunning visuals that tell your story beautifully.'
  },
  {
    icon: 'Film',
    title: 'On-Time Delivery',
    description: 'We understand the importance of deadlines and guarantee timely delivery of all projects.'
  },
  {
    icon: 'Printer',
    title: 'Affordable Pricing',
    description: 'Get premium quality services at prices that won’t stretch your wedding budget.'
  },
  {
    icon: 'Gift',
    title: 'Real Human Support',
    description: 'Our team is always available on WhatsApp and phone to assist you at every step.'
  },
];

export const serviceCategories: { id: ServiceCategory; name: string }[] = [
    { id: 'invitation-videos', name: 'Invitation Videos' },
    { id: 'invitation-cards', name: 'Invitation Cards' },
    { id: 'combo-packages', name: 'Combo Packages' },
    { id: 'video-editing', name: 'Full Wedding Video Editing' },
    { id: 'album-design', name: 'Album Designing' },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    clientName: 'Rohan Sharma',
    phone: '+919876543210',
    email: 'rohan.sharma@example.com',
    weddingDate: '2024-12-15',
    service: 'Premium Cinematic Combo',
    message: 'Looking for a royal theme.',
    status: 'In Progress',
    paymentStatus: 'Paid',
    orderDate: '2024-10-20',
  },
  {
    id: 'ORD002',
    clientName: 'Priya Patel',
    phone: '+919123456789',
    email: 'priya.patel@example.com',
    weddingDate: '2025-01-22',
    service: 'Save The Date Video',
    message: 'Need it urgently.',
    status: 'Pending',
    paymentStatus: 'Advance',
    orderDate: '2024-10-22',
  },
    {
    id: 'ORD003',
    clientName: 'Ankit Desai',
    phone: '+919988776655',
    email: 'ankit.desai@example.com',
    weddingDate: '2024-11-30',
    service: 'Wedding Album Design',
    message: 'We have about 200 photos for a 40-page album.',
    status: 'Delivered',
    paymentStatus: 'Paid',
    orderDate: '2024-09-15',
  },
    {
    id: 'ORD004',
    clientName: 'Sneha Verma',
    phone: '+919223344556',
    email: 'sneha.verma@example.com',
    weddingDate: '2025-02-10',
    service: 'Digital Invitation Cards',
    message: '',
    status: 'Paid',
    paymentStatus: 'Paid',
    orderDate: '2024-10-23',
  },
];
