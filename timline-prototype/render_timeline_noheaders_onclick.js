document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector(".line"); // Get the timeline element
    const table = document.querySelector("table tbody"); // Get the table element
    const loadEventsButton = document.getElementById('loadEvents'); // Get the load events button
    const startDateInput = document.getElementById('startDateInput');   // Get the start date input field
    // Function to parse the start date input
    function parseStartDate(input) {
        // Parse input in the format "Jan-42"
        const [shortMonth, shortYear] = input.split("-");
        const year = parseInt(shortYear, 10) + 1900; // Convert 2-digit year to 4-digit year
        const monthIndex = new Date(`${shortMonth} 1, 2000`).getMonth(); // Get month index
        return new Date(year, monthIndex, 1); // Return normalized date
    }


    // Function to generate a month map based on the start date
    function generateMonthMap(startDate) {
        const start = parseStartDate(startDate);
        const map = {};

        for (let i = 0; i < 12; i++) {
            const month = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const key = `${month.toLocaleString('default', { month: 'short' })}-${month.getFullYear().toString().slice(-2)}`;
            map[key] = i;
        }

        return map;
    }

    
    //  Function to clear the timeline
    function clearTimeline() {
        table.innerHTML = `
            <tr>
                <td></td><td></td><td></td><td></td><td></td><td></td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>`;
        timeline.innerHTML = ""; // Clear all circles
    }

    // Function to load events
    async function loadEvents() {
        // Gets the start date from the input field
        const startDate = startDateInput.value;
        if (!startDate) {
            alert("Please enter a valid start month and year (e.g., Jan-42).");
            return;
        }


        // Clear existing events and generate a new month map
        clearTimeline(); // Clear existing events
        const monthMap = generateMonthMap(startDate); // Regenerate month map based on user input

        let events = [];
        try {
            const response = await fetch("sample_events.json");
            events = await response.json();
        } catch (error) {
            console.warn("Could not load events from JSON file. Proceeding with empty timeline.");
        }



        // Filter events based on the selected date range
        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event["exact date"]);
            const start = parseStartDate(startDate);
            return (
                eventDate >= start &&
                eventDate < new Date(start.getFullYear(), start.getMonth() + 12)
            );
        });



        // Render events on the timeline
        filteredEvents.forEach(event => {
            const eventDate = new Date(event["exact date"]); //  Get the exact date of the event
            const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear().toString().slice(-2)}`; // Get the month key
            const columnIndex = monthMap[monthKey]; // Get the column index based on the month key
            if (columnIndex === undefined) return;

            const { details } = event; //  Get the event details from the record in the JSON file
            let targetCell = null; // Initialize the target cell


            const rows = table.querySelectorAll("tr");  // Get all rows in the table
            // Find the first empty cell in the column
            for (const row of rows) {
                const cell = row.children[columnIndex];
                if (!cell.textContent) {
                    targetCell = cell;
                    break;
                }
            }
            // If no empty cell is found, create a new row
            if (!targetCell) {
                const newRow = document.createElement("tr");
                for (let i = 0; i < 12; i++) {
                    const newCell = document.createElement("td");
                    newRow.appendChild(newCell);
                }
                table.appendChild(newRow);// Append the new row to the table
                targetCell = newRow.children[columnIndex]; // Set the target cell to the first cell in the new row
            }
            // Add event details to the cell and creaat a circle on the timeline
            if (targetCell) {
                targetCell.textContent = details;

                const cellRect = targetCell.getBoundingClientRect();
                const timelineRect = timeline.getBoundingClientRect();
                const positionInPixels =
                    cellRect.left + cellRect.width / 2 - timelineRect.left;

                const newCircle = document.createElement("div"); // Create a new circle as a div element
                newCircle.classList.add("circle"); // Add the "circle" class to the new circle for css styling
                newCircle.setAttribute("title", details); // Set the title attribute to the event details
                newCircle.style.left = `${positionInPixels}px`; // Set the left position of the circle
                timeline.appendChild(newCircle);
            }
        });

        if (filteredEvents.length === 0) {
            console.log("No events found within the selected date range. Timeline is empty.");
        }
    }

    loadEventsButton.addEventListener("click", loadEvents);
});
