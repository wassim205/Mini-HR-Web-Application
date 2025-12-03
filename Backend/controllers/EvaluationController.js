import db from '../config/db.js';

export const getEvaluations = async (req, res) => {
  try {
    const [evaluations] = await db.execute('SELECT * FROM evaluations ORDER BY name');
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignScore = async (req, res) => {
  try {
    const { user_id, evaluation_id, score } = req.body;
    
    const [existing] = await db.execute(
      'SELECT id FROM scores WHERE user_id = ? AND evaluation_id = ?',
      [user_id, evaluation_id]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE scores SET score = ? WHERE user_id = ? AND evaluation_id = ?',
        [score, user_id, evaluation_id]
      );
    } else {
      await db.execute(
        'INSERT INTO scores (user_id, evaluation_id, score) VALUES (?, ?, ?)',
        [user_id, evaluation_id, score]
      );
    }

    res.json({ message: 'Score assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvaluationReport = async (req, res) => {
  try {
    const [report] = await db.execute(`
      SELECT 
        e.name as evaluation_name,
        COUNT(CASE WHEN s.score BETWEEN 0 AND 30 THEN 1 END) as bucket_0_30,
        COUNT(CASE WHEN s.score BETWEEN 31 AND 50 THEN 1 END) as bucket_31_50,
        COUNT(CASE WHEN s.score BETWEEN 51 AND 70 THEN 1 END) as bucket_51_70,
        COUNT(CASE WHEN s.score BETWEEN 71 AND 100 THEN 1 END) as bucket_71_100
      FROM evaluations e
      LEFT JOIN scores s ON e.id = s.evaluation_id
      GROUP BY e.id, e.name
      ORDER BY e.name
    `);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserScores = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [scores] = await db.execute(`
      SELECT e.name, s.score
      FROM evaluations e
      LEFT JOIN scores s ON e.id = s.evaluation_id AND s.user_id = ?
      ORDER BY e.name
    `, [user_id]);

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};