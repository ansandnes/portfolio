// Function to dynamically render the portfolio from a data object
function renderPortfolio(data) {
    // Get the HTML elements where content will be injected
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');

    // --- Render Header Section ---
    const headerContent = `
    <h1>${data.title}</h1>
    <p>${data.subtitle}</p>
  `;
    header.innerHTML = headerContent;

    // --- Render Main Content ---

    // Create and append the professional summary section
    const summarySection = document.createElement('section');
    summarySection.classList.add('professional-summary');
    summarySection.innerHTML = `
    <h2>Professional Summary</h2>
    <div class="card">
      <p>${data.professional_summary}</p>
    </div>
  `;
    main.appendChild(summarySection);

    // Create and append the projects section
    const projectsSection = document.createElement('section');
    projectsSection.classList.add('projects');
    projectsSection.innerHTML = `
    <h2>Projects - I'm currently working on my portfolio :)</h2>
    ${data.projects.map(project => `
      <div class="project">
        <h3 class="project-title">${project.title}</h3>
        <p>${project.description}</p>
      </div>
    `).join('')}
  `;
    main.appendChild(projectsSection);

    // --- Render Footer Section ---
    const footerContent = `
        <div class="footer">
            <h2>Contact</h2>
            <div class="contact-info">
                <div>Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></div>
                <div>LinkedIn: <a href="${data.contact.links.linkedin}" target="_blank">Connect</a></div>
                <div>GitHub: <a href="${data.contact.links.github}" target="_blank">Profile</a></div>
            </div>
        </div>
    `;
    footer.innerHTML = footerContent;
}

// --- Fetch Data and Run Application ---
// This is the entry point of your script
fetch('../../data/data.json')
    .then(response => {
        // Check if the network request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Once the data is successfully fetched, render the portfolio
        renderPortfolio(data);
    })
    .catch(error => {
        // Log any errors that occur during the fetch operation
        console.error('Could not fetch the portfolio data:', error);
    });