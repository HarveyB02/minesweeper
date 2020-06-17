const $field = $('#field'); // Gets field div

const width = 21
const height = 9

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
}

generateField(width, height); // Start the game