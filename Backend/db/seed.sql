USE TechnicalTestDB;

-- USERS (admin + employees)
INSERT INTO users (name, email, password, role, job_position, profile_picture, birthday, date_hired) VALUES
('Admin User', 'admin@hr.com', '$2b$10$W4mofSYyQJoaaZeD/jqdh.shYbYfPZOiO7To2wOIzaWGwyGZINa/e', 'admin', 'HR Manager', NULL, '1990-05-10', '2020-01-01'),
('John Doe', 'john@hr.com', '$2b$10$Jwqq33Wwxo/YLfcvcWdH/.XO7AqF.ePH8jGStLegVYctuzcVg56Iy', 'employee', 'Accountant', NULL, '1994-03-12', '2022-05-20'),
('Sarah Smith', 'sarah@hr.com', '$2b$10$bf.gAut8yfqtO0tvS6SRcuJ2pi7gl3heZjTVAFhEGuRj6R6xI1dMG', 'employee', 'Marketing Specialist', NULL, '1996-09-22', '2023-02-10'),
('Adam White', 'adam@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Developer', NULL, '1998-07-15', '2024-01-03'),
('Emma Johnson', 'emma@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Designer', NULL, '1992-11-08', '2021-03-15'),
('Michael Brown', 'michael@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Sales Manager', NULL, '1988-04-22', '2019-07-01'),
('Lisa Davis', 'lisa@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Data Analyst', NULL, '1995-01-30', '2023-08-12'),
('David Wilson', 'david@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Project Manager', NULL, '1987-06-14', '2018-11-20'),
('Jennifer Lee', 'jennifer@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Content Writer', NULL, '1993-09-05', '2022-01-10'),
('Robert Taylor', 'robert@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'QA Engineer', NULL, '1991-12-18', '2020-09-25'),
('Amanda Garcia', 'amanda@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Business Analyst', NULL, '1989-03-27', '2021-06-08'),
('Chris Martinez', 'chris@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'DevOps Engineer', NULL, '1990-08-11', '2023-04-03'),
('Jessica Anderson', 'jessica@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'UX Designer', NULL, '1994-07-02', '2022-11-15'),
('Kevin Thomas', 'kevin@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'Finance Manager', NULL, '1986-10-09', '2017-12-01'),
('Rachel White', 'rachel@hr.com', '$2b$10$UzOkMTKkWeVwjSaVxfPOnOuFdifTnHriOoSZmio/F/1a8l4jt76uW', 'employee', 'HR Specialist', NULL, '1992-05-16', '2021-08-22');

-- EVALUATIONS
INSERT INTO evaluations (name) VALUES
('Bookkeeping'),
('VAT'),
('Toolbox'),
('Yearwork');

-- SCORES
INSERT INTO scores (user_id, evaluation_id, score) VALUES
(2, 1, 45),  -- John: Bookkeeping
(2, 2, 72),  -- John: VAT
(3, 1, 28),  -- Sarah: Bookkeeping
(3, 3, 65),  -- Sarah: Toolbox
(4, 4, 90);  -- Adam: Yearwork

-- COURSES
INSERT INTO courses (title, description, image_url) VALUES
('React Basics', 'Introductory course to React.', 'https://example.com/react.png'),
('Financial Reporting', 'Course on financial statements and reporting.', 'https://example.com/finance.png'),
('Team Communication', 'Soft skills training.', 'https://example.com/team.png');

-- ENROLLMENTS
INSERT INTO enrollments (user_id, course_id) VALUES
(2, 1),
(3, 1),
(3, 2),
(4, 3);

-- TIME OFF REQUESTS
INSERT INTO time_off_requests (user_id, start_date, end_date, reason, status, admin_note) VALUES
(2, '2025-01-10', '2025-01-12', 'Family event', 'approved', 'Enjoy your leave'),
(3, '2025-02-05', '2025-02-07', 'Medical appointment', 'pending', NULL),
(4, '2025-03-15', '2025-03-16', 'Travel', 'rejected', 'Too close to project delivery');
