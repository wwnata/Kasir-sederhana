// --- State & Variabel Global ---
let counts = [0, 0, 0];
const prices = [12, 8, 3]; // Harga: Bubur (12k), Bubur Setengah (8k), Sate (3k)
let currentTotal = 0;

// --- Referensi Elemen DOM ---
const totalDisplay = document.getElementById('total-display');
const paymentInput = document.getElementById('payment-input');
const changeArea = document.getElementById('change-area');
const changeLabel = document.getElementById('change-label');
const changeDisplay = document.getElementById('change-display');

// Event Listener untuk Input Pembayaran
// Dipindahkan dari atribut oninput di HTML agar kode lebih bersih
paymentInput.addEventListener('input', calculateChange);

// --- Fungsi-fungsi Logika ---

/**
 * Mengubah jumlah pesanan item
 * @param {number} index - Index item (0: Bubur, 1: Bubur Setengah, 2: Sate)
 * @param {number} delta - Penambahan (1) atau pengurangan (-1)
 */
function updateCount(index, delta) {
    let newValue = counts[index] + delta;
    
    // Batasan jumlah pesanan antara 0 hingga 1000
    if (newValue >= 0 && newValue <= 1000) {
        counts[index] = newValue;
        document.getElementById(`count-${index}`).innerText = counts[index];
        calculateTotal();
    }
}

/**
 * Menghitung ulang total tagihan
 */
function calculateTotal() {
    currentTotal = counts.reduce((sum, count, i) => sum + (count * prices[i]), 0);
    totalDisplay.innerText = currentTotal + 'k';
    
    if (currentTotal === 0) {
        paymentInput.value = '';
        hideChangeArea();
    } else {
        calculateChange();
    }
}

/**
 * Mengisi input pembayaran secara instan menggunakan tombol "Quick Money"
 * @param {number|string} amount - Nominal angka (20, 50, 100) atau string 'PAS'
 */
function setQuickMoney(amount) {
    // Abaikan jika tidak ada pesanan
    if (currentTotal === 0) return;
    
    if (amount === 'PAS') {
        paymentInput.value = currentTotal;
    } else {
        paymentInput.value = amount;
    }
    
    calculateChange();
}

/**
 * Menghitung kembalian berdasarkan total tagihan dan uang yang diinput
 */
function calculateChange() {
    // Filter input: Hanya izinkan karakter angka
    paymentInput.value = paymentInput.value.replace(/[^0-9]/g, '');
    
    let payment = parseInt(paymentInput.value);

    // Sembunyikan area kembalian jika input kosong atau tidak valid atau total 0
    if (isNaN(payment) || paymentInput.value === '' || currentTotal === 0) {
        hideChangeArea();
        return;
    }

    let change = payment - currentTotal;
    
    // Tampilkan area kembalian
    changeArea.classList.remove('hidden');

    // Evaluasi status pembayaran
    if (change < 0) {
        // Uang Kurang
        changeArea.className = 'p-3 rounded-xl border flex flex-col items-center justify-center bg-red-50 border-red-200 text-red-600';
        changeLabel.innerText = 'Uang Kurang';
        changeDisplay.innerText = Math.abs(change) + 'k';
    } else {
        // Uang Pas atau Ada Kembalian
        changeArea.className = 'p-3 rounded-xl border flex flex-col items-center justify-center bg-green-50 border-green-200 text-green-700';
        changeLabel.innerText = 'Kembalian';
        changeDisplay.innerText = change + 'k';
    }
}

/**
 * Menyembunyikan area tampilan kembalian
 */
function hideChangeArea() {
    changeArea.classList.add('hidden');
}

/**
 * Mereset semua input dan hitungan ke 0
 */
function resetAll() {
    // Kembalikan state ke awal
    counts = [0, 0, 0];
    
    // Reset tampilan angka pesanan
    document.getElementById('count-0').innerText = '0';
    document.getElementById('count-1').innerText = '0';
    document.getElementById('count-2').innerText = '0';
    
    // Kosongkan input pembayaran
    paymentInput.value = '';
    
    // Hitung ulang total (yang akan menjadi 0 dan menyembunyikan kembalian)
    calculateTotal();
}

