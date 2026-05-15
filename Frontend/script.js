document.addEventListener("DOMContentLoaded", function () {

  document.addEventListener("mousemove", function(e) {

    let circle = document.createElement("div");
    circle.classList.add("cursor-circle");

    circle.style.left = e.clientX + "px";
    circle.style.top = e.clientY + "px";

    document.body.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);

  });



  const navbar = document.querySelector(".side-navbar");

  if (navbar) {

    window.addEventListener("scroll", () => {

      if(window.scrollY > window.innerHeight - 100){
        navbar.classList.add("show");
      } else {
        navbar.classList.remove("show");
      }

    });

  }



  emailjs.init("qe1a4oFIiKJine_Cc");

});




function sendEmail() {

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let subject = document.getElementById("subject").value.trim();
  let message = document.getElementById("message").value.trim();



  if(name === "" || email === "" || subject === "" || message === "") {
    alert("Please fill all fields");
    return;
  }



  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailPattern.test(email)) {
    alert("Please enter valid email");
    return;
  }


  let params = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message
  };


  emailjs.send(
    "service_c817qvh",
    "template_nhobhzd",
    params
  )

  .then(function(response) {

    alert("Message Sent Successfully!");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";

    console.log(response);

  })

  .catch(function(error) {

    alert("Email Failed!");

    console.log(error);

  });

}

function toggleChat(){

  const chatbot = document.getElementById("chatbot");

  if(chatbot.style.display === "flex"){
    chatbot.style.display = "none";
  }
  else{
    chatbot.style.display = "flex";
  }

}

let knowledgeBase = [];

// LOAD KNOWLEDGE JSON
fetch("../data/knowledge.json")
.then(response => response.json())
.then(data => {

  knowledgeBase = data;
  console.log("Knowledge Base Loaded");

})
.catch(error => {
  console.log("JSON Load Error:", error);
});



// CLEAN TEXT FUNCTION
function cleanText(text){

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

}

function normalizeQuestion(question){

  question = question.toLowerCase();

  const replacements = {

    "belongs": "from",
    "belong": "from",
    "live": "location",
    "stays": "location",
    "city": "location",

    "tech stack": "skills",
    "technology": "skills",
    "technologies": "skills",

    "company": "work",
    "organization": "work",
    "office": "work",

    "recent company": "current company",
    "latest company": "current company",

    "ml": "machine learning",
    "ai": "artificial intelligence",

    "projects": "project"
  };

  for(let key in replacements){

    question = question.replaceAll(
      key,
      replacements[key]
    );

  }

  return question;

}


async function sendMessage(){

  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if(message === "") return;

  const chatBody = document.getElementById("chatBody");

  // USER MESSAGE
  chatBody.innerHTML += `
    <div class="user-message">${message}</div>
  `;

  input.value = "";

  // LOADING MESSAGE
  chatBody.innerHTML += `
    <div class="bot-message loading">
      Typing...
    </div>
  `;

  chatBody.scrollTop = chatBody.scrollHeight;

  try{

    // SEND TO FLASK BACKEND
    const response = await fetch("http://127.0.0.1:5000/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: normalizeQuestion(message)
      })

    });

    const data = await response.json();

    // REMOVE LOADING
    document.querySelector(".loading").remove();

    // BOT REPLY
    chatBody.innerHTML += `
      <div class="bot-message">
        ${data.answer}
      </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;

  }

  catch(error){

    console.log(error);

    document.querySelector(".loading").remove();

    chatBody.innerHTML += `
      <div class="bot-message">
        Server Error. Flask backend not connected.
      </div>
    `;

  }

}


// ENTER KEY SUPPORT
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("userInput");

  input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
      sendMessage();
    }

  });

});
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("userInput");

  input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
      sendMessage();
    }

  });

});