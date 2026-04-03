import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      // If it exists but is inactive, activate it
      if (!courseExists.isActive) {
         courseExists.isActive = true;
         await courseExists.save();
         return res.json(courseExists);
      }
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = await Course.create({ name, description });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    course.isActive = false;
    await course.save();
    
    res.json({ message: 'Course deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
