// HOW IT WORKS:
// This script seeds the database with demo data including users, projects, and skills
// It's used for development and testing purposes

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Demo users data
const demoUsers = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    college: 'Stanford University',
    skills: [
      { name: 'React', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'CSS', level: 4 },
      { name: 'HTML', level: 5 }
    ],
    interests: ['Web Development', 'UI/UX'],
    bio: 'Frontend developer passionate about creating beautiful user experiences.',
    availability: { timezone: 'PST', hours: '9am-5pm' },
    portfolioLinks: ['https://github.com/alexjohnson'],
    rating: { avg: 4.8, count: 12 }
  },
  {
    name: 'Sam Wilson',
    email: 'sam@example.com',
    password: 'password123',
    college: 'MIT',
    skills: [
      { name: 'Node.js', level: 5 },
      { name: 'Express', level: 5 },
      { name: 'MongoDB', level: 4 },
      { name: 'Python', level: 3 }
    ],
    interests: ['Backend Development', 'APIs'],
    bio: 'Backend engineer who loves building scalable server-side applications.',
    availability: { timezone: 'EST', hours: '10am-6pm' },
    portfolioLinks: ['https://github.com/samwilson'],
    rating: { avg: 4.6, count: 9 }
  },
  {
    name: 'Taylor Kim',
    email: 'taylor@example.com',
    password: 'password123',
    college: 'California Institute of the Arts',
    skills: [
      { name: 'UI Design', level: 5 },
      { name: 'UX Research', level: 4 },
      { name: 'Figma', level: 5 },
      { name: 'Illustrator', level: 4 }
    ],
    interests: ['UI/UX Design', 'User Research'],
    bio: 'UI/UX designer focused on creating intuitive and engaging interfaces.',
    availability: { timezone: 'PST', hours: '8am-4pm' },
    portfolioLinks: ['https://dribbble.com/taylorkim'],
    rating: { avg: 4.9, count: 15 }
  },
  {
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    password: 'password123',
    college: 'University of Southern California',
    skills: [
      { name: 'Technical Writing', level: 5 },
      { name: 'Content Strategy', level: 4 },
      { name: 'SEO', level: 4 },
      { name: 'Copywriting', level: 5 }
    ],
    interests: ['Content Creation', 'Marketing'],
    bio: 'Technical writer who makes complex topics easy to understand.',
    availability: { timezone: 'EST', hours: '11am-7pm' },
    portfolioLinks: ['https://linkedin.com/in/jordansmith'],
    rating: { avg: 4.7, count: 11 }
  },
  {
    name: 'Casey Brown',
    email: 'casey@example.com',
    password: 'password123',
    college: 'Carnegie Mellon University',
    skills: [
      { name: 'Machine Learning', level: 4 },
      { name: 'Python', level: 5 },
      { name: 'TensorFlow', level: 4 },
      { name: 'Data Analysis', level: 5 }
    ],
    interests: ['AI', 'Data Science'],
    bio: 'ML enthusiast working on innovative data science projects.',
    availability: { timezone: 'CST', hours: '9am-5pm' },
    portfolioLinks: ['https://kaggle.com/caseyb'],
    rating: { avg: 4.5, count: 8 }
  },
  {
    name: 'Riley Davis',
    email: 'riley@example.com',
    password: 'password123',
    college: 'University of Washington',
    skills: [
      { name: 'React', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'MongoDB', level: 3 },
      { name: 'DevOps', level: 3 }
    ],
    interests: ['Full-stack Development', 'DevOps'],
    bio: 'Full-stack developer interested in building end-to-end solutions.',
    availability: { timezone: 'PST', hours: '10am-6pm' },
    portfolioLinks: ['https://github.com/rileydavis'],
    rating: { avg: 4.4, count: 7 }
  }
];

// Demo projects data
const demoProjects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React frontend and Node.js backend',
    requiredSkills: [
      { name: 'React', weight: 5 },
      { name: 'Node.js', weight: 5 },
      { name: 'MongoDB', weight: 4 }
    ],
    visibility: 'public',
    status: 'active'
  },
  {
    title: 'Mobile App Redesign',
    description: 'Complete UI/UX redesign for a popular mobile productivity app',
    requiredSkills: [
      { name: 'UI Design', weight: 5 },
      { name: 'UX Research', weight: 4 },
      { name: 'Figma', weight: 5 }
    ],
    visibility: 'public',
    status: 'planning'
  },
  {
    title: 'Data Analytics Dashboard',
    description: 'Interactive dashboard for visualizing business metrics and KPIs',
    requiredSkills: [
      { name: 'React', weight: 4 },
      { name: 'Data Visualization', weight: 5 },
      { name: 'Python', weight: 4 }
    ],
    visibility: 'public',
    status: 'active'
  }
];

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    
    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(demoUsers.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);
      return { ...user, passwordHash };
    }));
    
    // Insert users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log('Users seeded successfully!');
    
    // Create projects with the first user as owner
    const projectsWithOwner = demoProjects.map((project, index) => ({
      ...project,
      ownerId: createdUsers[0]._id,
      members: [{ userId: createdUsers[0]._id, role: 'owner' }]
    }));
    
    await Project.insertMany(projectsWithOwner);
    console.log('Projects seeded successfully!');
    
    // Print login credentials
    console.log('\n=== LOGIN CREDENTIALS ===');
    demoUsers.forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password}`);
    });
    console.log('========================\n');
    
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDB();