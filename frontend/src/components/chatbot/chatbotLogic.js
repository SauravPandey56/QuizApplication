export function getBotResponse(message) {
  const msg = message.toLowerCase();

  const responses = {
    greeting: [
      "Hello 👋 Welcome to the Quiz Assistant. How can I help you today?",
      "Hi there! I'm your interactive assistant. What can I do for you?",
      "Greetings! Are you looking for help with quizzes or your account?"
    ],
    quiz: [
      "You can start a quiz by navigating to your Dashboard and selecting an available module.",
      "Quizzes are assigned based on your Campus and Branch. Check your Dashboard for active tests.",
      "During a quiz, ensure you stay in full-screen mode and don't navigate away, or your test will auto-submit!"
    ],
    login: [
      "Click the login button on the top right corner to access your account.",
      "If you're having trouble logging in, make sure your credentials match your registered email and password.",
      "You can log out anytime from the profile dropdown menu."
    ],
    admin: [
      "Admins can manage quizzes, questions, and student results from the secure admin dashboard.",
      "Examiners must request admin approval to modify any live quizzes.",
      "Admins control the system configuration like campus branches and test schedules."
    ],
    result: [
      "Your quiz result will dynamically appear immediately after submitting the test.",
      "You can view all past quiz attempts and your scores under the 'Past Results' tab on your dashboard.",
      "Accuracy, correct, and incorrect statistics are provided per attempt!"
    ],
    help: [
      "I can assist you with quizzes, login queries, results analysis, or general platform navigation.",
      "I'm here to support you! Try asking me about 'quizzes', 'results', or 'login'."
    ],
    default: [
      "I'm the Quiz Assistant 🤖. Ask me about quizzes, login, results, or navigation.",
      "I didn't quite catch that. Could you ask about 'quizzes', 'results', or 'login'?",
      "I am an automated assistant. Let me know if you need help with your account or active tests!"
    ]
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) return pickRandom(responses.greeting);
  if (msg.includes("quiz") || msg.includes("test") || msg.includes("exam")) return pickRandom(responses.quiz);
  if (msg.includes("login") || msg.includes("sign in") || msg.includes("register")) return pickRandom(responses.login);
  if (msg.includes("admin") || msg.includes("examiner") || msg.includes("teacher")) return pickRandom(responses.admin);
  if (msg.includes("result") || msg.includes("score") || msg.includes("marks")) return pickRandom(responses.result);
  if (msg.includes("help") || msg.includes("support")) return pickRandom(responses.help);

  return pickRandom(responses.default);
}
