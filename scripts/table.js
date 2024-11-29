function createTable(rows, cols) {
    const tableBody = document.getElementById("colorTable").getElementsByTagName("tbody")[0];

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            const randomValue = Math.floor(Math.random() * 5) + 1; // Generate a value from 1 to 5
            if (j === 0) {
                cell.textContent = `USS Ship`;
            }
            else
            {   
                // cell.textContent = randomValue;
                cell.classList.add(`color-${randomValue}`); // Assign a class based on the value 
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

createTable(150, 13); // Create a table with 5 rows and 10 columns