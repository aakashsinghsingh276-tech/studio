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
  type: 'image' | 'video' | 'audio' | 'location' | 'contact';
  url?: string;
  name?: string;
  size?: number;
  description?: string;
  location?: LocationAttachment;
  contact?: User;
  isLive?: boolean;
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
  type: 'image' | 'text' | 'video' | 'audio';
  url?: string;
  content?: string;
  duration?: number;
  timestamp: string;
  viewed: boolean;
  header: {
    heading: string;
    subheading: string;
    profileImage: string;
  }
};

export type Story = {
    userId: string;
    stories: Status[];
}

export type Call = {
  id: string;
  userId: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'audio' | 'video';
  timestamp: string;
  duration?: string;
};

export const loggedInUserId = 'user1';

export const users: User[] = [
  { id: 'user1', name: 'You', avatar: '1', status: 'online' },
  { id: 'user2', name: 'Alice', avatar: 'https://avatars.githubusercontent.com/u/1', status: 'online' },
  { id: 'user3', name: 'Bob', avatar: 'https://avatars.githubusercontent.com/u/2', status: 'offline' },
  { id: 'user4', name: 'Charlie', avatar: 'https://avatars.githubusercontent.com/u/3', status: 'online' },
  { id: 'user5', name: 'David', avatar: 'https://avatars.githubusercontent.com/u/4', status: 'offline' },
  { id: 'user6', name: 'Eve', avatar: 'https://avatars.githubusercontent.com/u/5', status: 'online' },
  { id: 'user7', name: 'Frank', avatar: 'https://avatars.githubusercontent.com/u/6', status: 'online' },
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

export const calls: Call[] = [
    { id: 'call1', userId: 'user2', type: 'missed', callType: 'video', timestamp: 'Today, 2:30 PM' },
    { id: 'call2', userId: 'user3', type: 'outgoing', callType: 'audio', timestamp: 'Today, 11:15 AM', duration: '12m 34s' },
    { id: 'call3', userId: 'user4', type: 'incoming', callType: 'audio', timestamp: 'Yesterday, 8:45 PM', duration: '5m 21s' },
    { id: 'call4', userId: 'user5', type: 'missed', callType: 'video', timestamp: 'Yesterday, 1:00 PM' },
    { id: 'call5', userId: 'user6', type: 'outgoing', callType: 'video', timestamp: 'Tuesday, 4:30 PM', duration: '23m 10s' },
    { id: 'call6', userId: 'user7', type: 'incoming', callType: 'audio', timestamp: 'Tuesday, 9:00 AM', duration: '1m 5s' },
  ];

const generateStory = (user: User, statuses: {type: 'image' | 'text' | 'video' | 'audio', content: string, viewed: boolean, timestamp: string}[]) => ({
    userId: user.id,
    stories: statuses.map(s => ({
        type: s.type,
        url: s.type === 'image' || s.type === 'video' ? `https://picsum.photos/seed/${s.content}/1080/1920` : undefined,
        content: s.type === 'text' ? s.content : undefined,
        duration: 5000,
        timestamp: s.timestamp,
        viewed: s.viewed,
        header: {
            heading: user.name,
            subheading: s.timestamp,
            profileImage: user.avatar.startsWith('http') ? user.avatar : `https://picsum.photos/seed/${user.avatar}/200/200`
        }
    }))
})

export const stories: Story[] = [
    generateStory(users.find(u => u.id === 'user2')!, [
        { type: 'image', content: '31', viewed: false, timestamp: '15 minutes ago' },
        { type: 'image', content: '32', viewed: false, timestamp: '10 minutes ago' }
    ]),
    generateStory(users.find(u => u.id === 'user4')!, [
        { type: 'text', content: 'Feeling creative today!', viewed: false, timestamp: '45 minutes ago' }
    ]),
    generateStory(users.find(u => u.id === 'user6')!, [
        { type: 'image', content: '33', viewed: true, timestamp: '2 hours ago' }
    ]),
];

// This is the old statuses data structure, which is now replaced by stories
export const statuses: any[] = [];
