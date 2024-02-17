const form = document.getElementById("ticket-form");
const ticketContainer = document.getElementById("ticket-container");
const discordWebhookUrl = "https://discord.com/api/webhooks/WEBHOOK_URL"; // Replace with your Discord webhook URL
const replyFormTemplate = document.getElementById("reply-form-template").innerHTML;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !subject || !message) {
    alert("Please fill out all fields.");
    return;
  }

  const ticket = {
    name,
    email,
    subject,
    message,
  };

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      throw new Error("Failed to send ticket.");
    }

    form.reset();
    alert("Ticket has been sent.");
  } catch (error) {
    console.error(error);
    alert("Failed to send ticket. Please try again later.");
  }
});

ticketContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("reply-button")) {
    const ticketId = event.target.dataset.ticketId;
    const replyFormContainer = document.getElementById(`reply-form-container-${ticketId}`);

    if (replyFormContainer.style.display === "block") {
      replyFormContainer.style.display = "none";
      return;
    }

    replyFormContainer.style.display = "block";

    const replyForm = document.getElementById(`reply-form-${ticketId}`);
    const ticketData = await fetchTicketData(ticketId);
    const ticketMessage = ticketData.messages[ticketData.messages.length - 1].content;

    replyForm.innerHTML = replyFormTemplate
      .replace("{{ticketId}}", ticketId)
      .replace("{{ticketMessage}}", ticketMessage);
  }
});

async function fetchTicketData(ticketId) {
  const response = await fetch(`https://api.example.com/tickets/${ticketId}`);
  const data = await response.json();
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const tickets = await fetchTickets();

  tickets.forEach((ticket) => {
    const ticketElement = createTicketElement(ticket);
    ticketContainer.appendChild(ticketElement);
  });
});

async function fetchTickets() {
  const response = await fetch("https://api.example.com/tickets");
  const data = await response.json();
  return data;
}

function createTicketElement(ticket) {
  const ticketElement = document.createElement("div");
  ticketElement.classList.add("ticket");

  const ticketId = ticket.id;
  ticketElement.innerHTML = `
    <h2>${ticket.subject}</h2>
    <p>${ticket.message}</p>
    <button class="reply-button" data-ticket-id="${ticketId}">Reply</button>
    <div id="reply-form-container-${ticketId}" class="reply-form-container">
      <form id="reply-form-${ticketId}" class="reply-form"></form>
    </div>
  `;

  return ticketElement;
}
