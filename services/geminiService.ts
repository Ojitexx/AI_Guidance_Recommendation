
import { GoogleGenAI, Type } from "@google/genai";
import { CareerPathName, TestResult } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const careerPathValues = Object.values(CareerPathName);

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendedCareer: {
      type: Type.STRING,
      enum: careerPathValues,
      description: "The single most suitable career path from the provided list.",
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5-7 key technical skills needed for this career.",
    },
    salaryRange: {
      type: Type.STRING,
      description: "A typical annual salary range for this career in Nigeria (NGN).",
    },
    jobRoles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-4 common job titles for this career path.",
    },
    relevantBooks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-3 highly-recommended book titles for beginners in this field."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief, 2-3 sentence explanation for why this career was recommended based on the user's answers."
    }
  },
  required: ["recommendedCareer", "skills", "salaryRange", "jobRoles", "relevantBooks", "reasoning"],
};

const mockResult: TestResult = {
  recommendedCareer: CareerPathName.WEB_DEV,
  skills: ["HTML & CSS", "JavaScript (ES6+)", "React or Vue.js", "Node.js & Express", "Git & GitHub", "API Integration"],
  salaryRange: "₦150,000 - ₦700,000 / month (entry to mid-level)",
  jobRoles: ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "UI/UX Developer"],
  relevantBooks: ["Eloquent JavaScript by Marijn Haverbeke", "You Don't Know JS series by Kyle Simpson", "Designing Web APIs by Brenda Jin et al."],
  reasoning: "This is a mock result because the API key is not configured. Your answers suggest a preference for building tangible, user-facing products and an interest in creative problem-solving, which aligns well with the skills required for modern Web Development."
};

export const getCareerRecommendation = async (answers: { [key: string]: string }): Promise<TestResult> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(mockResult), 1500));
  }
  
  const prompt = `
    A Computer Science student from Federal Polytechnic Bida has answered a personality and interest questionnaire.
    Based on their answers, recommend the most suitable career path for them from the following options:
    - ${CareerPathName.AI}
    - ${CareerPathName.CYBERSECURITY}
    - ${CareerPathName.NETWORKING}
    - ${CareerPathName.WEB_DEV}
    - ${CareerPathName.CLOUD}
    - ${CareerPathName.SOFTWARE_ENG}

    Here are the student's answers (question: answer):
    ${JSON.stringify(answers, null, 2)}

    Analyze their responses to infer their inclinations (e.g., logical, creative, security-focused, data-driven, systems-oriented) and match them to the single best career path.
    Provide your response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Validate that the recommended career is one of the allowed enums
    if (!careerPathValues.includes(result.recommendedCareer)) {
        console.error("API returned an invalid career path:", result.recommendedCareer);
        // Fallback to a default or mock result
        return mockResult;
    }

    return result as TestResult;
  } catch (error) {
    console.error("Error fetching career recommendation from Gemini API:", error);
    // In case of an API error, return the mock result as a fallback
    return mockResult;
  }
};
