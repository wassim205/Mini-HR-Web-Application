import db from '../config/db.js';

export const createTimeOffRequest = async (req, res) => {
  try {
    const { start_date, end_date, reason } = req.body;
    const user_id = req.user.id;

    const [result] = await db.execute(
      'INSERT INTO time_off_requests (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
      [user_id, start_date, end_date, reason]
    );

    res.status(201).json({ 
      message: 'Time off request created successfully',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserTimeOffRequests = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [requests] = await db.execute(
      'SELECT * FROM time_off_requests WHERE user_id = ? ORDER BY id DESC',
      [user_id]
    );

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTimeOffRequests = async (req, res) => {
  try {
    const [requests] = await db.execute(`
      SELECT tor.*, u.name as user_name 
      FROM time_off_requests tor 
      JOIN users u ON tor.user_id = u.id 
      ORDER BY tor.id DESC
    `);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTimeOffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    await db.execute(
      'UPDATE time_off_requests SET status = ?, admin_note = ? WHERE id = ?',
      [status, admin_note, id]
    );

    res.json({ message: 'Time off request updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};