const prompt = require('prompt-sync')();

function bubbleSort(array) {
    let n = array.length - 1;
    while (n > 0) {
        let i = 0;
        while (i < n) {
            if (array[i] > array[i + 1]) {
                swapKeys(array, i, i + 1);
            }
            i++;
            console.log(`Array saat ini: [${array.join(', ')}]`);
            prompt('Tekan Enter untuk memulai pass berikutnya...');
        }
        n--;
    }
}

function swapKeys(array, a, b) {
    [array[a], array[b]] = [array[b], array[a]];
}

// Example usage:
const array = [17, 54, 15, 11, 10, 3, 30, 67, 1, 43];
console.log(`Array sebelum pengurutan: [${array.join(', ')}]`);
bubbleSort(array);
console.log(`Array setelah pengurutan: [${array.join(', ')}]`);
