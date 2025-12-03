import db from '../config/db.js';

export const exportEmployees = async (req, res) => {
  try {
    const [employees] = await db.execute(`
      SELECT name, email, job_position, date_hired, birthday
      FROM users 
      WHERE role = 'employee'
      ORDER BY name
    `);

    // Create CSV content
    const csvHeader = 'Name,Email,Position,Date Hired,Birthday\n';
    const csvRows = employees.map(emp => 
      `"${emp.name}","${emp.email}","${emp.job_position || ''}","${emp.date_hired || ''}","${emp.birthday || ''}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employees.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportTimeOffRequests = async (req, res) => {
  try {
    const [requests] = await db.execute(`
      SELECT 
        u.name as employee_name,
        tor.start_date,
        tor.end_date,
        tor.reason,
        tor.status,
        tor.admin_note
      FROM time_off_requests tor
      JOIN users u ON tor.user_id = u.id
      ORDER BY tor.start_date DESC
    `);

    // Create CSV content
    const csvHeader = 'Employee,Start Date,End Date,Reason,Status,Admin Note\n';
    const csvRows = requests.map(req => 
      `"${req.employee_name}","${req.start_date}","${req.end_date}","${req.reason || ''}","${req.status}","${req.admin_note || ''}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="time_off_requests.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};