let currentStartDate = "Nov-41";
const earliestDate = "Nov-41";
const latestDate = "Jan-46";

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching JSON:", error);
        return [];
    }
}

function adjustDate(startDate, months) {
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let [month, year] = startDate.split("-");
    let monthIndex = monthsArray.indexOf(month);
    year = parseInt(year, 10);

    monthIndex += months;
    while (monthIndex < 0) {
        monthIndex += 12;
        year -= 1;
    }
    while (monthIndex >= 12) {
        monthIndex -= 12;
        year += 1;
    }

    const newDate = `${monthsArray[monthIndex]}-${year}`;
    return restrictDateRange(newDate);
}

function restrictDateRange(date) {
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [month, year] = date.split("-");
    const monthIndex = monthsArray.indexOf(month);

    const [earliestMonth, earliestYear] = earliestDate.split("-");
    const [latestMonth, latestYear] = latestDate.split("-");
    const earliestMonthIndex = monthsArray.indexOf(earliestMonth);
    const latestMonthIndex = monthsArray.indexOf(latestMonth);

    if (year < parseInt(earliestYear) || (year === earliestYear && monthIndex < earliestMonthIndex)) {
        return earliestDate;
    }
    if (year > parseInt(latestYear) || (year === latestYear && monthIndex > latestMonthIndex)) {
        return latestDate;
    }
    return date;
}

function updateDateRange(startDate) {
    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [startMonth, startYear] = startDate.split("-");
    const endDate = adjustDate(startDate, 11);
    const [endMonth, endYear] = endDate.split("-");

    document.getElementById("date-range").textContent = `${startMonth}-${startYear} to ${endMonth}-${endYear}`;
}

function createGenericTimeline(events, startDate) {
    const container = document.getElementById("generic-timeline");
    container.innerHTML = ""; // Clear previous table

    const table = document.createElement("table");
    table.border = "1";

    const headerRow = document.createElement("tr");
    const bodyRows = {};

    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let [startMonth, startYear] = startDate.split("-");
    let startMonthIndex = monthsArray.indexOf(startMonth);
    startYear = parseInt(startYear);

    // Create headers for all months
    for (let i = 0; i < 12; i++) {
        const monthYear = `${monthsArray[startMonthIndex]}-${startYear}`;
        const th = document.createElement("th");
        th.textContent = monthYear;
        headerRow.appendChild(th);

        bodyRows[monthYear] = []; // Initialize rows for each month
        startMonthIndex = (startMonthIndex + 1) % 12;
        if (startMonthIndex === 0) startYear += 1;
    }

    table.appendChild(headerRow);

    // Group events by month-year
    const groupedEvents = events.reduce((acc, event) => {
        const eventDate = new Date(event.date);
        const eventMonthYear = `${monthsArray[eventDate.getMonth()]}-${eventDate.getFullYear()}`;
        if (!acc[eventMonthYear]) acc[eventMonthYear] = [];
        acc[eventMonthYear].push(event);
        return acc;
    }, {});

    // Fill the body rows with circles and tooltips
    Object.keys(bodyRows).forEach(monthYear => {
        const row = document.createElement("tr");
        const eventsForMonth = groupedEvents[monthYear] || [];

        for (let i = 0; i < 12; i++) {
            const td = document.createElement("td");

            if (eventsForMonth.length > 0) {
                eventsForMonth.forEach(event => {
                    const circle = document.createElement("div");
                    circle.style.width = "10px";
                    circle.style.height = "10px";
                    circle.style.borderRadius = "50%";
                    circle.style.backgroundColor = "green";
                    circle.style.margin = "5px auto";
                    circle.title = event.details;

                    td.appendChild(circle);
                });
            }

            td.style.verticalAlign = "middle";
            row.appendChild(td);
        }

        table.appendChild(row);
    });

    container.appendChild(table);
}

function createWarshipTimeline(warships, startDate) {
    const container = document.getElementById("warship-timeline");
    container.innerHTML = ""; // Clear previous table

    const table = document.createElement("table");
    table.border = "1";

    const headerRow = document.createElement("tr");
    const staticHeaders = ["ID", "Name"];
    staticHeaders.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });

    const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let [startMonth, startYear] = startDate.split("-");
    let startMonthIndex = monthsArray.indexOf(startMonth);
    startYear = parseInt(startYear);

    for (let i = 0; i < 12; i++) {
        const th = document.createElement("th");
        th.textContent = `${monthsArray[startMonthIndex]}-${startYear}`;
        headerRow.appendChild(th);

        startMonthIndex = (startMonthIndex + 1) % 12;
        if (startMonthIndex === 0) startYear += 1;
    }

    table.appendChild(headerRow);

    warships.forEach(warship => {
        const row = document.createElement("tr");

        ["ID", "Name"].forEach(key => {
            const td = document.createElement("td");
            td.textContent = warship[key];
            row.appendChild(td);
        });

        let [startMonth, startYear] = startDate.split("-");
        let startMonthIndex = monthsArray.indexOf(startMonth);
        startYear = parseInt(startYear);

        for (let i = 0; i < 12; i++) {
            const monthYear = `${monthsArray[startMonthIndex]}-${startYear}`;
            const status = warship.MonthlyStatus[monthYear];
            const td = document.createElement("td");

            if (status) {
                td.className = `color-${status.code}`;
                td.title = status.details;
            }

            row.appendChild(td);

            startMonthIndex = (startMonthIndex + 1) % 12;
            if (startMonthIndex === 0) startYear += 1;
        }

        table.appendChild(row);
    });

    container.appendChild(table);
}

async function renderTables() {
    const events = await fetchJSON("./data/events.json");
    const warships = await fetchJSON("./data/warships.json");

    createGenericTimeline(events, currentStartDate);
    createWarshipTimeline(warships, currentStartDate);
    updateDateRange(currentStartDate);
}

document.addEventListener("DOMContentLoaded", () => {
    renderTables();

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, -1);
        renderTables();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, 1);
        renderTables();
    });

    document.getElementById("prevYear").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, -12);
        renderTables();
    });

    document.getElementById("nextYear").addEventListener("click", () => {
        currentStartDate = adjustDate(currentStartDate, 12);
        renderTables();
    });
});
