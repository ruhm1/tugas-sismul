export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  image: string;
  isSignature?: boolean;
  isAvailable?: boolean;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  userName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
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
  totalMenu: number;
  totalReservations: number;
  totalPromos: number;
  totalContacts: number;
}
