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

export interface CareerSuggestion {
  title: string;
  description: string;
  matchScore: number;
  reasons: string[];
  requiredSkills: string[];
  salaryRange: string;
  growthPotential: string;
}

export async function getCareerSuggestions(
  userSkills: string[],
  interests?: string,
  experience?: string
): Promise<CareerSuggestion[]> {
  try {
    console.log('🤖 AI Service - Starting career suggestions');
    console.log('📊 Input - Skills:', userSkills);
    console.log('📊 Input - Interests:', interests);
    console.log('📊 Input - Experience:', experience);

    const prompt = `You are a career counselor AI. Based on the following information, suggest 4-5 suitable career paths.

User Skills: ${userSkills.join(', ') || 'Not specified'}
Interests: ${interests || 'Not specified'}
Experience Level: ${experience || 'Entry level'}

For each career suggestion, provide:
1. Career title
2. Brief description (2-3 sentences)
3. Match score (0-100) based on their skills
4. 3-4 specific reasons why this career matches their profile
5. 5-6 key skills they should develop
6. Typical salary range in Philippine Peso (₱)
7. Growth potential (High/Medium/Low)

IMPORTANT: Use Philippine Peso (₱) for all salary ranges. Consider Philippine market rates.

Respond in JSON format:
{
  "careers": [
    {
      "title": "Career Title",
      "description": "Description here",
      "matchScore": 85,
      "reasons": ["reason 1", "reason 2", "reason 3"],
      "requiredSkills": ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"],
      "salaryRange": "₱XXX,XXX - ₱XXX,XXX",
      "growthPotential": "High"
    }
  ]
}`;

    console.log('📤 Sending prompt to AI...');
    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    console.log('📥 AI Response - Error:', error);
    console.log('📥 AI Response - Output type:', typeof output);
    console.log('📥 AI Response - Output:', output);

    if (error) {
      console.error('❌ AI career suggestions error:', error);
      throw new Error(`AI Error: ${JSON.stringify(error)}`);
    }

    // Handle both string and object responses
    let parsed;
    if (typeof output === 'string') {
      console.log('🔍 Parsing string output...');
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : output;
      console.log('📝 JSON string to parse:', jsonStr.substring(0, 200));
      parsed = JSON.parse(jsonStr);
    } else if (typeof output === 'object') {
      console.log('🔍 Handling Bytez object response...');
      // Bytez returns {role: 'assistant', content: 'json_string'}
      if (output.content && typeof output.content === 'string') {
        console.log('📝 Extracting and parsing content from Bytez response...');
        // Try to extract JSON from markdown code blocks if present
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
    const careers = parsed.careers || parsed.suggestions || [];
    console.log('✅ Returning careers:', careers.length);
    
    return careers;
  } catch (error) {
    console.error('❌ Error getting career suggestions:', error);
    throw error;
  }
}

export async function generateCareerRoadmap(
  careerGoal: string,
  currentSkills: string[],
  timeframe: string
): Promise<{
  milestones: Array<{
    title: string;
    timeframe: string;
    skills: string[];
    actions: string[];
  }>;
  resources: string[];
  tips: string[];
}> {
  try {
    const prompt = `Create a detailed career roadmap for someone who wants to become a ${careerGoal}.

Current Skills: ${currentSkills.join(', ') || 'Beginner'}
Desired Timeframe: ${timeframe}

Provide:
1. 4-6 key milestones with specific timeframes
2. Skills to develop at each milestone
3. Concrete actions to take
4. Recommended learning resources
5. Professional tips for success

Respond in JSON format:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "timeframe": "0-3 months",
      "skills": ["skill 1", "skill 2"],
      "actions": ["action 1", "action 2"]
    }
  ],
  "resources": ["resource 1", "resource 2"],
  "tips": ["tip 1", "tip 2"]
}`;

    const { error, output } = await model.run([
      { role: 'user', content: prompt }
    ]);

    if (error) {
      console.error('AI career roadmap error:', error);
      throw new Error('Failed to generate career roadmap');
    }

    // Handle both string and object responses
    let parsed;
    if (typeof output === 'string') {
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : output;
      parsed = JSON.parse(jsonStr);
    } else if (typeof output === 'object') {
      // Bytez returns {role: 'assistant', content: 'json_string'}
      if (output.content && typeof output.content === 'string') {
        const jsonMatch = output.content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : output.content;
        parsed = JSON.parse(jsonStr);
      } else {
        parsed = output;
      }
    } else {
      throw new Error('Unexpected output type from AI');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating career roadmap:', error);
    throw error;
  }
}
