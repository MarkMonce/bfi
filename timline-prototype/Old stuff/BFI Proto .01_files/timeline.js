
// Array of event data with dates and details
const events = [
    { date: '2024-01-15', details: 'Details about Event 1' },
    { date: '2024-03-10', details: 'Details about Event 2' },
    { date: '2024-06-05', details: 'Details about Event 3' },
    { date: '2024-09-20', details: 'Details about Event 4' },
    { date: '2024-11-25', details: 'Details about Event 5' }
];

const timeline = document.querySelector('.timeline');
const tooltip = document.getElementById('tooltip');

// Clear timeline before adding events
timeline.innerHTML = '';

// Calculate event positions and add them to the timeline
events.forEach((event, index) => {
    const date = new Date(event.date);
    const month = date.getMonth(); // 0 = January, 11 = December
    const left = ((month + 0.5) / 12) * 100; // Mid-point of each month

    // Create the event marker
    const eventElem = document.createElement('div');
    eventElem.classList.add('event');
    eventElem.style.left = `${left}%`;
    eventElem.setAttribute('data-details', event.details);

    // Create the label
    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `Event ${index + 1}`;

    // Stagger labels for better readability
    if (index % 2 === 0) {
        label.style.top = '30px'; // Below the timeline
    } else {
        label.style.top = '45px'; // Further below
    }

    eventElem.appendChild(label);
    timeline.appendChild(eventElem);

    // Add tooltip functionality
    eventElem.addEventListener('mouseover', (e) => {
        tooltip.textContent = event.details;
        const rect = eventElem.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    });

    eventElem.addEventListener('mouseout', () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });
});

