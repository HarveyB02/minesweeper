const $field = $('#field'); // Gets field div

var width = 16
var height = 9
var mines = 20

const generateField = (cols, rows) => { // Creates elements of the field
    $field.empty();
    for (let y = 0; y < rows; y++) { 
        const $row = $('<div>').addClass('row'); // Create the specified amount of rows
        for (let x = 0; x < cols; x++) {
            const $col = $('<div>') // Create the specified amount of columns
            .addClass('col hidden')
            .attr('data-row', y) 
            .attr('data-col', x) 
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

const getMineCount = (x, y) => {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) { // For all cells around the cell
        for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= height || nx >= width || ny < 0 || nx < 0) continue;
            const $cell = 
                $(`.col.hidden[data-row=${ny}][data-col=${nx}]`)
            if ($cell.hasClass('mine')) count++; // If mine, add to count
        }
    }
    return count;
}

const reveal = (origX, origY) => {
    const seen = {};

    const helper = (x, y) => {
        if (y >= height || x>= width || y < 0 || x < 0) return; // Return if outside bounds
        const key = `${y} ${x}`
        if (seen[key]) return;
        const $cell = 
            $(`.col.hidden[data-row=${y}][data-col=${x}]`)
        const mineCount = getMineCount(x, y); // Count mines around cell
        if (!$cell.hasClass('hidden') || $cell.hasClass('mine')) return; // Ignore mines and revealed cells

        $cell.removeClass('hidden');

        if (mineCount) {
            $cell.text(mineCount);
            return;
        }

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                helper(x + dx, y + dy) // Perform on cells nearby
            }
        }
    }

    helper(origX, origY);
}

const endGame = (win) => { // When the game ends
    let message = null;
    if (win) {
        message = 'Field swept' // If they win, tell them they won
    } else {
        message = 'Exploded' // If they lose, tell them they lost
    }
    $('.col.mine').removeClass('hidden');
    setTimeout(function() {
        alert(message);
        generateField(width, height); // Restart the game
    })
}

generateField(width, height); // Start the game

$field.on('click', '.col.hidden', function() { // When a hidden tile is clicked
    const $cell = $(this);
    const row = $cell.data('row');
    const col = $cell.data('col');
    if ($cell.hasClass('mine')) {
        endGame(false); // If it's a mine, lose the game
    } else {
        reveal(col, row) // Otherwise, reveal
        if ($('.col.hidden').length === $('.col.mine').length) endGame(true); // Check if won
    }
})