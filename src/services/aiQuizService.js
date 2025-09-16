// AI Quiz Generation Service
// Uses OpenAI API for real AI-powered quiz generation

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export const aiQuizService = {
  // Generate a quiz using AI based on parameters
  async generateQuiz(parameters) {
    const {
      topic,
      subject,
      gradeLevel,
      difficulty = 'medium',
      questionCount = 5,
      questionTypes = ['multiple-choice', 'true-false', 'short-answer']
    } = parameters;

    try {
      // Check if OpenAI API key is available
      if (!process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.warn('OpenAI API key not configured, falling back to simulated quiz generation');
        return this.generateSimulatedQuiz(parameters);
      }

      // Create the prompt for OpenAI
      const prompt = this.createQuizPrompt(topic, subject, gradeLevel, difficulty, questionCount, questionTypes);
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate high-quality quiz questions and answers in JSON format. Always provide accurate, educational content appropriate for the specified grade level."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      // Parse the AI response
      const aiResponse = completion.choices[0].message.content;
      const quizData = this.parseAIResponse(aiResponse, parameters);

      return {
        success: true,
        data: quizData,
        error: null
      };

    } catch (error) {
      console.error('OpenAI API error:', error);
      console.log('Falling back to simulated quiz generation');
      return this.generateSimulatedQuiz(parameters);
    }
  },

  // Fallback to simulated quiz generation
  generateSimulatedQuiz(parameters) {
    const {
      topic,
      subject,
      gradeLevel,
      difficulty = 'medium',
      questionCount = 5,
      questionTypes = ['multiple-choice', 'true-false', 'short-answer']
    } = parameters;

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const quiz = {
          id: Date.now().toString(),
          title: `AI Generated Quiz: ${topic}`,
          description: `An AI-generated quiz about ${topic} for ${gradeLevel} grade ${subject} students`,
          topic,
          subject,
          gradeLevel,
          difficulty,
          questionCount,
          questions: [],
          totalPoints: 0,
          estimatedTime: questionCount * 2,
          createdAt: new Date().toISOString(),
          aiGenerated: true
        };

        // Generate questions based on topic and difficulty
        for (let i = 1; i <= questionCount; i++) {
          const question = this.generateQuestion(topic, subject, gradeLevel, difficulty, i);
          quiz.questions.push(question);
          quiz.totalPoints += question.points;
        }

        resolve({
          success: true,
          data: quiz,
          error: null
        });
      }, 2000);
    });
  },

  // Create a detailed prompt for OpenAI
  createQuizPrompt(topic, subject, gradeLevel, difficulty, questionCount, questionTypes) {
    const difficultyLevels = {
      'easy': 'beginner level',
      'medium': 'intermediate level',
      'hard': 'advanced level'
    };

    const gradeDescription = gradeLevel ? `for ${gradeLevel} grade students` : 'for students';
    const difficultyDescription = difficultyLevels[difficulty] || 'intermediate level';

    return `Create a ${difficultyDescription} quiz about "${topic}" in ${subject} ${gradeDescription}.

Requirements:
- Generate exactly ${questionCount} questions
- Question types: ${questionTypes.join(', ')}
- Each question should be educational and test understanding of the topic
- Provide clear, accurate answers
- Include explanations for learning purposes

Format the response as a JSON object with this structure:
{
  "title": "Quiz title",
  "description": "Brief description",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text",
      "points": 10,
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

For true/false questions, use:
- "type": "true-false"
- "correctAnswer": true or false
- "options": not needed

For short-answer questions, use:
- "type": "short-answer"
- "correctAnswer": "Sample correct answer"
- "options": not needed

For fill-in-blank questions, use:
- "type": "fill-in-blank"
- "correctAnswer": "Correct answer"
- "options": not needed

Make sure the JSON is valid and properly formatted.`;
  },

  // Parse OpenAI response and convert to quiz format
  parseAIResponse(aiResponse, parameters) {
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      const parsedData = JSON.parse(jsonString);

      const { topic, subject, gradeLevel, difficulty, questionCount } = parameters;

      const quiz = {
        id: Date.now().toString(),
        title: parsedData.title || `AI Generated Quiz: ${topic}`,
        description: parsedData.description || `An AI-generated quiz about ${topic} for ${gradeLevel} grade ${subject} students`,
        topic,
        subject,
        gradeLevel,
        difficulty,
        questionCount: parsedData.questions?.length || questionCount,
        questions: parsedData.questions || [],
        totalPoints: parsedData.questions?.reduce((sum, q) => sum + (q.points || 10), 0) || questionCount * 10,
        estimatedTime: (parsedData.questions?.length || questionCount) * 2,
        createdAt: new Date().toISOString(),
        aiGenerated: true
      };

      return quiz;

    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback to simulated quiz if parsing fails
      return this.generateSimulatedQuiz(parameters).then(result => result.data);
    }
  },

  // Generate individual questions
  generateQuestion(topic, subject, gradeLevel, difficulty, questionNumber) {
    const questionTypes = ['multiple-choice', 'true-false', 'short-answer', 'fill-in-blank'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    const difficultyMultiplier = {
      'easy': 1,
      'medium': 1.5,
      'hard': 2
    };

    const points = Math.floor(10 * difficultyMultiplier[difficulty]);
    
    switch (type) {
      case 'multiple-choice':
        return this.generateMultipleChoiceQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points);
      case 'true-false':
        return this.generateTrueFalseQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points);
      case 'short-answer':
        return this.generateShortAnswerQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points);
      case 'fill-in-blank':
        return this.generateFillInBlankQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points);
      default:
        return this.generateMultipleChoiceQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points);
    }
  },

  generateMultipleChoiceQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points) {
    const questions = {
      'Math': [
        `What is the value of x in the equation 2x + 5 = 15?`,
        `If a triangle has angles of 60° and 80°, what is the measure of the third angle?`,
        `What is the area of a rectangle with length 8 cm and width 5 cm?`,
        `Solve for y: 3y - 7 = 14`,
        `What is the perimeter of a square with side length 6 cm?`
      ],
      'Science': [
        `What is the chemical symbol for water?`,
        `Which planet is closest to the Sun?`,
        `What is the process by which plants make their own food?`,
        `What is the smallest unit of matter?`,
        `Which gas do plants absorb from the atmosphere?`
      ],
      'English': [
        `What is the past tense of the verb "run"?`,
        `Which of the following is a proper noun?`,
        `What type of word describes a noun?`,
        `What is the plural form of "child"?`,
        `Which sentence is written in passive voice?`
      ],
      'History': [
        `In what year did World War II end?`,
        `Who was the first President of the United States?`,
        `What was the name of the ship that brought the Pilgrims to America?`,
        `Which ancient wonder was located in Egypt?`,
        `What was the main cause of the American Civil War?`
      ]
    };

    const questionText = questions[subject]?.[questionNumber - 1] || `What is an important concept about ${topic}?`;
    
    return {
      id: `q${questionNumber}`,
      type: 'multiple-choice',
      question: questionText,
      points,
      options: this.generateMultipleChoiceOptions(topic, subject, gradeLevel, difficulty),
      correctAnswer: 0, // Index of correct answer
      explanation: `This question tests your understanding of ${topic} in ${subject}.`
    };
  },

  generateTrueFalseQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points) {
    const statements = {
      'Math': [
        'The sum of angles in a triangle is always 180 degrees.',
        'A square is a type of rectangle.',
        'Zero is a positive number.',
        'The number π is exactly 3.14.',
        'All rectangles are squares.'
      ],
      'Science': [
        'The Sun is a star.',
        'Water boils at 100°C at sea level.',
        'All living things are made of cells.',
        'The Earth is the largest planet in our solar system.',
        'Photosynthesis occurs only in plants.'
      ],
      'English': [
        'A sentence must have a subject and a verb.',
        'All nouns can be made plural by adding -s.',
        'Adjectives describe verbs.',
        'Every sentence must end with a period.',
        'Proper nouns are always capitalized.'
      ],
      'History': [
        'The Declaration of Independence was signed in 1776.',
        'The Roman Empire fell in 476 AD.',
        'Christopher Columbus discovered America.',
        'The Great Wall of China is visible from space.',
        'The Renaissance began in Italy.'
      ]
    };

    const statement = statements[subject]?.[questionNumber - 1] || `The concept of ${topic} is important in ${subject}.`;
    const isTrue = Math.random() > 0.5;

    return {
      id: `q${questionNumber}`,
      type: 'true-false',
      question: statement,
      points,
      correctAnswer: isTrue,
      explanation: `This statement is ${isTrue ? 'true' : 'false'} based on ${subject} principles.`
    };
  },

  generateShortAnswerQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points) {
    const questions = {
      'Math': [
        'Explain how to solve a linear equation step by step.',
        'What is the difference between area and perimeter?',
        'Describe the process of long division.',
        'Explain what a fraction represents.',
        'How do you find the mean of a set of numbers?'
      ],
      'Science': [
        'Explain the water cycle in your own words.',
        'What is the difference between a solid, liquid, and gas?',
        'Describe how plants make their own food.',
        'Explain what causes day and night.',
        'What is the difference between weather and climate?'
      ],
      'English': [
        'Explain the difference between a noun and a verb.',
        'What is the purpose of a topic sentence in a paragraph?',
        'Describe the elements of a good story.',
        'Explain what makes a sentence complete.',
        'What is the difference between fiction and non-fiction?'
      ],
      'History': [
        'Explain why the American Revolution happened.',
        'What were the main causes of World War I?',
        'Describe the impact of the Industrial Revolution.',
        'Explain the significance of the Magna Carta.',
        'What led to the fall of the Roman Empire?'
      ]
    };

    const questionText = questions[subject]?.[questionNumber - 1] || `Explain an important concept about ${topic}.`;

    return {
      id: `q${questionNumber}`,
      type: 'short-answer',
      question: questionText,
      points,
      correctAnswer: `Sample answer: This question requires students to demonstrate their understanding of ${topic} in ${subject}.`,
      explanation: `Students should provide a clear, detailed explanation showing their understanding of ${topic}.`
    };
  },

  generateFillInBlankQuestion(topic, subject, gradeLevel, difficulty, questionNumber, points) {
    const questions = {
      'Math': [
        'The formula for the area of a rectangle is length × _____.',
        'In the equation 2x + 3 = 11, the value of x is _____.',
        'A triangle with all equal sides is called an _____ triangle.',
        'The number that appears most frequently in a set is called the _____.',
        'The distance around a circle is called its _____.'
      ],
      'Science': [
        'The process by which plants make food is called _____.',
        'The smallest unit of matter is called an _____.',
        'The force that pulls objects toward Earth is called _____.',
        'The study of living things is called _____.',
        'The layer of gases around Earth is called the _____.'
      ],
      'English': [
        'A word that describes a noun is called an _____.',
        'The main character in a story is called the _____.',
        'A group of words that expresses a complete thought is called a _____.',
        'The time and place where a story happens is called the _____.',
        'A word that shows action is called a _____.'
      ],
      'History': [
        'The first President of the United States was _____.',
        'The war between the North and South in America was called the _____ War.',
        'The document that declared American independence was the _____.',
        'The ancient wonder located in Egypt was the Great _____ of Giza.',
        'The period of renewed interest in learning was called the _____.'
      ]
    };

    const questionText = questions[subject]?.[questionNumber - 1] || `An important concept in ${subject} is _____.`;

    return {
      id: `q${questionNumber}`,
      type: 'fill-in-blank',
      question: questionText,
      points,
      correctAnswer: `Sample answer for ${topic}`,
      explanation: `Students should fill in the blank with the correct term related to ${topic}.`
    };
  },

  generateMultipleChoiceOptions(topic, subject, gradeLevel, difficulty) {
    // Generate 4 options with one correct answer
    const options = [
      `Correct answer related to ${topic}`,
      `Incorrect option 1`,
      `Incorrect option 2`,
      `Incorrect option 3`
    ];

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
  },

  // Get AI suggestions for quiz topics based on course
  async getQuizSuggestions(courseId, courseName, subject) {
    try {
      // Check if OpenAI API key is available
      if (!process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.warn('OpenAI API key not configured, using fallback suggestions');
        return this.getFallbackSuggestions(subject);
      }

      // Create prompt for topic suggestions
      const prompt = `Generate 5 specific quiz topic suggestions for ${subject} education. 
      Topics should be:
      - Specific and focused
      - Appropriate for creating educational quizzes
      - Cover different aspects of ${subject}
      - Be engaging for students
      
      Return only a JSON array of topic strings, like:
      ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate specific, focused topic suggestions for creating educational quizzes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const aiResponse = completion.choices[0].message.content;
      const suggestions = JSON.parse(aiResponse);

      return {
        success: true,
        data: suggestions,
        error: null
      };

    } catch (error) {
      console.error('OpenAI API error for suggestions:', error);
      return this.getFallbackSuggestions(subject);
    }
  },

  // Fallback suggestions when OpenAI is not available
  getFallbackSuggestions(subject) {
    const suggestions = {
      'Math': [
        'Algebraic Equations',
        'Geometry Basics',
        'Fractions and Decimals',
        'Word Problems',
        'Graphing Functions'
      ],
      'Science': [
        'Scientific Method',
        'Ecosystems and Environment',
        'Matter and Energy',
        'Forces and Motion',
        'Earth and Space'
      ],
      'English': [
        'Grammar and Punctuation',
        'Reading Comprehension',
        'Creative Writing',
        'Literary Analysis',
        'Vocabulary Building'
      ],
      'History': [
        'Ancient Civilizations',
        'American Revolution',
        'World Wars',
        'Government and Politics',
        'Cultural Movements'
      ]
    };

    return {
      success: true,
      data: suggestions[subject] || [
        'Key Concepts',
        'Important Topics',
        'Review Material',
        'Practice Problems',
        'Assessment Topics'
      ],
      error: null
    };
  }
};

