const prompt = require('prompt-sync')();


function shellSort(array) {
    let gaps = [5, 3, 1];
    let temp;
    let i, n;

    for (let gap of gaps) {
        for (i = gap; i < array.length; i++) {
            temp = array[i];
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
                console.log(`Array saat ini: [${array.join(', ')}]`);
                prompt('Tekan Enter untuk memulai pass berikutnya...');
            }
            array[j] = temp;
        }
    }
}

// Contoh penggunaan
let array = [15, 38, 27, 19, 7, 56, 10, 21, 48, 67];
console.log(`Array sebelum pengurutan: [${array.join(', ')}]`);
shellSort(array);
console.log(`Array sebelum pengurutan: [${array.join(', ')}]`);
