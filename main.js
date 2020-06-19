const $field = $('#field'); // Gets field div

const width = 21
const height = 9
const mines = 20

const generateField = (cols, rows) => { // Creates elements of the field
    $field.empty();
    for (let y = 0; y < rows; y++) { 
        const $row = $('<div>').addClass('row'); // Create the specified amount of rows
        for (let x = 0; x < cols; x++) {
            const $col = $('<div>').addClass('col hidden') // Create the specified amount of columns
            $row.append($col); // Append col to row
        }
        $field.append($row); // Append row to field
    }

    addMines(mines, cols * rows) // Add mines to the field
}

const addMines = (mineCount, cellCount) => {
    if (mineCount > cellCount - 1) mineCount = cellCount - 1; // Ensures there's at least one safe square

    for (let i = 0; i < mineCount; i++) {
        let mineRows = $field.children().toArray(); 
        let $mineRow = $(mineRows[Math.floor(Math.random() * mineRows.length)]); // Find a random row

        let mineCols = $mineRow.children().toArray();
        let $mineCol = $(mineCols[Math.floor(Math.random() * mineCols.length)]); // Find a random cell in that row

        if ($mineCol.hasClass('mine')) { // If it's already a mine, go again
            i--; 
        } else { // If not, make it a mine
            $mineCol.addClass('mine'); 
        }
    }
}

generateField(width, height); // Start the game