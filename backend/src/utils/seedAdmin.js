import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';

export const seedInitialData = async () => {
  try {
    // Seed Courses
    const defaultCourses = [
      'B.tech', 
      'M.tech', 
      'BCA', 
      'MCA',
      'B.sc',
      'M.sc',
      'Bachelor of Science', 
      'Master of Science', 
      'Bachelor of Arts', 
      'Master of Arts',
      'Bachelor of Technology',
      'Master of Business Administration'
    ];
    
    for (const courseName of defaultCourses) {
      const exists = await Course.findOne({ name: courseName });
      if (!exists) {
        await Course.create({ name: courseName, description: 'Pre-populated course.' });
      }
    }

    // Seed Master Admin
    const adminEmail = 'NARATY@IN@LE';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('L4mU17(.)Nbpo"D..', salt);
      
      await User.create({
        name: 'Master System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Master Admin account seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
