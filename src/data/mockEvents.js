export const mockEvents = [
  {
    id: '1',
    name: 'Tech Innovation Workshop',
    time: '2025-09-15T10:00:00Z',
    venue: 'Computer Lab A',
    category: 'Tech',
    description: 'Learn about latest innovations in technology and AI. This workshop covers modern development practices, emerging technologies, and hands-on coding sessions.',
    registrationCount: 45,
    capacity: 50
  },
  {
    id: '2',
    name: 'Campus Sports Day',
    time: '2025-09-20T09:00:00Z',
    venue: 'Sports Ground',
    category: 'Sports',
    description: 'Annual campus sports competition with multiple events including football, basketball, cricket, and athletics. Join your department team!',
    registrationCount: 120,
    capacity: 200
  },
  {
    id: '3',
    name: 'Career Guidance Seminar',
    time: '2025-09-18T14:00:00Z',
    venue: 'Main Auditorium',
    category: 'Seminar',
    description: 'Professional development seminar featuring industry experts sharing insights about career opportunities and skill development.',
    registrationCount: 80,
    capacity: 100
  },
  {
    id: '4',
    name: 'Cultural Night 2025',
    time: '2025-09-25T18:00:00Z',
    venue: 'Open Air Theater',
    category: 'Cultural',
    description: 'Showcase your talents in music, dance, drama, and poetry. A celebration of diverse cultures and artistic expression.',
    registrationCount: 150,
    capacity: 300
  },
  {
    id: '5',
    name: 'Entrepreneurship Bootcamp',
    time: '2025-09-22T11:00:00Z',
    venue: 'Business Center',
    category: 'Workshop',
    description: 'Learn entrepreneurship fundamentals, business planning, and startup strategies from successful entrepreneurs.',
    registrationCount: 35,
    capacity: 40
  },
  {
    id: '6',
    name: 'Science Fair 2025',
    time: '2025-09-28T10:00:00Z',
    venue: 'Science Building',
    category: 'Academic',
    description: 'Present your research projects and innovative ideas. Awards for best projects in different categories.',
    registrationCount: 60,
    capacity: 80
  },
  {
    id: '7',
    name: 'Photography Contest',
    time: '2025-09-16T15:00:00Z',
    venue: 'Art Gallery',
    category: 'Art',
    description: 'Submit your best photographs and compete for exciting prizes. Theme: Campus Life Through Your Lens.',
    registrationCount: 25,
    capacity: 50
  },
  {
    id: '8',
    name: 'AI & Machine Learning Seminar',
    time: '2025-09-30T13:00:00Z',
    venue: 'Tech Hub',
    category: 'Tech',
    description: 'Explore the latest trends in AI and machine learning with hands-on demonstrations and case studies.',
    registrationCount: 70,
    capacity: 75
  }
];

export const mockComments = {
  '1': [
    {
      id: 'c1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      text: 'Really excited for this workshop! Can\'t wait to learn new tech skills.',
      timestamp: '2025-09-10T08:30:00Z',
      reactions: { like: 5, love: 2, laugh: 0 }
    },
    {
      id: 'c2',
      userId: 'user2',
      userName: 'Mike Chen',
      text: 'Will there be certificates provided for participants?',
      timestamp: '2025-09-10T10:15:00Z',
      reactions: { like: 3, love: 0, laugh: 0 }
    }
  ],
  '2': [
    {
      id: 'c3',
      userId: 'user3',
      userName: 'Alex Rodriguez',
      text: 'Go Team Engineering! Let\'s win this year!',
      timestamp: '2025-09-11T12:00:00Z',
      reactions: { like: 8, love: 3, laugh: 1 }
    }
  ],
  '3': [
    {
      id: 'c4',
      userId: 'user4',
      userName: 'Emily Davis',
      text: 'This seminar changed my perspective on career planning. Highly recommended!',
      timestamp: '2025-09-12T16:45:00Z',
      reactions: { like: 12, love: 5, laugh: 0 }
    }
  ]
};

export const categories = ['All', 'Tech', 'Sports', 'Seminar', 'Cultural', 'Workshop', 'Academic', 'Art'];