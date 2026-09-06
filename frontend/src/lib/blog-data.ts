export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-zenboard",
    title: "Getting Started with ZenBoard",
    excerpt: "Learn how to set up your first board, invite your team, and start managing projects like a pro.",
    content: "Welcome to ZenBoard! This guide will walk you through the basics of setting up your first workspace. Creating a board is as simple as clicking 'New Board'. From there, you can add custom columns like 'To Do', 'In Progress', and 'Done'. Invite your team members via email and start assigning tasks to keep everyone aligned.",
    author: "Jane Doe",
    date: "October 12, 2024",
    imageUrl: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800",
    category: "Tutorial",
  },
  {
    id: "2",
    slug: "mastering-agile-workflows",
    title: "Mastering Agile Workflows",
    excerpt: "Discover how to adapt ZenBoard for agile methodologies like Scrum and Kanban to boost team productivity.",
    content: "Agile is all about flexibility and continuous improvement. In ZenBoard, you can easily implement Kanban by dragging and dropping tasks across your columns. Try setting Work-In-Progress (WIP) limits mentally, or use tags to differentiate bugs, features, and chores. Keep your daily standups quick by just looking at the board!",
    author: "John Smith",
    date: "October 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    category: "Productivity",
  },
  {
    id: "3",
    slug: "remote-collaboration-tips",
    title: "5 Tips for Better Remote Collaboration",
    excerpt: "Working in a distributed team? Here are our top tips for staying connected and productive across timezones.",
    content: "Remote work is here to stay. To succeed, communication must be intentional. 1. Use comments on tasks to keep context attached to the work. 2. Attach files directly to tasks. 3. Over-communicate your status. 4. Respect timezone differences. 5. Use ZenBoard's real-time updates to see what your teammates are working on instantly.",
    author: "Alice Johnson",
    date: "October 18, 2024",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
    category: "Remote Work",
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}
