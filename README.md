# 🧠 AI Survival Score - Career Risk Analysis Tool

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://ai-survival-score-node.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)](https://nodejs.org/)

**Live Demo**: [https://ai-survival-score-node.vercel.app](https://ai-survival-score-node.vercel.app)

## 📖 Project Overview

AI Survival Score is an intelligent career risk analysis tool that helps users evaluate their profession's survival potential in the AI era. By inputting a job title, the system analyzes the risk of AI replacement and provides professional recommendations and tool suggestions.

## ✨ Key Features

- 🎯 **AI Survival Score Assessment** - 0-100 rating of career AI resistance
- 📊 **Career Competitiveness Comparison** - Benchmark against other professions  
- 🔍 **Multi-dimensional Analysis** - Comprehensive career characteristic evaluation
- ⚠️ **Replaceable Task Identification** - Highlights tasks vulnerable to AI automation
- 💪 **Core Competency Analysis** - Emphasizes irreplaceable human advantages
- 🛠️ **AI Tool Recommendations** - Suggests relevant AI productivity tools
- 💡 **Career Development Advice** - Provides targeted career planning guidance
- 📸 **Result Screenshot Export** - One-click analysis result saving
- 🌐 **Bilingual Support** - English/Chinese language toggle

## 🛠️ Technology Stack

### Frontend
- **HTML5/CSS3** - Modern responsive design with glassmorphism effects
- **Vanilla JavaScript (ES6+)** - Native JS for optimal performance
- **Canvas API** - Dynamic chart rendering and data visualization
- **HTML2Canvas** - Client-side screenshot functionality

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Vercel Serverless Functions** - Scalable serverless API architecture
- **OpenAI GPT-4 API** - Advanced AI analysis engine

### DevOps & Tools
- **GitHub** - Version control and code repository
- **Vercel** - Cloud deployment platform with auto-scaling
- **Environment Variables** - Secure API key management

## 🏗️ Project Architecture

```
ai-survival-score/
├── api/
│   └── analyze.js          # Serverless API endpoint
├── public/
│   ├── index.html          # Main application page
│   ├── style.css           # Styling and animations
│   ├── app.js              # Frontend logic and API calls
│   └── lang.js             # Internationalization support
├── package.json            # Project dependencies
├── .gitignore             # Git ignore configuration
├── LICENSE                # MIT license
└── README.md              # Project documentation
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yixuanhong/AI-Survival-Score-Node.git
cd AI-Survival-Score-Node
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
Create `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start development server**
```bash
npm start
```

5. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## 🔒 Security Features

- ✅ **API Key Protection** - Sensitive credentials stored in server-side environment variables
- ✅ **Frontend-Backend Separation** - Client-side cannot access API keys directly
- ✅ **HTTPS Deployment** - All communications encrypted in transit
- ✅ **Input Validation** - Protection against malicious input attacks
- ✅ **Error Handling** - Graceful error messages and fallback mechanisms

## 🎨 Design Highlights

- **Modern UI** - Dark theme with gradient colors and glassmorphism effects
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Smooth Animations** - Fluid interaction animations and loading states
- **Data Visualization** - Circular progress charts and animated progress bars
- **User Experience** - Intuitive workflow and clear information hierarchy

## 📈 Technical Implementation

### Secure API Architecture
```javascript
// Frontend API call
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input, lang })
})

// Backend processing (Vercel Serverless)
export default async function handler(req, res) {
  // Using environment variable for API key
  const apiKey = process.env.OPENAI_API_KEY;
  // Secure API call processing
}
```

### Dynamic Data Visualization
- Canvas-rendered circular progress indicators
- CSS3 animation-driven progress bars  
- Responsive chart layouts

## 🌟 Project Highlights

1. **Solves Real Problems** - Addresses career anxiety in the AI era
2. **Modern Architecture** - Utilizes cutting-edge Serverless architecture
3. **Security-First Approach** - API security considered from the start
4. **Excellent UX** - Clean and intuitive interface design
5. **Highly Scalable** - Easy to add new features and data sources

## 🔄 Deployment Pipeline

1. **Code commits to GitHub**
2. **Vercel auto-detects changes**
3. **Automatic build and deployment**
4. **Environment variables auto-injected**
5. **Global CDN distribution**

## 📊 Usage Statistics

- Supports analysis of hundreds of different careers
- Multi-dimensional evaluation system
- Bilingual language support
- Mobile-friendly interface

## 🤝 Contributing

Issues and Pull Requests are welcome to help improve the project!

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👤 Author

**Yixuan Hong**
- GitHub: [@yixuanhong](https://github.com/yixuanhong)
- Project Link: [AI-Survival-Score-Node](https://github.com/yixuanhong/AI-Survival-Score-Node)

## 🙏 Acknowledgments

- OpenAI GPT-4 API for providing AI analysis capabilities
- Vercel for excellent deployment platform
- All beta testers for valuable feedback

---

⭐ If this project helps you, please give it a star for support!
