const SUPABASE_URL = "https://qbdaswqnuccoeljirrdi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZGFzd3FudWNjb2VsamlycmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODE4NjksImV4cCI6MjA4ODE1Nzg2OX0._HhOGHzknX-fEnSBjsghKdXoNDlcIRDGpPoIa82DgrM";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");

// Sign up
async function signUp() {
  const email = email.value;
  const password = password.value;
  await supabase.auth.signUp({ email, password });
  alert("Check your email to confirm!");
}

// Sign in
async function signIn() {
  const email = email.value;
  const password = password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
}

// Logout
async function logout() {
  await supabase.auth.signOut();
}

// Send message
async function sendMessage() {
  const user = (await supabase.auth.getUser()).data.user;
  const content = messageInput.value;

  await supabase.from("messages").insert({
    content,
    user_email: user.email
  });

  messageInput.value = "";
}

// Load messages
async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  messagesDiv.innerHTML = "";
  data.forEach(msg => {
    messagesDiv.innerHTML += `<div>${msg.user_email}: ${msg.content}</div>`;
  });
}

// Realtime subscription
supabase
  .channel("realtime-messages")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "messages" },
    loadMessages
  )
  .subscribe();

// Auth listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    authDiv.style.display = "none";
    chatDiv.style.display = "block";
    loadMessages();
  } else {
    authDiv.style.display = "block";
    chatDiv.style.display = "none";
  }
});
