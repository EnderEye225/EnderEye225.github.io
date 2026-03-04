const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm signup!");
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    authDiv.style.display = "none";
    chatDiv.style.display = "block";
    loadMessages();
  }
}

async function sendMessage() {
  const message = document.getElementById("messageInput").value;

  await supabase.from("messages").insert([{ content: message }]);
  document.getElementById("messageInput").value = "";
  loadMessages();
}

async function loadMessages() {
  const { data } = await supabase.from("messages").select("*");

  messagesDiv.innerHTML = "";
  data.forEach(msg => {
    messagesDiv.innerHTML += `<p>${msg.content}</p>`;
  });
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}
