
// document.addEventListener('DOMContentLoaded', () => {
//     const timeline = document.querySelector(".line");
//     const table = document.querySelector("table tbody");
//     const tableHeader = document.getElementById("tableHeader");
//     const circles = [];
//     let monthMap = {};

//     const loadEventsButton = document.getElementById('loadEvents');
//     const newEventButton = document.getElementById('new_event');
//     const startDateInput = document.getElementById('startDateInput');
//     console.log('value of startDateInput', startDateInput);
//     const monthInput = document.getElementById('monthInput');
//     const detailsInput = document.getElementById('detailsInput');

    
//     function generateMonthMap(startDate) {
//         const start = new Date(startDate);
//         const map = {};
//         const headerRow = document.createElement("tr");
//         headerRow.innerHTML = ""; // Clear existing headers
//         for (let i = 0; i < 12; i++) {
//             console.log('value of i', i);
//             const month = new Date(start.getFullYear(), start.getMonth() + i); // Correctly increment months
//             const key = `${month.toLocaleString('default', { month: 'short' })}-${month.getFullYear()}`;
//             map[key] = i; // Correctly increment months
//             const headerCell = document.createElement("td");
//             headerCell.textContent = key;
//             headerRow.appendChild(headerCell);
//         }
//         tableHeader.innerHTML = ""; // Clear any previous headers
//         tableHeader.appendChild(headerRow);
//         return map;
//     }

//     function isWithinTimeline(eventDate, startDate) {
//         const start = new Date(startDate);
//         const event = new Date(eventDate);
//         const differenceInMonths =
//             (event.getFullYear() - start.getFullYear()) * 12 +
//             (event.getMonth() - start.getMonth());
//         return differenceInMonths >= 0 && differenceInMonths < 12;
//     }

//     function clearTimeline() {
//         table.innerHTML = `
//             <tr>
//                 <td></td><td></td><td></td><td></td><td></td><td></td>
//                 <td></td><td></td><td></td><td></td><td></td><td></td>
//             </tr>`;
//         timeline.innerHTML = ""; // Clear all circles
//         circles.length = 0; // Reset circles array
//     }

//     async function loadEvents() {
//         const startDate = startDateInput.value;
//         console.log('value of startDate', startDate);
//         if (!startDate) {
//             alert("Please enter a valid start date.");
//             return;
//         }

//         clearTimeline(); // Clear existing events
//         monthMap = generateMonthMap(startDate); // Regenerate month map based on new start date

//         const response = await fetch("sample_events.json");
//         const events = await response.json();

//         events
//             .filter(event => isWithinTimeline(event["exact date"], startDate))
//             .forEach(event => {
//                 const eventDate = new Date(event["exact date"]);
//                 const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear()}`;
//                 const columnIndex = monthMap[monthKey];
//                 if (columnIndex === undefined) return;

//                 const { details } = event;
//                 let targetCell = null;
//                 const rows = table.querySelectorAll("tr");

//                 for (const row of rows) {
//                     const cell = row.children[columnIndex];
//                     if (!cell.textContent) {
//                         targetCell = cell;
//                         break;
//                     }
//                 }

//                 if (!targetCell) {
//                     const newRow = document.createElement("tr");
//                     for (let i = 0; i < 12; i++) {
//                         const newCell = document.createElement("td");
//                         newRow.appendChild(newCell);
//                     }
//                     table.appendChild(newRow);
//                     targetCell = newRow.children[columnIndex];
//                 }

//                 if (targetCell) {
//                     targetCell.textContent = details;

//                     const cellRect = targetCell.getBoundingClientRect();
//                     const timelineRect = timeline.getBoundingClientRect();
//                     const positionInPixels =
//                         cellRect.left + cellRect.width / 2 - timelineRect.left;

//                     const newCircle = document.createElement("div");
//                     newCircle.classList.add("circle");
//                     newCircle.setAttribute("title", details);
//                     newCircle.style.left = `${positionInPixels}px`;
//                     circles.push({ circle: newCircle, columnIndex });
//                     timeline.appendChild(newCircle);
//                 }
//             });
//     }

