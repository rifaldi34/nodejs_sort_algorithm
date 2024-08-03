const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function bubbleSort(array) {
    let i = array.length - 1;

    function step() {
        if (i <= 0) {
            console.log('Pengurutan selesai');
            rl.close();
            return;
        }

        let n = 0;
        function innerStep() {
            if (n >= i) {
                i--;
                console.log(`Akhir dari pass, i sekarang ${i}`);
                rl.question('Tekan Enter untuk memulai pass berikutnya...', step);
                return;
            }

            console.log(`Membandingkan indeks ${n} dan ${n + 1}: ${array[n]} > ${array[n + 1]}`);
            if (array[n] > array[n + 1]) {
                swapKeys(array, n, n + 1);
                console.log(`Menukar indeks ${n} dan ${n + 1}`);
            }
            console.log(`Array saat ini: [${array.join(', ')}]`);
            console.log(`i: ${i}, n: ${n}`);

            n++;
            rl.question('Tekan Enter untuk melanjutkan perbandingan berikutnya...', innerStep);
        }
        innerStep();
    }
    
    step();
}

function swapKeys(array, i, n) {
    [array[i], array[n]] = [array[n], array[i]];
}

// Contoh penggunaan:
const arrayToSort = [17, 54, 15, 11, 10,3, 30, 67, 1, 43];
console.log(`Array awal: [${arrayToSort.join(', ')}]`);
bubbleSort(arrayToSort);
