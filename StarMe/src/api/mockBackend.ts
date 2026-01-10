import { Memory } from '../types/memory';

// ==========================================
// 1. MONGODB-LIKE SCHEMAS (INTERFACES)
// ==========================================

// User Schema - Giống collection 'users' trong MongoDB
export interface User {
  _id: string;          // ObjectId-like string (Unique)
  username: string;     // Unique username
  email: string;        // Unique email
  password?: string;    // Hashed password (simulation)
  avatar: string;       // URL to avatar image
  deviceToken?: string; // Dùng cho Push Notification (FCM/APNs)
  bio?: string;         // User biography
  createdAt: string;    // ISO Date string
  updatedAt: string;    // ISO Date string
}

// Friendship Schema - Giống collection 'friendships'
// Quản lý mối quan hệ bạn bè 2 chiều
export interface Friendship {
  _id: string;
  requester: string;    // User ID của người gửi lời mời
  recipient: string;    // User ID của người nhận
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

// Post Schema - Giống collection 'posts'
// Lưu trữ metadata của ảnh/video
export interface Post {
  _id: string;
  user: string;         // User ID của người đăng (Owner)
  imageUrl: string;     // URL ảnh (Cloudinary/S3)
  caption?: string;     // Caption/Text mô tả
  emotion?: 'happy' | 'sad' | 'love' | 'neutral' | 'excited' | 'angry' | 'confused'; // Cảm xúc
  privacy: 'friends' | 'public' | 'private'; // Phạm vi hiển thị
  location?: {          // GeoJSON (Optional)
    lat: number;
    lng: number;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. DUMMY DATA (DATABASE SIMULATION)
// ==========================================

export let CURRENT_USER_ID = 'user_001'; // Giả lập user đang login

export const USERS: User[] = [
  {
    _id: 'user_001',
    username: 'minh_hieu',
    email: 'hieu@starme.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    deviceToken: 'fcm_token_user_001',
    bio: 'Photography lover 📸',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  },
  {
    _id: 'user_002',
    username: 'sarah_rose',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    deviceToken: 'fcm_token_user_002',
    bio: 'Coffee addict ☕',
    createdAt: '2023-01-05T14:30:00Z',
    updatedAt: '2023-01-05T14:30:00Z',
  },
  {
    _id: 'user_003',
    username: 'david_king',
    email: 'david@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    deviceToken: 'fcm_token_user_003',
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-02-10T09:15:00Z',
  },
  {
    _id: 'user_004',
    username: 'emily_w',
    email: 'emily@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-03-20T11:00:00Z',
    updatedAt: '2023-03-20T11:00:00Z',
  },
];

export const FRIENDSHIPS: Friendship[] = [
  {
    _id: 'friend_001',
    requester: 'user_002',
    recipient: 'user_001',
    status: 'accepted',
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2023-02-01T10:00:00Z',
  },
  {
    _id: 'friend_002',
    requester: 'user_001',
    recipient: 'user_003',
    status: 'accepted',
    createdAt: '2023-02-15T10:00:00Z',
    updatedAt: '2023-02-15T10:00:00Z',
  },
  {
    _id: 'friend_003',
    requester: 'user_004',
    recipient: 'user_001',
    status: 'pending', // Pending request from Emily to Me
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-10-25T10:00:00Z',
  },
];

export const POSTS: Post[] = [
  {
    _id: 'post_101',
    user: 'user_001',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Chụp ảnh với máy ảnh mới! 📸',
    emotion: 'excited',
    privacy: 'friends',
    createdAt: '2023-10-25T08:30:00Z',
    updatedAt: '2023-10-25T08:30:00Z',
  },
  {
    _id: 'post_102',
    user: 'user_002',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Cà phê sáng cùng bạn bè ☕',
    emotion: 'happy',
    privacy: 'friends',
    createdAt: '2023-10-26T09:00:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
  },
  {
    _id: 'post_103',
    user: 'user_003',
    imageUrl: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Cuối tuần thư giãn',
    emotion: 'happy',
    privacy: 'public',
    createdAt: '2023-10-26T18:45:00Z',
    updatedAt: '2023-10-26T18:45:00Z',
  },
  {
    _id: 'post_104',
    user: 'user_001',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Thiên nhiên hùng vĩ 🌲',
    emotion: 'neutral',
    privacy: 'friends',
    createdAt: '2023-10-24T15:20:00Z',
    updatedAt: '2023-10-24T15:20:00Z',
  },
  {
    _id: 'post_105',
    user: 'user_002',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Mèo cưng của tôi 🐱',
    emotion: 'love',
    privacy: 'friends',
    createdAt: '2023-10-27T07:15:00Z',
    updatedAt: '2023-10-27T07:15:00Z',
  },
];

// ==========================================
// 3. BACKEND LOGIC SIMULATION
// ==========================================

/**
 * Authentication: Login
 */
export const login = (email: string): User | null => {
  const user = USERS.find(u => u.email === email);
  if (user) {
    CURRENT_USER_ID = user._id;
    return user;
  }
  return null;
};

/**
 * Authentication: Register
 */
export const register = (username: string, email: string): User => {
  const newUser: User = {
    _id: `user_${Date.now()}`,
    username,
    email,
    password: 'password123', // Dummy password
    avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  USERS.push(newUser);
  CURRENT_USER_ID = newUser._id;
  return newUser;
};

/**
 * Get Current User Profile
 */
export const getMyProfile = (): User => {
  return USERS.find(u => u._id === CURRENT_USER_ID)!;
};

/**
 * Get User by ID
 */
export const getUserById = (userId: string): User | undefined => {
  return USERS.find(u => u._id === userId);
};

/**
 * Friends: Get List of Friends
 * Trả về danh sách User là bạn bè (status = accepted)
 */
export const getFriends = (userId: string): User[] => {
  const friendships = FRIENDSHIPS.filter(
    f => (f.requester === userId || f.recipient === userId) && f.status === 'accepted'
  );

  const friendIds = friendships.map(f => 
    f.requester === userId ? f.recipient : f.requester
  );

  return USERS.filter(u => friendIds.includes(u._id));
};

/**
 * Feed: Get Friends' Latest Posts
 * Logic: Lấy post của bạn bè + post của mình, sort theo thời gian mới nhất
 */
export const getFriendsFeed = (userId: string): (Post & { userDetails: User })[] => {
  const friends = getFriends(userId);
  const friendIds = friends.map(f => f._id);
  
  // Include my own posts in feed
  const relevantUserIds = [...friendIds, userId];
  
  const feedPosts = POSTS.filter(p => relevantUserIds.includes(p.user));

  // Sort by createdAt desc (Newest first)
  return feedPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(post => {
      const user = USERS.find(u => u._id === post.user)!;
      return { ...post, userDetails: user };
    });
};

/**
 * Memory: Get User's Memories (History)
 * Lấy tất cả post của 1 user cụ thể
 */
export const getUserMemories = (userId: string): Post[] => {
  return POSTS
    .filter(p => p.user === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Post: Create New Post
 */
export const createPost = (
  userId: string, 
  imageUrl: string, 
  caption: string = '', 
  emotion: Post['emotion'] = 'neutral'
): Post => {
  const newPost: Post = {
    _id: `post_${Date.now()}`,
    user: userId,
    imageUrl,
    caption,
    emotion,
    privacy: 'friends',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  POSTS.unshift(newPost); // Add to beginning
  return newPost;
};

// ==========================================
// 4. FRONTEND ADAPTERS (Convert DB Schema to UI Props)
// ==========================================

export const postToMemory = (post: Post, user?: User): Memory => {
  return {
    id: post._id,
    userId: post.user,
    title: post.caption,
    text: post.caption,
    media: [{ type: 'image', url: post.imageUrl }],
    emotion: post.emotion,
    createdAt: post.createdAt,
    privacy: post.privacy,
    x: Math.random(), // Mock 3D coords
    y: Math.random(),
    author: user ? {
      username: user.username,
      avatar: user.avatar
    } : undefined
  };
};
