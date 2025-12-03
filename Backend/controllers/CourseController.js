import db from '../config/db.js';

export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT 
        c.*,
        COUNT(e.user_id) as enrolled_count,
        GROUP_CONCAT(u.name) as enrolled_users
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN users u ON e.user_id = u.id
      GROUP BY c.id
      ORDER BY c.title
    `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO courses (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url]
    );

    res.status(201).json({ 
      message: 'Course created successfully',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url } = req.body;

    await db.execute(
      'UPDATE courses SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description, image_url, id]
    );

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM enrollments WHERE course_id = ?', [id]);
    await db.execute('DELETE FROM courses WHERE id = ?', [id]);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    const [existing] = await db.execute(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    await db.execute(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [user_id, course_id]
    );

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};