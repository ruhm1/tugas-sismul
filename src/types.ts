export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Wines';
  tags: string[];
  image: string;
  isSignature?: boolean;
}

export interface Reservation {
  id: string;
  userName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'FOOD' | 'INTERIOR' | 'EVENTS' | 'CHEF';
  image: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalReservations: number;
  todayRevenue: number;
  activeMenuItems: number;
  vipGuestsCount: number;
}
