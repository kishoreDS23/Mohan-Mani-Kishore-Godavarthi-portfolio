import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export const KISHORE_SYSTEM_INSTRUCTION = `
You are the official AI Career & Technical Assistant for Mani Kishore Godavarthi, an ambitious and highly skilled Data Science undergraduate (B.Tech in Data Science, 2023–2027 at Pragati Engineering College).

Profile Summary:
- Full Name: Mani Kishore Godavarthi
- Degree: B.Tech in Data Science (Graduating 2027)
- College: Pragati Engineering College
- Core Domains: Machine Learning, Artificial Intelligence, Data Engineering, Predictive Modeling, Exploratory Data Analysis, Computer Vision, Big Data.
- Core Languages & Tools: Python, SQL, Pandas, NumPy, Scikit-Learn, Streamlit, Power BI, Excel, OpenCV, PyTorch, YOLO, Git/GitHub, FastAPI.
- Email: manikishoregodavarthi@gmail.com
- Key Projects:
  1. Automated Data Cleaning Application (Python, Pandas, Streamlit): Solves manual data preparation pain by auto-detecting missing values, duplicates, outliers (IQR/Z-score), type mismatches, and exporting production-ready cleaned datasets.
  2. AI Traffic Signal Control System (Python, YOLOv8, OpenCV): Dynamic green-light timing allocation based on real-time vehicle density estimation with priority override for emergency vehicles.
  3. ML Predictive Analytics & Customer Churn Engine (XGBoost, Scikit-Learn, SHAP): High-accuracy classification with interpretable feature importance.
  4. Executive Data Analytics & Power BI Dashboard (SQL, Power BI, DAX): Multi-dimensional KPI analytics with cohort retention and automated data pipelines.
  5. Intelligent Video Surveillance & Anomaly Detection (PyTorch, OpenCV, Flask).
  6. AI Research Assistant & Document Q&A (RAG, Gemini API, Vector Search).

Your Goal:
- Act as an articulate, knowledgeable, friendly, and technically sound representative for Mani Kishore Godavarthi.
- Provide clear answers to recruiters, engineering managers, professors, and tech visitors.
- Highlight Mani Kishore's strong hands-on problem-solving skills, academic rigor, and eagerness to contribute to top-tier Data Science & AI teams for internships and roles.
- If asked technical questions (e.g., "Explain how IQR outlier detection works in Kishore's project" or "How does YOLO fit into traffic control?"), provide insightful, crisp explanations.
- Keep answers professional, concise, structured, and easy to read.
`;

export async function generateGeminiSafe(prompt: string, fallbackGenerator: () => string): Promise<string> {
  const models = ["gemini-3.7-flash", "gemini-3.1-flash-lite"];
  
  for (const model of models) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Gemini attempt with ${model} warning:`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return fallbackGenerator();
}

export function getContextualCareerReply(userMsg: string): string {
  const lower = (userMsg || "").toLowerCase();

  if (lower.includes("hire") || lower.includes("why hire") || lower.includes("candidate") || lower.includes("role") || lower.includes("opportunity") || lower.includes("internship")) {
    return `Mani Kishore Godavarthi is an exceptional candidate for Data Science & AI/ML roles:

1. **Practical Engineering Rigor**: Unlike purely theoretical students, Mani Kishore builds production-ready systems — from automated data cleaning engines to real-time YOLOv8 computer vision traffic optimizers.
2. **Deep Stack Expertise**: Proficient in Python, SQL, Pandas, NumPy, Scikit-Learn, PyTorch, Power BI, and Streamlit.
3. **Academic Excellence**: Pursuing B.Tech in Data Science (2023–2027) at Pragati Engineering College with consistent top performance.
4. **Immediate Impact**: Ready for internships and full-time opportunities. Reach out at manikishoregodavarthi@gmail.com!`;
  }

  if (lower.includes("clean") || lower.includes("data cleaning") || lower.includes("impute") || lower.includes("outlier") || lower.includes("iqr")) {
    return `Mani Kishore's **Automated Data Cleaning Application** solves manual data preparation bottlenecks:
- **Intelligent Imputation**: Automates mean, median, and mode imputation based on skewness analysis.
- **IQR Outlier Normalization**: Calculates Interquartile Range boundaries (Q1 - 1.5×IQR to Q3 + 1.5×IQR) to cap or isolate extreme deviations without distorting distributions.
- **Deduplication**: Eliminates duplicate record clusters with instantaneous hash verification.
- **Interactive UI**: Built with Streamlit and Python for export-ready clean datasets.`;
  }

  if (lower.includes("yolo") || lower.includes("traffic") || lower.includes("vision") || lower.includes("opencv") || lower.includes("camera")) {
    return `In the **AI Traffic Signal Control System**, Mani Kishore leveraged **YOLOv8** and **OpenCV**:
- **Real-Time Density Estimation**: Detects and counts vehicle classes (cars, buses, trucks, bikes) across four multi-directional lanes.
- **Dynamic Green-Light Allocation**: Dynamically calculates green-light duration proportional to lane vehicle congestion rather than fixed static timers.
- **Emergency Priority Override**: Uses instant computer vision detection to trigger an immediate green corridor for ambulances and fire trucks.`;
  }

  if (lower.includes("interview") || lower.includes("question") || lower.includes("quiz") || lower.includes("ask")) {
    return `Here is a great technical interview question for Mani Kishore:

**"In machine learning pipelines, when would you prefer Median Imputation over Mean Imputation, and how do you prevent data leakage during train-test splitting?"**

*Key Answer points*: Median imputation is robust against skewed distributions with extreme outliers. To avoid data leakage, imputation statistics (median/mean) must be computed exclusively on the training split and applied to the validation/test splits.`;
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach") || lower.includes("connect") || lower.includes("phone")) {
    return `You can connect directly with Mani Kishore Godavarthi:
- **Email**: manikishoregodavarthi@gmail.com
- **LinkedIn**: linkedin.com/in/manikishoregodavarthi
- **GitHub**: github.com/manikishoregodavarthi
- **Status**: Actively Open to Internships & Data Science Opportunities!`;
  }

  return `Mani Kishore Godavarthi is a Data Science student at Pragati Engineering College (2023–2027) specializing in Machine Learning, Python, automated data pipelines, and computer vision.

He is actively available for data science internships and technical roles. Feel free to ask about his specific projects, technical skills in Python/SQL/ML, or contact details!`;
}
