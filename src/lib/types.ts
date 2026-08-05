export interface ProductVariant {
  name: string;
  price: number;
}

export interface WhyStandOutPoint {
  title: string;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  whyStandOut: WhyStandOutPoint[];
  productDetails: string[];
  packInfo: string;
  price: number;
  image: string;
  images: [string, string] | string[];
  badge?: string;
  category: "freshly-baked" | "frozen" | "grazing-box";
  variants: ProductVariant[];
  preparationOptions?: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  option1Name?: string;
  option1Choices?: ProductVariant[];
  option2Name?: string;
  option2Choices?: string[];
  created_at?: string;
}

export interface WholesaleInquiry {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  estimatedVolume?: string;
  message: string;
  status: "pending" | "reviewed" | "contacted" | "archived";
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: "pending" | "replied" | "resolved";
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: "completed" | "processing" | "pending" | "cancelled";
  itemsCount: number;
  createdAt: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardStats {
  todaysMoney: number;
  todaysMoneyChange: number; // percentage change e.g. +55
  todaysUsers: number;
  todaysUsersChange: number; // percentage change e.g. +3
  wholesaleInquiriesCount: number;
  wholesaleChange: number; // percentage change e.g. -2
  salesTotal: number;
  salesChange: number; // percentage change e.g. +5
  weeklyViewsData: ChartPoint[];
  dailySalesData: ChartPoint[];
  monthlySalesData: ChartPoint[];
  recentOrders: Order[];
  recentInquiries: (WholesaleInquiry | ContactInquiry)[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  writer: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  image2?: string;
  authorRole?: string;
  authorAvatar?: string;
}
