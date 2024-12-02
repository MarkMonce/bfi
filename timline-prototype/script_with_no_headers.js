document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector(".line");
    const table = document.querySelector("table tbody");
    const loadEventsButton = document.getElementById('loadEvents');
    const startDateInput = document.getElementById('startDateInput');

    function parseStartDate(input) {
        // Parse input in the format "Jan-42"
        const [shortMonth, shortYear] = input.split("-");
        const year = parseInt(shortYear, 10) + 1900; // Convert 2-digit year to 4-digit year
        const monthIndex = new Date(`${shortMonth} 1, 2000`).getMonth(); // Get month index
        return new Date(year, monthIndex, 1); // Return normalized date
    }

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

    function clearTimeline() {
        table.innerHTML = `
            <tr>
                <td></td><td></td><td></td><td></td><td></td><td></td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>`;
        timeline.innerHTML = ""; // Clear all circles
    }

    async function loadEvents() {
        const startDate = startDateInput.value;
        if (!startDate) {
            alert("Please enter a valid start month and year (e.g., Jan-42).");
            return;
        }

        clearTimeline(); // Clear existing events
        const monthMap = generateMonthMap(startDate); // Regenerate month map based on user input

        let events = [];
        try {
            const response = await fetch("sample_events.json");
            events = await response.json();
        } catch (error) {
            console.warn("Could not load events from JSON file. Proceeding with empty timeline.");
        }

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event["exact date"]);
            const start = parseStartDate(startDate);
            return (
                eventDate >= start &&
                eventDate < new Date(start.getFullYear(), start.getMonth() + 12)
            );
        });

        filteredEvents.forEach(event => {
            const eventDate = new Date(event["exact date"]);
            const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear().toString().slice(-2)}`;
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
                timeline.appendChild(newCircle);
            }
        });

        if (filteredEvents.length === 0) {
            console.log("No events found within the selected date range. Timeline is empty.");
        }
    }

    loadEventsButton.addEventListener("click", loadEvents);
});
