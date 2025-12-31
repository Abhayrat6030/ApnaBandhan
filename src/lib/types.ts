

export type NavItem = {
  label: string;
  href: string;
};

export type ServiceCategory = 'invitation-videos' | 'invitation-cards' | 'combo-packages' | 'video-editing' | 'album-design';

export type ServiceCategoryInfo = {
  id: string; // Can be a category or a different ID for combos
  name: string;
  description: string;
  href: string;
  imageUrl: string;
  imageHint: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  price: number;
  originalPrice?: number;
  priceType: 'starting' | 'fixed';
  isFeatured: boolean;
  topRated?: boolean;
  rating?: number;
  samples: { type: 'image' | 'video'; url: string, imageHint?: string }[];
  inclusions: string[];
  deliveryTime: string;
  tags?: string[];
};

export type Package = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isBestValue: boolean;
};

export type WhyChooseUs = {
    icon: keyof typeof import('lucide-react');
    title: string;
    description: string;
};

export type Order = {
    id: string;
    clientName: string;
    phone: string;
    email: string;
    weddingDate: string | Date;
    service: string;
    message: string;
    status: 'Pending' | 'Paid' | 'In Progress' | 'Delivered';
    paymentStatus: 'Pending' | 'Advance' | 'Paid';
    orderDate: string | Date;
    userId?: string;
}
