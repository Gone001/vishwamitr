const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || ""
    let detail = `HTTP ${response.status}`
    
    if (contentType.includes("application/json")) {
      const error = await response.json().catch(() => null)
      detail = error?.detail || error?.message || detail
    } else {
      const text = await response.text().catch(() => "")
      if (text) detail = text.slice(0, 200)
    }
    
    console.error("Fetch error:", response.status, detail)
    throw new Error(detail)
  }

  return response.json()
}

export async function askAI(question) {
  return fetchWithAuth(`${API_URL}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  })
}

export async function createUser(userData) {
  return fetchWithAuth(`${API_URL}/create-user`, {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function getQuizQuestions({ subject, difficulty, limit = 5 }) {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  const params = new URLSearchParams()
  if (subject) params.append("subject", subject)
  if (difficulty) params.append("difficulty", difficulty)
  params.append("limit", limit.toString())
  params.append("email", email)

  return fetchWithAuth(`${API_URL}/quiz/questions?${params}`, {
    method: "GET",
  })
}

export async function submitQuizResult({ subject, score, total, time_taken, difficulty, answers }) {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  return fetchWithAuth(`${API_URL}/quiz/submit?email=${encodeURIComponent(email)}`, {
    method: "POST",
    body: JSON.stringify({ subject, score, total, time_taken, difficulty, answers }),
  })
}

export async function getQuizHistory() {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  return fetchWithAuth(`${API_URL}/quiz/history?email=${encodeURIComponent(email)}`, {
    method: "GET",
  })
}

export async function getQuizSubjects() {
  return fetchWithAuth(`${API_URL}/quiz/subjects`, {
    method: "GET",
  })
}

/**
 * Generate quiz questions - tries Gemini first, falls back to DB
 * Returns { source: "gemini" | "database", questions: [...], fallback: boolean, message?: string }
 */
export async function generateQuizQuestions({ subject, difficulty = "medium", topic = null }) {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  return fetchWithAuth(`${API_URL}/quiz/generate?email=${encodeURIComponent(email)}`, {
    method: "POST",
    body: JSON.stringify({ subject, difficulty, topic }),
  })
}

export async function getProfile() {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  return fetchWithAuth(`${API_URL}/profile?email=${encodeURIComponent(email)}`, {
    method: "GET",
  })
}

export async function updateProfile(profileData) {
  const email = localStorage.getItem("email")
  if (!email) throw new Error("Not logged in")
  return fetchWithAuth(`${API_URL}/profile?email=${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}
