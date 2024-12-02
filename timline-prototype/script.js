
document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector(".line");
    const table = document.querySelector("table tbody");
    const circles = [];
    const monthMap = {
        "Jan-42": 0, "Feb-42": 1, "Mar-42": 2, "Apr-42": 3,
        "May-42": 4, "Jun-42": 5, "Jul-42": 6, "Aug-42": 7,
        "Sep-42": 8, "Oct-42": 9, "Nov-42": 10, "Dec-42": 11
    };

    const newEventButton = document.getElementById('new_event');
    const monthInput = document.getElementById('monthInput');
    const detailsInput = document.getElementById('detailsInput');

    function updateCirclePositions() {
        const tableHeaders = document.querySelectorAll("thead td");
        circles.forEach(({ circle, columnIndex }) => {
            const headerCell = tableHeaders[columnIndex];
            if (headerCell) {
                const cellRect = headerCell.getBoundingClientRect();
                const timelineRect = timeline.getBoundingClientRect();
                const positionInPixels = cellRect.left + cellRect.width / 2 - timelineRect.left;
                circle.style.left = `${positionInPixels}px`;
            }
        });
    }

    newEventButton.addEventListener('click', () => {
        const monthYear = monthInput.value.trim();
        const eventDetails = detailsInput.value.trim();

        if (!monthMap.hasOwnProperty(monthYear)) {
            alert('Please enter a valid month-year (e.g., Nov-42).');
            return;
        }

        if (!eventDetails) {
            alert('Please enter event details.');
            return;
        }

        const columnIndex = monthMap[monthYear];
        const tableHeaders = document.querySelectorAll("thead td");
        const headerCell = tableHeaders[columnIndex];
        if (headerCell) {
            const cellRect = headerCell.getBoundingClientRect();
            const timelineRect = timeline.getBoundingClientRect();
            const positionInPixels = cellRect.left + cellRect.width / 2 - timelineRect.left;

            const newCircle = document.createElement("div");
            newCircle.classList.add("circle");
            newCircle.setAttribute("title", eventDetails);
            newCircle.style.left = `${positionInPixels}px`;
            circles.push({ circle: newCircle, columnIndex });
            timeline.appendChild(newCircle);
        }

        // Update table content
        const rows = table.querySelectorAll("tr");
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
                const newCell = document.createElement("td");
                newRow.appendChild(newCell);
            }
            table.appendChild(newRow);
            targetCell = newRow.children[columnIndex];
        }

        if (targetCell) {
            targetCell.textContent = eventDetails;
        }

        updateCirclePositions();
    });

    window.addEventListener('resize', updateCirclePositions);
});
