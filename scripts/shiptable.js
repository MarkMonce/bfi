let currentStartDate = "Nov-41"; // Initial start date for the display
const earliestDate = "Nov-41";
const latestDate = "Jan-46";
// Create a tooltip element
let tooltip;
//This function is not currently in use, but is provided for potential future use. The td.title = details; above already provides a tool tip using td.title = details; as seen in the function createWarshipTable
function showTooltip(details, cell) {
    // Create tooltip if it doesn't exist
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.style.position = "absolute";
        tooltip.style.backgroundColor = "#333";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.fontSize = "12px";
        tooltip.style.zIndex = "1000";
        tooltip.style.whiteSpace = "nowrap";
        document.body.appendChild(tooltip);
    }

    tooltip.textContent = details;

    // Position the tooltip near the cell
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;

    // Show the tooltip
    tooltip.style.display = "block";
}
//This function is not currently in use, but is provided for potential future use. The td.title = details; above already provides a tool tip using td.title = details; as seen in the function createWarshipTable
function hideTooltip() {
    if (tooltip) {
        tooltip.style.display = "none";
    }
}

// Function to ensure date stays within allowed range
function restrictDateRange(date) {
    const [month, year] = date.split("-");
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = monthsArray.indexOf(month);

    const earliestYear = parseInt(earliestDate.split("-")[1]);
    const earliestMonthIndex = monthsArray.indexOf(earliestDate.split("-")[0]);

    const latestYear = parseInt(latestDate.split("-")[1]);
    const latestMonthIndex = monthsArray.indexOf(latestDate.split("-")[0]);

    const currentYear = parseInt(year);

    if (currentYear < earliestYear || (currentYear === earliestYear && monthIndex < earliestMonthIndex)) {
        return earliestDate;
    }
    if (currentYear > latestYear || (currentYear === latestYear && monthIndex > latestMonthIndex)) {
        return latestDate;
    }
    return date;
}

// Function to update the displayed date range
function updateDateRange(startDate) {
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [startMonth, startYear] = startDate.split("-");
    const startMonthIndex = monthsArray.indexOf(startMonth);
    const fullStartYear = parseInt(startYear, 10) < 100 ? 1900 + parseInt(startYear, 10) : parseInt(startYear, 10);

    const endDate = adjustDate(startDate, 11); // Add 11 months to get the last month in the range
    const [endMonth, endYear] = endDate.split("-");
    const fullEndYear = parseInt(endYear, 10) < 100 ? 1900 + parseInt(endYear, 10) : parseInt(endYear, 10);

    const dateRangeElement = document.getElementById("date-range");
    dateRangeElement.textContent = `${startMonth}-${fullStartYear} to ${endMonth}-${fullEndYear}`;
}


function adjustDate(startDate, months) {
    const [month, year] = startDate.split("-");
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentMonthIndex = monthsArray.indexOf(month);
    let currentYear = parseInt(year, 10);

    // Restrictions based on specific start dates
    if (startDate === "Feb-45" && months > 0) {
        // If current date is Feb-45 and advancing (next month or next year)
        return startDate;
    }
    if (startDate === "Nov-41" && months < 0) {
        // If current date is Nov-41 and retreating (previous month or previous year)
        return startDate;
    }

    // Adjust the date normally
    currentMonthIndex += months;
    while (currentMonthIndex < 0) {
        currentMonthIndex += 12;
        currentYear -= 1;
    }
    while (currentMonthIndex >= 12) {
        currentMonthIndex -= 12;
        currentYear += 1;
    }

    const newDate = `${monthsArray[currentMonthIndex]}-${currentYear}`;
    return restrictDateRange(newDate); // Ensure the date still respects overall range restrictions
}




