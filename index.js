const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mentors = [];
const students = [];

// Create Mentor API
app.post('/api/mentors', (req, res) => {
  const { name } = req.body;
  const mentor = { id: mentors.length + 1, name, students: [] };
  mentors.push(mentor);
  res.status(201).json(mentor);
});

// Create Student API
app.post('/api/students', (req, res) => {
  const { name } = req.body;
  const student = { id: students.length + 1, name, mentor: null };
  students.push(student);
  res.status(201).json(student);
});

// Assign a Student to Mentor API
app.put('/api/mentors/:mentorId/students', (req, res) => {
  const { mentorId } = req.params;
  const studentIds = req.body.studentIds;

  const mentor = mentors.find((mentor) => mentor.id === parseInt(mentorId));

  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  studentIds.forEach((studentId) => {
    const student = students.find((student) => student.id === parseInt(studentId));

    if (!student) {
      return res.status(400).json({ message: `Student with ID ${studentId} not found` });
    }

    if (student.mentor) {
      return res.status(400).json({ message: `Student ${student.name} already has a mentor` });
    }

    mentor.students.push(student);
    student.mentor = mentor;
  });

  res.status(200).json({ message: 'Students assigned to mentor successfully' });
});

// Assign or Change Mentor for a Student API
app.put('/api/students/:studentId/mentor', (req, res) => {
  const { studentId } = req.params;
  const { mentorId } = req.body;

  const student = students.find((student) => student.id === parseInt(studentId));
  const mentor = mentors.find((mentor) => mentor.id === parseInt(mentorId));

  if (!student || !mentor) {
    return res.status(404).json({ message: 'Student or mentor not found' });
  }

  student.mentor = mentor;
  res.status(200).json({ message: 'Student assigned to a new mentor successfully' });
});

// Show All Students for a Particular Mentor API
app.get('/api/mentors/:mentorId/students', (req, res) => {
  const { mentorId } = req.params;
  const mentor = mentors.find((mentor) => mentor.id === parseInt(mentorId));

  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const mentorStudents = mentor.students;
  res.status(200).json(mentorStudents);
});

// Show the Previously Assigned Mentor for a Particular Student API
app.get('/api/students/:studentId/previous-mentor', (req, res) => {
  const { studentId } = req.params;
  const student = students.find((student) => student.id === parseInt(studentId));

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const previousMentor = student.mentor ? student.mentor : null;
  res.status(200).json(previousMentor);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
