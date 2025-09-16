import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Teacher-specific system prompt
const TEACHER_SYSTEM_PROMPT = `You are an AI teaching assistant designed to help educators with various classroom and educational tasks. You can assist with:

1. Lesson planning and curriculum development
2. Creating engaging activities and assignments
3. Classroom management strategies
4. Student assessment and feedback
5. Educational technology recommendations
6. Differentiated instruction techniques
7. Parent communication strategies
8. Professional development guidance
9. Subject-specific teaching methods
10. Educational policy and standards

Always provide practical, actionable advice tailored to the teacher's specific needs. Be encouraging, professional, and focus on student-centered learning approaches.`;

export const chatbotService = {
  async sendMessage(message, conversationHistory = []) {
    try {
      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: TEACHER_SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        success: true,
        message: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      
      // Fallback responses for common scenarios
      const fallbackResponses = [
        "I'm here to help! Could you please rephrase your question? I can assist with lesson planning, classroom management, student assessment, and more.",
        "I'd be happy to help you with that. Could you provide a bit more context about what you're working on?",
        "That's a great question! I can help with various teaching topics. What specific aspect would you like to explore?",
        "I'm ready to assist! Whether it's curriculum planning, student engagement, or classroom strategies, I'm here to help."
      ];
      
      return {
        success: false,
        message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        error: error.message
      };
    }
  },

  // Get quick suggestions for common teacher tasks
  getQuickSuggestions() {
    return [
      "Help me plan a lesson on fractions",
      "Suggest activities for student engagement",
      "How to handle disruptive behavior?",
      "Ideas for parent-teacher conferences",
      "Assessment strategies for different learning styles",
      "Technology tools for the classroom",
      "Differentiated instruction techniques",
      "Classroom management tips"
    ];
  },

  // Get context-aware suggestions based on current view
  getContextualSuggestions(currentView, userData = {}) {
    const suggestions = {
      dashboard: [
        "How can I improve student performance?",
        "Ideas for engaging struggling students",
        "Assessment strategies for my class"
      ],
      courses: [
        "Help me design a new course curriculum",
        "Suggest engaging course activities",
        "How to structure course content effectively?"
      ],
      students: [
        "Strategies for individual student support",
        "How to identify learning difficulties?",
        "Ideas for student motivation"
      ],
      assignments: [
        "Help me create effective assignments",
        "Ideas for project-based learning",
        "How to provide meaningful feedback?"
      ]
    };

    return suggestions[currentView] || suggestions.dashboard;
  }
};

export default chatbotService;
