import api from "./axiosInstance";
const MOCK_CROP_DATABASE = {
  Rice: { season: "Kharif", water_need: "High", duration: "90–120 days" },
  Wheat: { season: "Rabi", water_need: "Medium", duration: "110–130 days" },
  Maize: { season: "Kharif", water_need: "Medium", duration: "80–100 days" },
  Cotton: { season: "Kharif", water_need: "Medium–High", duration: "150–170 days" },
  Sugarcane: { season: "Annual", water_need: "Very High", duration: "10–12 months" },
};
// -------------------------------------------------------------
// GOOGLE AI / GEMINI CALL
// -------------------------------------------------------------
export const callGoogleAI = async (message) => {
  try {
    const res = await api.post("/api/gemini", { message });
    if (res.data?.success && res.data?.response) {
      return res.data.response;
    } else {
      // throw so caller knows it failed
      throw new Error(res.data?.message || "No response from Gemini");
    }
  } catch (err) {
    console.error("callGoogleAI error:", err);
    throw err;
  }
};

// -------------------------------------------------------------
// INTERNAL FALLBACK MOCK RESPONSE
// -------------------------------------------------------------
const generateEnhancedMockResponse = (message) => {
  const m = (message || "").toLowerCase();

  if (m.includes("rice")) {
    return `🌾 **Rice Cultivation Guide**
• Season: Kharif  
• Water Need: High  
• Soil: Clayey loam  
• Duration: 90–120 days`;
  }

  if (m.includes("wheat")) {
    return `🌾 **Wheat Farming Guide**
• Season: Rabi  
• Soil: Loam  
• Water: Medium  
• Duration: 110–130 days`;
  }

  return `🌱 **FarmAI Assistant**  
I can help with cropping patterns, soil, irrigation, pest control, and market insights.  
Tell me your *crop + location + challenge*.`;
};

// -------------------------------------------------------------
// CHAT HANDLER (TRIES GOOGLE → FALLBACK MOCK)
// -------------------------------------------------------------
export const chatWithAssistant = async (message) => {
  // returns { success: true, response: "<gemini text>", source: "google-ai" }
  const text = await callGoogleAI(message);
  return { success: true, response: text, source: "google-ai" };
};


// -------------------------------------------------------------
// HEALTH CHECK — BACKEND ONLY
// -------------------------------------------------------------
export const healthCheck = async () => {
  try {
    const res = await api.get("/api/health");
    return res.data;
  } catch (_) {
    return {
      success: false,
      status: "offline",
      message: "Backend not reachable. Using mock mode.",
      timestamp: new Date().toISOString(),
    };
  }
};

// -------------------------------------------------------------
// CROP DATABASE
// -------------------------------------------------------------
export const getCropDatabase = async () => {
  try {
    const res = await api.get("/api/crop-database");
    // backend returns { success: true, data: {...} }
    return res.data.data;
  } catch (_) {
    console.warn("⚠ Using mock crop database");
    return MOCK_CROP_DATABASE;
  }
};

// -------------------------------------------------------------
// GET CROP DETAILS (used by CropDatabase.js)
// -------------------------------------------------------------
export const getCropDetails = async (cropName) => {
  if (!cropName) {
    throw new Error("cropName is required");
  }
  try {
    const res = await api.get(`/api/crop/${encodeURIComponent(cropName)}`);
    // backend returns { success: true, data: {...} }
    return res.data.data;
  } catch (error) {
    console.warn("⚠ Using mock crop details for", cropName, error?.message);
    const fallback = MOCK_CROP_DATABASE[cropName];
    if (fallback) return fallback;
    throw error;
  }
};

// -------------------------------------------------------------
// WEATHER (used by CropRecommendation.js)
// -------------------------------------------------------------
export const getWeather = async (location) => {
  // location can be city name or {lat,lon} depending on your backend; here we accept string
  try {
    const loc = typeof location === "string" ? location : JSON.stringify(location);
    const res = await api.get(`/api/weather/${encodeURIComponent(loc)}`);
    return res.data;
  } catch (error) {
    console.warn("⚠ Using mock weather data for", location, error?.message);
    // return a reasonable mock
    return {
      temperature: "25-32°C",
      humidity: "60-80%",
      rainfall: "Low chance",
      wind_speed: "8-12 km/h",
      recommendation: "Suitable for sowing"
    };
  }
};

// -------------------------------------------------------------
// PREDICT YIELD
// -------------------------------------------------------------
export const predictYield = async (payload) => {
  try {
    const res = await api.post("/api/predict-yield", payload);
    return res.data.data;
  } catch (error) {
    console.error("Predict yield error:", error);
    throw error;
  }
};

// -------------------------------------------------------------
// RECOMMENDATIONS API
// -------------------------------------------------------------
export const getRecommendations = async (payload) => {
  try {
    const res = await api.post("/api/recommendations", payload);
    return res.data.data;
  } catch (error) {
    console.error("Recommendations error:", error);
    throw error;
  }
};

// -------------------------------------------------------------
// CHAT (OLD SIMPLE CHAT — NOT GEMINI)
// -------------------------------------------------------------
export const sendChatFallback = async (message) => {
  try {
    const res = await api.post("/api/chat", { message });
    return res.data.data.message;
  } catch (_) {
    return "⚠ Chat service unavailable.";
  }
};

// -------------------------------------------------------------
// AUTH — LOGIN
// -------------------------------------------------------------
export const loginUser = async (username, password) => {
  try {
    const res = await api.post("/api/auth/login", { username, password });
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Invalid credentials" };
  }
};

// -------------------------------------------------------------
// AUTH — REGISTER
// -------------------------------------------------------------
export const registerUser = async (username, password, email) => {
  try {
    const res = await api.post("/api/auth/register", {
      username,
      password,
      email,
    });
    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: "Registration failed" };
  }
};

// -------------------------------------------------------------
// Default export (convenience)
// -------------------------------------------------------------

export default {
  callGoogleAI,
  chatWithAssistant,
  healthCheck,
  getCropDatabase,
  getCropDetails,
  getWeather,
  predictYield,
  getRecommendations,
  sendChatFallback,
  loginUser,
  registerUser,
  generateResponse,
  fetchCrops,
};
