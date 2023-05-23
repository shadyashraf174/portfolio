function parseCSVtoMatrix(strCSV) {
    let buff = parseCSVtoArray(strCSV); // Parse CSV string into an array
    return transArryToMat(buff); // Transform the array into a matrix
}

function parseCSVtoArray(strCSV) {
    try {
        let data = []; // Array to store the parsed values
        let regex = /("([^"]|"")*"|([^",\r\n]*))?(,|\r\n)?/; // Regular expression to match CSV elements
        let size = 0; // Variable to store the size of each row
        let check = false; // Variable to check if size has been determined

        // Loop through the CSV string and match elements using regex
        while (regex.test) {
            let buff = regex.exec(strCSV);

            // If the matched element is an empty string, break the loop
            if (buff[0] === "") {
                break;
            }

            let current = buff[1];

            // If the matched element starts with a double quote, remove the quotes
            if (buff[1][0] === '"') {
                current = "";
                for (let i = 1; i < buff[1].length - 1; i++) {
                    current += buff[1][i];
                }
            }

            data[data.length] = current;

            // Check if the row delimiter is encountered and determine the size of each row
            if ((!check) && (buff[4] === '\r\n')) {
                check = true;
                size++;
            } else {
                if (!check) {
                    size++;
                }
            }

            strCSV = strCSV.replace(regex, ""); // Remove the matched element from the CSV string
        }

        data[data.length] = size; // Store the row size at the end of the data array
        return data; // Return the data array containing parsed values and row size
    }
    catch {
        alert("Your test is incorrect"); // Alert an error message if an exception occurs
        return;
    }
}

function transArryToMat(array) {
    let matrix = []; // Matrix to store the transformed data
    let count = 0;

    // Loop through the array and convert it into a matrix
    for (let i = 0; i < (array.length - 1) / array[array.length - 1]; i++) {
        matrix[i] = [];
        for (let j = 0; j < array[array.length - 1]; j++) {
            matrix[i][j] = array[count];
            count++;
        }
    }

    return matrix; // Return the transformed matrix
}