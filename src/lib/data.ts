export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
};

export type LocationAttachment = {
  latitude: number;
  longitude: number;
};

export type Attachment = {
  id:string;
  type: 'image' | 'video' | 'location' | 'contact';
  url?: string;
  name?: string;
  size?: number;
  description?: string;
  location?: LocationAttachment;
  contact?: User;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: Attachment;
};

export type Chat = {
  id: string;
  type: 'private' | 'group';
  participants: string[];
  messages: Message[];
  unreadCount: number;
};

export type Status = {
  id: string;
  userId: string;
  type: 'image' | 'text';
  content: string;
  timestamp: string;
  viewed: boolean;
};

export const loggedInUserId = 'user1';

export const users: User[] = [
  { id: 'user1', name: 'You', avatar: '1', status: 'online' },
  { id: 'user2', name: 'Alice', avatar: '2', status: 'online' },
  { id: 'user3', name: 'Bob', avatar: '3', status: 'offline' },
  { id: 'user4', name: 'Charlie', avatar: '4', status: 'online' },
  { id: 'user5', name: 'David', avatar: '5', status: 'offline' },
  { id: 'user6', name: 'Eve', avatar: '6', status: 'online' },
  { id: 'user7', name: 'Frank', avatar: '7', status: 'online' },
];

export const messages: Message[] = [
  { id: 'msg1', chatId: 'chat1', senderId: 'user2', content: 'Hey, how are you?', timestamp: '10:30 AM', read: true },
  { id: 'msg2', chatId: 'chat1', senderId: 'user1', content: 'I\'m good, thanks! How about you?', timestamp: '10:31 AM', read: true },
  { id: 'msg3', chatId: 'chat1', senderId: 'user2', content: 'Doing great. Working on the new project.', timestamp: '10:32 AM', read: true },
  { id: 'msg4', chatId: 'chat2', senderId: 'user3', content: 'Can we schedule a meeting for tomorrow?', timestamp: 'Yesterday', read: true },
  { id: 'msg5', chatId: 'chat2', senderId: 'user1', content: 'Sure, what time works for you?', timestamp: 'Yesterday', read: true },
  { id: 'msg6', chatId: 'chat3', senderId: 'user4', content: 'Just saw the latest designs, they look amazing!', timestamp: 'Yesterday', read: true },
  { id: 'msg7', chatId: 'chat4', senderId: 'user5', content: 'Let\'s catch up later this week.', timestamp: 'Tuesday', read: false },
  { id: 'msg8', chatId: 'chat5', senderId: 'user6', content: 'Happy Birthday!', timestamp: 'Monday', read: false },
  { id: 'msg9', chatId: 'chat6', senderId: 'user7', content: 'Do you have the report ready?', timestamp: 'Friday', read: false },
];

export const chats: Chat[] = [
  { id: 'chat1', type: 'private', participants: ['user1', 'user2'], messages: messages.filter(m => m.chatId === 'chat1'), unreadCount: 0 },
  { id: 'chat2', type: 'private', participants: ['user1', 'user3'], messages: messages.filter(m => m.chatId === 'chat2'), unreadCount: 0 },
  { id: 'chat3', type: 'private', participants: ['user1', 'user4'], messages: messages.filter(m => m.chatId === 'chat3'), unreadCount: 1 },
  { id: 'chat4', type: 'private', participants: ['user1', 'user5'], messages: messages.filter(m => m.chatId === 'chat4'), unreadCount: 2 },
  { id: 'chat5', type: 'private', participants: ['user1', 'user6'], messages: messages.filter(m => m.chatId === 'chat5'), unreadCount: 0 },
  { id: 'chat6', type: 'private', participants: ['user1', 'user7'], messages: messages.filter(m => m.chatId === 'chat6'), unreadCount: 0 },
];

export const statuses: Status[] = [
  { id: 'status1', userId: 'user1', type: 'image', content: '10', timestamp: '2 minutes ago', viewed: true },
  { id: 'status2', userId: 'user2', type: 'image', content: '11', timestamp: '15 minutes ago', viewed: false },
  { id: 'status3', userId: 'user4', type: 'text', content: 'Feeling creative today!', timestamp: '45 minutes ago', viewed: false },
  { id: 'status4', userId: 'user6', type: 'image', content: '12', timestamp: '2 hours ago', viewed: true },
];
