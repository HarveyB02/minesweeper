const $field = $('#field'); // Gets field div

var width = 16;
var height = 9;
var mines = 20;

var firstClick = true;
var seconds = 0;
var stopwatch = null;
var remaining = null;

const generateField = (cols, rows) => { // Creates elements of the field
    clearInterval(stopwatch);

    firstClick = true; // Used to see if first click is mine
    $field.empty();
    for (let y = 0; y < rows; y++) { 
        const $row = $('<div>').addClass('row'); // Create the specified amount of rows
        for (let x = 0; x < cols; x++) {
            const $col = $('<div>') // Create the specified amount of columns
            .addClass('col hidden')
            .attr('data-row', y) 
            .attr('data-col', x) 
            .attr('onselectstart', 'return false') // Prevents highlighting flag
            $row.append($col); // Append col to row
        }
        $field.append($row); // Append row to field
    }

    addMines(mines, cols * rows) // Add mines to the field

    remaining = $('.col.mine').length - $('.col.flagged').length;
    document.getElementById("time").textContent = `Mines Remaining: ${remaining} Time: 0s`;
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
            $cell.addClass(`count${mineCount}`);
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
    clearInterval(stopwatch);
    let message = null;
    if (win) {
        message = 'Field swept' // If they win, tell them they won
    } else {
        message = 'Failed' // If they lose, tell them they lost
    }

    $('.col.mine').removeClass('hidden');
    
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var $messageBox = $(document.getElementById("messageBox"));

    $messageBox.text(message);
    modal.style.display = 'block';

    span.onclick = function() {
        modal.style.display = "none";
        generateField(width, height);
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            generateField(width, height);
        }
    } 
}

const changeGridSize = () => {
    let tempWidth = document.getElementById('widthInput').value;
    if (isNaN(tempWidth) || tempWidth > 20 || tempWidth < 1) return; // Verify a valid input for width

    let tempHeight = document.getElementById('heightInput').value;
    if (isNaN(tempHeight) || tempHeight > 20 || tempHeight < 1) return; // Same with height

    let tempMines = document.getElementById('mineInput').value;
    if (isNaN(tempMines) || tempMines < 1) return; // And with mines

    width = tempWidth; // After verified replace the default values with input values
    height = tempHeight;
    mines = tempMines;

    generateField(width, height); // Generate again
}

const timer = () => {
    seconds = 0;

    stopwatch = setInterval(function() {
        seconds++;
        document.getElementById("time").textContent = `Mines Remaining: ${remaining} Time: ${seconds}s`;
    }, 1000);
}

generateField(width, height); // Start the game

$field.on('click', '.col.hidden', function() { // When a hidden tile is clicked
    if (firstClick) {
        timer();
    }

    const $cell = $(this);

    if ($cell.hasClass('flagged')) return; // Make flagged cells unclickable

    const row = $cell.data('row');
    const col = $cell.data('col');
    if ($cell.hasClass('mine')) {
        if (firstClick) { // If they get a mine on the first click
            while ($cell.hasClass('mine')) { // Just incase it comes back
                $cell.removeClass('mine'); // Remove it
                addMines(1); // Make a new one
            }
            reveal(col, row); // Reveal the cell
            if ($('.col.hidden').length === $('.col.mine').length) endGame(true); // Check if won
        } else {
            endGame(false); // If it's a mine, lose the game
        }
    } else {
        reveal(col, row); // Otherwise, reveal
        if ($('.col.hidden').length === $('.col.mine').length) endGame(true); // Check if won
    }
    firstClick = false; // No longer first click
})

$field.on('contextmenu', '.col.hidden', function(event) { // When a hidden tile is right clicked
    if(event.preventDefault != undefined) // Prevents context menu from appearing
    event.preventDefault();
    if(event.stopPropagation != undefined)
    event.stopPropagation();

    const $cell = $(this);
    if (!$cell.hasClass('flagged')) { // If it isn't flagged already, flag it
        $cell.addClass('flagged')
        $cell.html("x");
    } else { // Otherwise, remove the flag
        $cell.removeClass('flagged')
        $cell.html("");
    }

    remaining = $('.col.mine').length - $('.col.flagged').length;
    document.getElementById("time").textContent = `Mines Remaining: ${remaining} Time: ${seconds}s`;
});