document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_START_DATE = "Jan-42"; // Default start date for the timeline

    const container = document.getElementById('timelineContainer');
    if (!container) {
        console.error("No container with id 'timelineContainer' found!");
        return;
    }

    let timeline, tableBody, events = []; // Store events globally

    // Dynamically create the timeline structure
    function createTimelineStructure() {
        // Clear the container to avoid duplicates
        container.innerHTML = "";

        // Create the timeline line
        timeline = document.createElement("div");
        timeline.classList.add("line");
        container.appendChild(timeline);

        // Create the event table
        const tableElement = document.createElement("table");
        tableBody = document.createElement("tbody");
        tableBody.innerHTML = `
            <tr>
                ${'<td></td>'.repeat(12)} <!-- Initial empty row -->
            </tr>`;
        tableElement.appendChild(tableBody);
        container.appendChild(tableElement);
    }

    // Function to parse the start date
    function parseStartDate(input) {
        const [shortMonth, shortYear] = input.split("-");
        const year = parseInt(shortYear, 10) + 1900;
        const monthIndex = new Date(`${shortMonth} 1, 2000`).getMonth();
        return new Date(year, monthIndex, 1);
    }

    // Function to generate a month map
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

    // Function to clear table contents
    function clearTable() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            Array.from(row.children).forEach(cell => {
                cell.textContent = ""; // Clear cell contents
            });
        });
    }

    // Function to render circles based on filtered events
    function renderCircles(events, monthMap) {
        timeline.innerHTML = ""; // Clear existing circles
        clearTable(); // Clear table contents to prevent duplication

        events.forEach(event => {
            const eventDate = new Date(event["exact date"]);
            const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear().toString().slice(-2)}`;
            const columnIndex = monthMap[monthKey];
            if (columnIndex === undefined) return;

            const { details } = event;
            const rows = tableBody.querySelectorAll("tr");
            let targetCell = null;

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
                    newRow.appendChild(document.createElement("td"));
                }
                tableBody.appendChild(newRow);
                targetCell = newRow.children[columnIndex];
            }

            if (targetCell) {
                targetCell.textContent = details;

                const cellRect = targetCell.getBoundingClientRect();
                const timelineRect = timeline.getBoundingClientRect();
                const positionInPixels = cellRect.left + cellRect.width / 2 - timelineRect.left;

                const newCircle = document.createElement("div");
                newCircle.classList.add("circle");
                newCircle.setAttribute("title", details);
                newCircle.style.left = `${positionInPixels}px`;
                timeline.appendChild(newCircle);
            }
        });
    }

    // Function to load events
    async function loadEvents(startDate = DEFAULT_START_DATE) {
        createTimelineStructure(); // Recreate the timeline structure

        const monthMap = generateMonthMap(startDate);

        try {
            const response = await fetch("sample_events.json");
            events = await response.json(); // Store fetched events globally
        } catch (error) {
            console.warn("Could not load events. Proceeding with an empty timeline.");
        }

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event["exact date"]);
            const start = parseStartDate(startDate);
            return (
                eventDate >= start &&
                eventDate < new Date(start.getFullYear(), start.getMonth() + 12)
            );
        });

        renderCircles(filteredEvents, monthMap);
    }

    // Recalculate positions on window resize
    window.addEventListener('resize', () => {
        const monthMap = generateMonthMap(DEFAULT_START_DATE);
        renderCircles(events, monthMap); // Use stored events
    });

    // Automatically load events with the default start date
    loadEvents(DEFAULT_START_DATE);
});
