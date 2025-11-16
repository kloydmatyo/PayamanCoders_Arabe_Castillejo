import Bytez from 'bytez.js';

// Initialize Bytez SDK
const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY;
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured');
  }
  return new Bytez(apiKey);
};

const model = getBytezClient().model('openai/gpt-4.1');

export interface LearningResource {
  title: string;
  description: string;
  url: string;
  type: 'Course' | 'Tutorial' | 'Documentation' | 'Video' | 'Article' | 'Book';
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  isFree: boolean;
  rating?: string;
}

export async function getLearningResources(
  careerTitle: string,
  skills: string[]
): Promise<LearningResource[]> {
  try {
    console.log('🤖 AI Learning Resources - Starting search');
    console.log('📊 Career:', careerTitle);
    console.log('📊 Skills:', skills);

    const prompt = `You are an expert career advisor and learning resource curator. Based on the career path and required skills, recommend the best learning resources available on the internet.

Career Path: ${careerTitle}
Required Skills: ${skills.join(', ')}

Search the internet and provide 8-10 high-quality learning resources that would help someone develop these skills for this career. Include a mix of free and paid resources from reputable platforms.

For each resource, provide:
1. Title of the course/resource
2. Brief description (1-2 sentences)
3. URL/Link to the resource
4. Type (Course, Tutorial, Documentation, Video, Article, or Book)
5. Platform name (e.g., Coursera, Udemy, YouTube, freeCodeCamp, MDN, etc.)
6. Difficulty level (Beginner, Intermediate, or Advanced)
7. Estimated time to complete
8. Whether it's free or paid
9. Rating or popularity indicator if available

IMPORTANT: Provide real, existing resources with actual URLs. Focus on popular platforms like:
- Coursera, Udemy, edX, Pluralsight (for courses)
- YouTube, freeCodeCamp (for free tutorials)
- Official documentation sites
- Medium, Dev.to (for articles)
- O'Reilly, Manning (for books)

Respond in JSON format:
{
  "resources": [
    {
      "title": "Resource Title",
      "description": "Brief description of what you'll learn",
      "url": "https://actual-url.com",
      "type": "Course",
      "platform": "Platform Name",
      "difficulty": "Beginner",
      "estimatedTime": "4 weeks",
      "isFree": true,
      "rating": "4.8/5"
    }
  ]
}`;

    console.log('📤 Sending prompt to AI...');
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    console.log('📥 AI Response - Error:', error);
    console.log('📥 AI Response - Output type:', typeof output);

    if (error) {
      console.error('❌ AI learning resources error:', error);
      throw new Error(`AI Error: ${JSON.stringify(error)}`);
    }

    // Handle both string and object responses
    let parsed;
    if (typeof output === 'string') {
      console.log('🔍 Parsing string output...');
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : output;
      parsed = JSON.parse(jsonStr);
    } else if (typeof output === 'object') {
      console.log('🔍 Handling Bytez object response...');
      // Bytez returns {role: 'assistant', content: 'json_string'}
      if (output.content && typeof output.content === 'string') {
        console.log('📝 Extracting and parsing content from Bytez response...');
        const jsonMatch = output.content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : output.content;
        parsed = JSON.parse(jsonStr);
      } else {
        console.log('🔍 Using object output directly');
        parsed = output;
      }
    } else {
      console.error('❌ Unexpected output type:', typeof output);
      throw new Error('Unexpected output type from AI');
    }

    console.log('✅ Parsed result:', parsed);
    const resources = parsed.resources || [];
    console.log('✅ Returning resources:', resources.length);
    
    return resources;
  } catch (error) {
    console.error('❌ Error getting learning resources:', error);
    throw error;
  }
}
