const Poll = require('../models/Poll');

let currentPoll = null;
let pollTimer = null;

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create_poll', (pollData) => {
      if (currentPoll) {
        socket.emit('error', 'A poll is already active.');
        return;
      }
      currentPoll = {
        ...pollData,
        answers: [],
        createdAt: new Date(),
        endedAt: null
      };
      io.emit('poll_started', currentPoll);
      // Start timer
      pollTimer = setTimeout(() => {
        endPoll(io);
      }, pollData.duration * 1000);
    });


    // Student submits an answer
    socket.on('submit_answer', (answerData) => {
      // answerData: { studentName, optionIndex }
      if (!currentPoll) return;
      // Prevent duplicate answers from same student
      if (currentPoll.answers.some(a => a.studentName === answerData.studentName)) return;
      currentPoll.answers.push({ ...answerData, answeredAt: new Date() });
      io.emit('poll_update', currentPoll);
      // Optionally, end poll early if all students have answered (not tracked here)
    });

    // Client requests current poll (e.g., on join)
    socket.on('get_current_poll', () => {
      if (currentPoll) {
        socket.emit('poll_started', currentPoll);
      }
    });
  });
};

// Helper to end poll, broadcast results, and save to history
async function endPoll(io) {
  if (!currentPoll) return;
  currentPoll.endedAt = new Date();
  io.emit('poll_ended', currentPoll);
  // Save to history (MongoDB)
  try {
    const poll = new Poll(currentPoll);
    await poll.save();
    console.log('Poll saved to history');
  } catch (err) {
    console.error('Failed to save poll:', err);
  }
  currentPoll = null;
  pollTimer = null;
} 