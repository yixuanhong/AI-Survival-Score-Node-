// api/analyze.js - Vercel API Routes格式
export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input, lang } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // 检查API密钥
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Act as a career and AI assistant. For the job title: "${input}", generate the following in JSON:

    {
     "title": "...",
     "top_charts": {
       "left_chart": { 
         "label": "${lang === 'zh' ? 'AI世界生存分数' : 'AI Survival Score'}", 
         "score": 0, 
         "max_score": 100 
       },
       "right_chart": { 
         "label": "${lang === 'zh' ? '超越职业比例' : 'Beats Other Jobs'}", 
         "percentile": 0 
       }
     },
     "slogan": {
       "title": "...",
       "text": "..."
     },
     "cards": [
       {
         "type": "score_analysis",
         "title": "...",
         "score": "...",
         "meaning": "...",
         "dimensions": [
           { "title": "...", "description": "..." }
         ]
       },
       {
         "type": "easy_to_replace",
         "title": "...",
         "tasks": ["..."]
       },
       {
         "type": "hard_to_replace",
         "title": "...",
         "tasks": ["..."]
       },
       {
         "type": "recommended_tools",
         "title": "...",
         "tools": [
           { "name": "...", "function": "...", "url": "..." }
         ]
       },
       {
         "type": "career_advice",
         "title": "...",
         "advice": ["..."]
       }
     ]
    }

    Important instructions:
    - The left_chart score should represent how well this job survives AI automation (0-100, higher = better survival)
    - The right_chart percentile should show what percentage of other jobs this job beats in AI resistance (0-100)
    - Make sure the labels are exactly "${lang === 'zh' ? 'AI世界生存分数' : 'AI Survival Score'}" and "${lang === 'zh' ? '超越职业比例' : 'Beats Other Jobs'}"
    - The slogan should be creative and catchy, combining the job's unique characteristics with its AI survival outlook. Examples: "人工智能时代的不可替代者" or "AI cannot replicate your creative spark" - make it inspiring and specific to this profession
    - The recommended_tools should be ai-related
    - Focus on AI replacement analysis in the content
    - Make titles more specific to AI impact analysis

    Respond in ${lang === 'zh' ? 'Chinese' : 'English'} only using JSON format, no other text.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    try {
      const parsed = JSON.parse(content);
      res.json({ success: true, data: parsed });
    } catch (e) {
      res.json({ success: false, error: 'JSON parsing error', content: content });
    }

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
