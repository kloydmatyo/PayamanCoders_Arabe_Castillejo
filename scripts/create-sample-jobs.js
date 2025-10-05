const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createSampleJobs() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Creating sample jobs...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('workqit');
    const jobsCollection = db.collection('jobs');
    const usersCollection = db.collection('users');

    // Get a test employer (we'll use the existing test user as employer for now)
    const testUser = await usersCollection.findOne({ email: 'test@workqit.com' });
    if (!testUser) {
      console.error('❌ Test user not found');
      return;
    }

    const sampleJobs = [
      {
        title: 'Backend Developer Apprenticeship',
        description: 'Learn backend development with Node.js, Express, and MongoDB. Work on real projects while gaining valuable experience in server-side development.',
        company: 'DevCorp Solutions',
        employerId: testUser._id,
        type: 'apprenticeship',
        location: 'New York, NY',
        remote: false,
        salary: {
          min: 20,
          max: 30,
          currency: 'USD'
        },
        requirements: [
          'Basic understanding of JavaScript',
          'Familiarity with databases',
          'Strong problem-solving skills',
          'Willingness to learn'
        ],
        skills: ['JavaScript', 'Node.js', 'MongoDB', 'Express'],
        duration: '6 months',
        status: 'active',
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'UI/UX Design Internship',
        description: 'Join our design team to create beautiful and user-friendly interfaces. Learn industry-standard design tools and methodologies.',
        company: 'Creative Studios Inc.',
        employerId: testUser._id,
        type: 'internship',
        location: 'Los Angeles, CA',
        remote: true,
        salary: {
          min: 18,
          max: 25,
          currency: 'USD'
        },
        requirements: [
          'Portfolio of design work',
          'Knowledge of design principles',
          'Proficiency in design tools (Figma, Adobe Creative Suite)',
          'Creative thinking'
        ],
        skills: ['UI Design', 'UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
        duration: '4 months',
        status: 'active',
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Data Analyst Contract Position',
        description: 'Analyze business data to provide insights and recommendations. Work with various data visualization tools and statistical methods.',
        company: 'Analytics Pro',
        employerId: testUser._id,
        type: 'contract',
        location: 'Chicago, IL',
        remote: true,
        salary: {
          min: 25,
          max: 40,
          currency: 'USD'
        },
        requirements: [
          'Experience with Excel and SQL',
          'Statistical analysis knowledge',
          'Data visualization skills',
          'Attention to detail'
        ],
        skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Statistics'],
        duration: '3 months',
        status: 'active',
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Digital Marketing Assistant',
        description: 'Support our marketing team with social media management, content creation, and campaign analysis. Perfect for someone looking to break into digital marketing.',
        company: 'Marketing Masters',
        employerId: testUser._id,
        type: 'part_time',
        location: 'Austin, TX',
        remote: true,
        salary: {
          min: 15,
          max: 22,
          currency: 'USD'
        },
        requirements: [
          'Social media savvy',
          'Basic understanding of marketing principles',
          'Good communication skills',
          'Creative mindset'
        ],
        skills: ['Social Media', 'Content Creation', 'Marketing', 'Analytics', 'Communication'],
        duration: 'Ongoing',
        status: 'active',
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Software Testing Intern',
        description: 'Learn software quality assurance and testing methodologies. Work with automated testing tools and help ensure product quality.',
        company: 'QualityFirst Tech',
        employerId: testUser._id,
        type: 'internship',
        location: 'Seattle, WA',
        remote: false,
        salary: {
          min: 16,
          max: 24,
          currency: 'USD'
        },
        requirements: [
          'Attention to detail',
          'Basic programming knowledge',
          'Problem-solving skills',
          'Interest in software quality'
        ],
        skills: ['Testing', 'QA', 'Automation', 'Bug Tracking', 'Documentation'],
        duration: '3 months',
        status: 'active',
        applicants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert all sample jobs
    const result = await jobsCollection.insertMany(sampleJobs);
    console.log(`✅ Created ${result.insertedCount} sample jobs`);
    
    // List all job titles created
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company} (${job.type})`);
    });

  } catch (error) {
    console.error('❌ Error creating sample jobs:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

createSampleJobs();