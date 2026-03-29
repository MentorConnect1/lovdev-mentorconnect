import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'mentor' | 'judge' | 'coach' | 'teacher' | 'admin';
  location: string;
  school?: string;
  description?: string;
  available_for_hire: boolean;
  tabroom_username?: string;
  tabroom_linked?: boolean;
  email_verified: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participant_names: Record<string, string>;
  last_message: string;
  last_message_date: string;
  unread_by: string[];
  hidden_by: string[];
}

export interface Message {
  id: string;
  from: string;
  text: string;
  created_date: string;
}

export interface Notification {
  id: string;
  user_email: string;
  type: 'message' | 'hire_request' | 'new_resource' | 'default';
  title: string;
  message: string;
  reference_id?: string;
  from_user_name?: string;
  read: boolean;
  created_date: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  category: string;
  type: string;
  posted_by_name?: string;
  created_date: string;
}

export interface Review {
  id: string;
  user_name: string;
  user_email?: string;
  user_role: string;
  rating: number;
  text: string;
  date: string;
  satisfaction_pct: number;
  front_page: boolean;
}

/** Check if a user is an admin (by role OR master email) */
export const isUserAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'admin' || user.email === 'ethav31@gmail.com';
};

interface AppState {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notifications: Notification[];
  resources: Resource[];
  reviews: Review[];
  activePage: string;
  activeConvoId: string | null;

  setCurrentUser: (user: User | null) => void;
  setActivePage: (page: string) => void;
  setActiveConvoId: (id: string | null) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addConversation: (convo: Conversation) => void;
  addMessage: (convoId: string, msg: Message) => void;
  markConvoRead: (convoId: string) => void;
  hideConvo: (convoId: string) => void;
  unhideConvo: (convoId: string) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Notification) => void;
  addResource: (resource: Resource) => void;
  deleteResource: (resourceId: string) => void;
  addReview: (review: Review) => void;
  updateReview: (review: Review) => void;
  deleteReview: (reviewId: string) => void;
  approveReviewForFrontPage: (reviewId: string) => void;
  removeReviewFromFrontPage: (reviewId: string) => void;
  logout: () => void;
}

const DEMO_USERS: User[] = [
  { id: 'u1', email: 'sarah.chen@example.com', password: 'demo123', first_name: 'Sarah', last_name: 'Chen', role: 'mentor', location: 'California', school: 'Stanford University', description: 'Former national debate champion. Passionate about helping students develop critical thinking skills through Lincoln-Douglas debate.', available_for_hire: true, email_verified: true },
  { id: 'u2', email: 'marcus.j@example.com', password: 'demo123', first_name: 'Marcus', last_name: 'Johnson', role: 'mentor', location: 'New York', school: 'Columbia University', description: 'Policy debate coach with 8 years of experience. Specializing in evidence research and case construction.', available_for_hire: true, email_verified: true },
  { id: 'u3', email: 'elena.r@example.com', password: 'demo123', first_name: 'Elena', last_name: 'Rodriguez', role: 'judge', location: 'Texas', description: 'Certified judge with experience in state and national tournaments. Fair and constructive feedback guaranteed.', available_for_hire: true, tabroom_username: 'elenajudge', tabroom_linked: true, email_verified: true },
  { id: 'u4', email: 'david.kim@example.com', password: 'demo123', first_name: 'David', last_name: 'Kim', role: 'judge', location: 'Illinois', school: 'University of Chicago', description: 'Philosophy background, experienced in LD and parliamentary debate judging.', available_for_hire: true, tabroom_username: 'dkim_judge', tabroom_linked: true, email_verified: true },
  { id: 'u5', email: 'anna.w@example.com', password: 'demo123', first_name: 'Anna', last_name: 'Williams', role: 'mentor', location: 'Massachusetts', school: 'Harvard University', description: 'Public forum debate specialist. Helps students with speaking confidence and argument delivery.', available_for_hire: false, email_verified: true },
  { id: 'u6', email: 'coach.davis@example.com', password: 'demo123', first_name: 'Robert', last_name: 'Davis', role: 'coach', location: 'Georgia', school: 'Emory University', description: 'Head debate coach. Building competitive teams for over a decade.', available_for_hire: false, email_verified: true },
  { id: 'u7', email: 'priya.s@example.com', password: 'demo123', first_name: 'Priya', last_name: 'Sharma', role: 'mentor', location: 'Washington', school: 'University of Washington', description: 'Congressional debate mentor with a background in political science and rhetoric.', available_for_hire: true, email_verified: true },
  { id: 'u8', email: 'james.l@example.com', password: 'demo123', first_name: 'James', last_name: 'Liu', role: 'judge', location: 'California', description: 'Tournament organizer and judge. 15+ years in the debate community.', available_for_hire: true, tabroom_linked: false, email_verified: true },
];

const DEMO_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Introduction to Lincoln-Douglas Debate', type: 'document', category: 'debate', description: 'A comprehensive guide to LD debate format, including value/criterion framework construction.', url: '#', posted_by_name: 'Mentor Connect Team', created_date: '2024-11-15T00:00:00Z' },
  { id: 'r2', title: 'How to Research Evidence Effectively', type: 'video', category: 'debate', description: 'Learn how to find and cut cards efficiently for policy debate.', url: '#', posted_by_name: 'Mentor Connect Team', created_date: '2024-12-01T00:00:00Z' },
  { id: 'r3', title: 'Public Speaking Fundamentals', type: 'link', category: 'public_speaking', description: 'Tips for improving your delivery, eye contact, and vocal variety on the debate floor.', url: '#', posted_by_name: 'Mentor Connect Team', created_date: '2025-01-10T00:00:00Z' },
  { id: 'r4', title: 'Judging Philosophy Examples', type: 'document', category: 'judging', description: 'Sample judging philosophies from experienced coaches and judges.', url: '#', posted_by_name: 'Mentor Connect Team', created_date: '2025-02-01T00:00:00Z' },
];

const DEMO_REVIEWS: Review[] = [
  { id: 'rv1', user_name: 'Mia Tran', user_role: 'student', rating: 5, text: 'Found an amazing LD mentor in under a day. My speaker points went up 2 points at the next tournament!', date: '2025-02-14', satisfaction_pct: 98, front_page: true },
  { id: 'rv2', user_name: 'Jordan Bell', user_role: 'coach', rating: 5, text: 'Recruited 3 qualified judges for our invitational through Mentor Connect. Saved us weeks of searching.', date: '2025-01-28', satisfaction_pct: 95, front_page: true },
  { id: 'rv3', user_name: 'Aisha Patel', user_role: 'student', rating: 4, text: 'The resources section is a goldmine. Finally understood the value/criterion framework after reading the guides here.', date: '2025-03-02', satisfaction_pct: 91, front_page: true },
  { id: 'rv4', user_name: 'Carlos Mendez', user_role: 'judge', rating: 5, text: 'Great platform to connect with schools that need judges. The Tabroom integration makes verification seamless.', date: '2025-02-20', satisfaction_pct: 97, front_page: false },
  { id: 'rv5', user_name: 'Lily Zhang', user_role: 'student', rating: 5, text: 'My mentor Sarah helped me prep for TOC quals. Went from losing rounds to breaking at my first bid tournament.', date: '2025-03-08', satisfaction_pct: 99, front_page: false },
  { id: 'rv6', user_name: 'Derek Foster', user_role: 'teacher', rating: 4, text: 'Started a debate program at my school using mentors from this platform. Kids love it.', date: '2025-01-15', satisfaction_pct: 88, front_page: false },
];

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: loadFromStorage('mc_current_user', null),
  users: loadFromStorage('mc_users', DEMO_USERS),
  conversations: loadFromStorage('mc_conversations', []),
  messages: loadFromStorage('mc_messages', {}),
  notifications: loadFromStorage('mc_notifications', []),
  resources: loadFromStorage('mc_resources', DEMO_RESOURCES),
  reviews: loadFromStorage('mc_reviews', DEMO_REVIEWS),
  activePage: loadFromStorage('mc_current_user', null) ? 'mentors' : 'landing',
  activeConvoId: null,

  setCurrentUser: (user) => {
    localStorage.setItem('mc_current_user', JSON.stringify(user));
    set({ currentUser: user });
  },

  setActivePage: (page) => set({ activePage: page }),
  setActiveConvoId: (id) => set({ activeConvoId: id }),

  addUser: (user) => {
    const users = [...get().users, user];
    localStorage.setItem('mc_users', JSON.stringify(users));
    set({ users });
  },

  updateUser: (user) => {
    const users = get().users.map(u => u.id === user.id ? user : u);
    localStorage.setItem('mc_users', JSON.stringify(users));
    set({ users });
    if (get().currentUser?.id === user.id) {
      localStorage.setItem('mc_current_user', JSON.stringify(user));
      set({ currentUser: user });
    }
  },

  deleteUser: (userId) => {
    const users = get().users.filter(u => u.id !== userId);
    localStorage.setItem('mc_users', JSON.stringify(users));
    set({ users });
  },

  addConversation: (convo) => {
    const conversations = [...get().conversations, convo];
    localStorage.setItem('mc_conversations', JSON.stringify(conversations));
    set({ conversations });
  },

  addMessage: (convoId, msg) => {
    const messages = { ...get().messages };
    if (!messages[convoId]) messages[convoId] = [];
    messages[convoId] = [...messages[convoId], msg];
    localStorage.setItem('mc_messages', JSON.stringify(messages));

    const conversations = get().conversations.map(c => {
      if (c.id === convoId) {
        const others = c.participants.filter(e => e !== get().currentUser?.email);
        return { ...c, last_message: msg.text, last_message_date: msg.created_date, unread_by: [...(c.unread_by || []), ...others.filter(e => !c.unread_by?.includes(e))] };
      }
      return c;
    });
    localStorage.setItem('mc_conversations', JSON.stringify(conversations));
    set({ messages, conversations });
  },

  markConvoRead: (convoId) => {
    const email = get().currentUser?.email;
    const conversations = get().conversations.map(c => {
      if (c.id === convoId) return { ...c, unread_by: (c.unread_by || []).filter(e => e !== email) };
      return c;
    });
    localStorage.setItem('mc_conversations', JSON.stringify(conversations));
    set({ conversations });
  },

  hideConvo: (convoId) => {
    const email = get().currentUser?.email;
    if (!email) return;
    const conversations = get().conversations.map(c => {
      if (c.id === convoId) return { ...c, hidden_by: [...(c.hidden_by || []), email] };
      return c;
    });
    localStorage.setItem('mc_conversations', JSON.stringify(conversations));
    set({ conversations });
  },

  unhideConvo: (convoId) => {
    const email = get().currentUser?.email;
    const conversations = get().conversations.map(c => {
      if (c.id === convoId) return { ...c, hidden_by: (c.hidden_by || []).filter(e => e !== email) };
      return c;
    });
    localStorage.setItem('mc_conversations', JSON.stringify(conversations));
    set({ conversations });
  },

  markNotifRead: (id) => {
    const notifications = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('mc_notifications', JSON.stringify(notifications));
    set({ notifications });
  },

  markAllNotifsRead: () => {
    const email = get().currentUser?.email;
    const notifications = get().notifications.map(n => n.user_email === email ? { ...n, read: true } : n);
    localStorage.setItem('mc_notifications', JSON.stringify(notifications));
    set({ notifications });
  },

  deleteNotification: (id) => {
    const notifications = get().notifications.filter(n => n.id !== id);
    localStorage.setItem('mc_notifications', JSON.stringify(notifications));
    set({ notifications });
  },

  addNotification: (notif) => {
    const notifications = [notif, ...get().notifications];
    localStorage.setItem('mc_notifications', JSON.stringify(notifications));
    set({ notifications });
  },

  addResource: (resource) => {
    const resources = [...get().resources, resource];
    localStorage.setItem('mc_resources', JSON.stringify(resources));
    set({ resources });
  },

  deleteResource: (resourceId) => {
    const resources = get().resources.filter(r => r.id !== resourceId);
    localStorage.setItem('mc_resources', JSON.stringify(resources));
    set({ resources });
  },

  addReview: (review) => {
    const reviews = [...get().reviews, review];
    localStorage.setItem('mc_reviews', JSON.stringify(reviews));
    set({ reviews });
  },

  updateReview: (review) => {
    const reviews = get().reviews.map(r => r.id === review.id ? review : r);
    localStorage.setItem('mc_reviews', JSON.stringify(reviews));
    set({ reviews });
  },

  deleteReview: (reviewId) => {
    const reviews = get().reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('mc_reviews', JSON.stringify(reviews));
    set({ reviews });
  },

  approveReviewForFrontPage: (reviewId) => {
    const reviews = get().reviews.map(r => r.id === reviewId ? { ...r, front_page: true } : r);
    localStorage.setItem('mc_reviews', JSON.stringify(reviews));
    set({ reviews });
  },

  removeReviewFromFrontPage: (reviewId) => {
    const reviews = get().reviews.map(r => r.id === reviewId ? { ...r, front_page: false } : r);
    localStorage.setItem('mc_reviews', JSON.stringify(reviews));
    set({ reviews });
  },

  logout: () => {
    localStorage.removeItem('mc_current_user');
    set({ currentUser: null, activePage: 'landing', activeConvoId: null, conversations: [], notifications: [], messages: {} });
  },
}));