//     loadEventsButton.addEventListener("click", loadEvents);
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const timeline = document.querySelector(".line");
//     const table = document.querySelector("table tbody");
//     const tableHeader = document.getElementById("tableHeader");
//     const circles = [];
//     let monthMap = {};

//     const loadEventsButton = document.getElementById('loadEvents');
//     const startDateInput = document.getElementById('startDateInput');

//     function generateMonthMap(firstEventDate) {
//         const start = new Date(firstEventDate);
//         const map = {};
//         const headerRow = document.createElement("tr");
//         headerRow.innerHTML = ""; // Clear existing headers
//         for (let i = 0; i < 12; i++) {
//             const month = new Date(start.getFullYear(), start.getMonth() + i); // Correctly increment months
//             const key = `${month.toLocaleString('default', { month: 'short' })}-${month.getFullYear()}`;
//             map[key] = i;
//             const headerCell = document.createElement("td");
//             headerCell.textContent = key;
//             headerRow.appendChild(headerCell);
//         }
//         tableHeader.innerHTML = ""; // Clear any previous headers
//         tableHeader.appendChild(headerRow);
//         return map;
//     }

//     function isWithinTimeline(eventDate, startDate) {
//         const start = new Date(startDate);
//         const event = new Date(eventDate);
//         const differenceInMonths =
//             (event.getFullYear() - start.getFullYear()) * 12 +
//             (event.getMonth() - start.getMonth());
//         return differenceInMonths >= 0 && differenceInMonths < 12;
//     }

//     function clearTimeline() {
//         table.innerHTML = `
//             <tr>
//                 <td></td><td></td><td></td><td></td><td></td><td></td>
//                 <td></td><td></td><td></td><td></td><td></td><td></td>
//             </tr>`;
//         timeline.innerHTML = ""; // Clear all circles
//         circles.length = 0; // Reset circles array
//     }

//     async function loadEvents() {
//         const startDate = startDateInput.value;
//         if (!startDate) {
//             alert("Please enter a valid start date.");
//             return;
//         }

//         clearTimeline(); // Clear existing events

//         const response = await fetch("sample_events.json");
//         const events = await response.json();

//         const filteredEvents = events.filter(event => isWithinTimeline(event["exact date"], startDate));
//         if (filteredEvents.length === 0) {
//             alert("No events found within the selected date range.");
//             return;
//         }

//         const firstEventDate = filteredEvents[0]["exact date"];
//         monthMap = generateMonthMap(firstEventDate); // Regenerate month map based on first valid event

//         filteredEvents.forEach(event => {
//             const eventDate = new Date(event["exact date"]);
//             const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear()}`;
//             const columnIndex = monthMap[monthKey];
//             if (columnIndex === undefined) return;

//             const { details } = event;
//             let targetCell = null;
//             const rows = table.querySelectorAll("tr");

//             for (const row of rows) {
//                 const cell = row.children[columnIndex];
//                 if (!cell.textContent) {
//                     targetCell = cell;
//                     break;
//                 }
//             }

//             if (!targetCell) {
//                 const newRow = document.createElement("tr");
//                 for (let i = 0; i < 12; i++) {
//                     const newCell = document.createElement("td");
//                     newRow.appendChild(newCell);
//                 }
//                 table.appendChild(newRow);
//                 targetCell = newRow.children[columnIndex];
//             }

//             if (targetCell) {
//                 targetCell.textContent = details;

//                 const cellRect = targetCell.getBoundingClientRect();
//                 const timelineRect = timeline.getBoundingClientRect();
//                 const positionInPixels =
//                     cellRect.left + cellRect.width / 2 - timelineRect.left;

//                 const newCircle = document.createElement("div");
//                 newCircle.classList.add("circle");
//                 newCircle.setAttribute("title", details);
//                 newCircle.style.left = `${positionInPixels}px`;
//                 circles.push({ circle: newCircle, columnIndex });
//                 timeline.appendChild(newCircle);
//             }
//         });
//     }

