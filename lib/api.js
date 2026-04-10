export async function loginUser(email, password) {
  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function signupUser(email, password) {
  const res = await fetch("http://localhost:8000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Signup failed");
  }

  return data;
}