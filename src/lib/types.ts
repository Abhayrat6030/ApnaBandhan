

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
  slug?: string;
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
    userId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    weddingDate: string | Date;
    selectedServiceId: string;
    messageNotes: string;
    status: 'Pending' | 'Paid' | 'In Progress' | 'Delivered';
    paymentStatus: 'Pending' | 'Advance' | 'Paid';
    orderDate: string | Date;
    couponCode?: string;
    discountAmount?: number;
    totalPrice?: number;
}

export type Notification = {
    id: string;
    title: string;
    description: string;
    date: string;
    read: boolean;
    type: 'order' | 'offer' | 'general';
};

export type DownloadableProduct = {
    id: string;
    name: string;
    type: 'Image' | 'Video';
    deliveryDate: string;
    downloadUrl: string;
    orderId: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  referralCode?: string; // The user's own referral code
  referredBy?: string | null; // The referral code they used to sign up
  status?: 'active' | 'blocked';
  referrals?: number; // Total number of users referred
}

export type AppSettings = {
    downloadAppLink?: string;
    aiCustomInstructions?: string;
};

export type Coupon = {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiryDate: string;
    isActive: boolean;
    createdAt: string;
    currentUses: number;
    maxUses?: number; // Optional: Maximum number of times the coupon can be used
}