//     loadEventsButton.addEventListener("click", loadEvents);
// });

document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector(".line");
    const table = document.querySelector("table tbody");
    const tableHeader = document.getElementById("tableHeader");
    const circles = [];
    let monthMap = {};

    const loadEventsButton = document.getElementById('loadEvents');
    const startDateInput = document.getElementById('startDateInput');

    function generateMonthMap(startDate) {
        // Parse and normalize the user-provided start date
        console.log ('value of startDate', startDate);
        const start = new Date(startDate);
        console.log('value of start BEFORE', start);
        start.setDate(1); // Ensure the start date is the first day of the month
    
        const map = {};
        const headerRow = document.createElement("tr");
    
        // Generate 12 months starting from the normalized start date
        for (let i = 0; i < 12; i++) {
            const month = new Date(start.getFullYear(), start.getMonth() + i, 1); // Increment months correctly
            const key = `${month.toLocaleString('default', { month: 'short' })}-${month.getFullYear()}`;
            map[key] = i; // Map month-year string to index
    
            // Add the month-year to the header row
            const headerCell = document.createElement("td");
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
        }
    
        // Update the table header
        tableHeader.innerHTML = ""; // Clear any previous headers
        tableHeader.appendChild(headerRow);
    
        return map; // Return the map of month-year to column index
    }
    
    
    
    
    

    function clearTimeline() {
        table.innerHTML = `
            <tr>
                <td></td><td></td><td></td><td></td><td></td><td></td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>`;
        timeline.innerHTML = ""; // Clear all circles
        circles.length = 0; // Reset circles array
    }

    async function loadEvents() {
        const startDate = startDateInput.value;
        if (!startDate) {
            alert("Please enter a valid start date.");
            return;
        }

        clearTimeline(); // Clear existing events
        monthMap = generateMonthMap(startDate); // Regenerate month map based on user input

        let events = [];
        try {
            const response = await fetch("sample_events.json");
            events = await response.json();
        } catch (error) {
            console.warn("Could not load events from JSON file. Proceeding with empty timeline.");
        }

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event["exact date"]);
            const start = new Date(startDate);
            return (
                eventDate >= start &&
                eventDate < new Date(start.getFullYear(), start.getMonth() + 12)
            );
        });

        filteredEvents.forEach(event => {
            const eventDate = new Date(event["exact date"]);
            const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear()}`;
            const columnIndex = monthMap[monthKey];
            if (columnIndex === undefined) return;

            const { details } = event;
            let targetCell = null;
            const rows = table.querySelectorAll("tr");

            for (const row of rows) {
                const cell = row.children[columnIndex];
                if (!cell.textContent) {
                    targetCell = cell;
                    break;
                }
            }

            if (!targetCell) {
                const newRow = document.createElement("tr");
                for (let i = 0; i < 12; i++) {
                    const newCell = document.createElement("td");
                    newRow.appendChild(newCell);
                }
                table.appendChild(newRow);
                targetCell = newRow.children[columnIndex];
            }

            if (targetCell) {
                targetCell.textContent = details;

                const cellRect = targetCell.getBoundingClientRect();
                const timelineRect = timeline.getBoundingClientRect();
                const positionInPixels =
                    cellRect.left + cellRect.width / 2 - timelineRect.left;

                const newCircle = document.createElement("div");
                newCircle.classList.add("circle");
                newCircle.setAttribute("title", details);
                newCircle.style.left = `${positionInPixels}px`;
                circles.push({ circle: newCircle, columnIndex });
                timeline.appendChild(newCircle);
            }
        });

        // Ensure timeline is drawn even if no events are present
        if (filteredEvents.length === 0) {
            console.log("No events found within the selected date range. Timeline is empty.");
        }
    }

    loadEventsButton.addEventListener("click", loadEvents);
});