function createWarshipTable(data, startDate) {
    const container = document.getElementById("table-container");
    container.innerHTML = ""; // Clear previous table

    // Update the displayed date range
    updateDateRange(startDate);

    // Generate headers dynamically for all months in range
    const [startMonth, startYear] = startDate.split("-");
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let startMonthIndex = monthsArray.indexOf(startMonth);
    let currentYear = parseInt(startYear, 10);
    const headers = [];

    for (let i = 0; i < 12; i++) {
        headers.push(`${monthsArray[startMonthIndex]}-${currentYear}`);
        startMonthIndex += 1;
        if (startMonthIndex >= 12) {
            startMonthIndex = 0;
            currentYear += 1;
        }
    }



    // ##############################################################################################
    // Define column widths and row heights
    const idColumnWidth = "50px"; // Width for the "ID" column
    const nameColumnWidth = "100px"; // Width for the "Name" column
    const dynamicColumnWidth = "40px"; // Width for the remaining dynamic columns
    const rowHeight = "4px"; // Adjustable row height
    const headerRowHeight = "10px"; // Adjustable header row height
    const rowPadding = "0px"; // Padding for all cells
    // ##############################################################################################



    // Create table
    const table = document.createElement("table");
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%"; // Optional: Make the table responsive

    // Create header row
    const headerRow = document.createElement("tr");
    const staticHeaders = ["ID", "Name"];
    staticHeaders.forEach((header, index) => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.padding = rowPadding;
        th.style.height = headerRowHeight; // Set height for header row

        // Apply specific widths to static headers
        if (index === 0) th.style.width = idColumnWidth;
        if (index === 1) th.style.width = nameColumnWidth;

        headerRow.appendChild(th);
    });

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.padding = rowPadding;  // Padding for all cells
        th.style.width = dynamicColumnWidth; // Apply width for dynamic columns
        th.style.height = rowHeight; // Set height for header row
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Populate rows
    data.forEach(warship => {
        const row = document.createElement("tr");

        // Static fields
        ["ID", "Name"].forEach((key, index) => {
            const td = document.createElement("td");
            td.textContent = warship[key];
            td.style.padding = rowPadding;
            td.style.textAlign = "left";
            td.style.height = rowHeight; // Set height for data rows

            // Apply specific widths to static columns
            if (index === 0) td.style.width = idColumnWidth;
            if (index === 1) td.style.width = nameColumnWidth;

            row.appendChild(td);
        });

        // Dynamic fields for the 12-month period
        headers.forEach(header => {
            const status = warship.MonthlyStatus[header];
            const td = document.createElement("td");

            if (status) {
                const code = status.code;
                const details = status.details || ""; // Default to empty string if details is not provided
                td.className = `color-${code}`; // Assign the CSS class based on the status code
                td.title = details; // Use the title attribute for tooltip
            } else {
                td.style.backgroundColor = "white"; // Blank white cell for missing data
                td.textContent = ""; // Ensure empty cell content
            }

            td.style.padding = "5px";
            td.style.width = dynamicColumnWidth; // Apply width for dynamic columns
            td.style.height = rowHeight; // Set height for data rows
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    container.appendChild(table);
}




// Function to fetch the JSON data from a file
function fetchWarshipData(startDate) {
    fetch("/scripts/shiptable.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            createWarshipTable(data, startDate);
        })
        .catch(error => {
            console.error("Error loading JSON data:", error);
            const container = document.getElementById("table-container");
            container.textContent = "Failed to load warship data.";
        });
}

function fetchEventsData(startDate) {
   console.log(startDate);
}


document.addEventListener("DOMContentLoaded", () => {
    fetchWarshipData(currentStartDate);
    fetchEventsData(currentStartDate);

    // Button event handlers
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, -1);
        fetchWarshipData(currentStartDate);
        fetchEventsData(currentStartDate);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, 1);
        fetchWarshipData(currentStartDate);
        fetchEventsData(currentStartDate);
    });

    document.getElementById("prevYear").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, -12);
        fetchWarshipData(currentStartDate);
        fetchEventsData(currentStartDate);
    });

    document.getElementById("nextYear").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, 12);
        fetchWarshipData(currentStartDate);
        fetchEventsData(currentStartDate);
    });
});

