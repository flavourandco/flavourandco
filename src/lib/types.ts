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

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress | string;
  shippingMethod?: string;
  paymentMethod?: string;
  paymentStatus?: "paid" | "pending" | "refunded" | "failed";
  squarePaymentId?: string;
  squareTransactionId?: string;
  squareReceiptUrl?: string;
  items?: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  totalAmount: number;
  status: "completed" | "processing" | "shipped" | "pending" | "cancelled";
  itemsCount: number;
  fulfillmentNotes?: string;
  createdAt: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardStats {
  todaysMoney: number;
  todaysMoneyChange: number;
  todaysUsers: number;
  todaysUsersChange: number;
  wholesaleInquiriesCount: number;
  wholesaleChange: number;
  salesTotal: number;
  salesChange: number;
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
  authorAvatar?: string;
  published?: boolean;
}

export interface ReviewItem {
  id: string;
  productId?: string;
  productName?: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected";
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  fullName: string;
  role: "admin" | "customer";
  imageUrl?: string;
  createdAt?: string;
}

