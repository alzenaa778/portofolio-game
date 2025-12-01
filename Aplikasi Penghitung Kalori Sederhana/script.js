// Variabel DOM
const limitInput = document.getElementById('limit');
const inputNama = document.getElementById('nama-makanan');
const inputKalori = document.getElementById('jumlah-kalori');
const tombolTambah = document.getElementById('tambah-btn');
const daftarMakanan = document.getElementById('daftar-makanan');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const tombolReset = document.getElementById('reset-btn');

let totalKalori = 0;
let kaloriLimit = 2000;
let items = []; // Menyimpan semua item konsumsi

// ----------------------------------------------------
// A. FUNGSI PERSISTENSI DATA (Local Storage)
// ----------------------------------------------------

function loadData() {
    // Muat batas kalori dari Local Storage, jika ada
    const savedLimit = localStorage.getItem('kaloriLimit');
    if (savedLimit) {
        kaloriLimit = parseInt(savedLimit);
        limitInput.value = kaloriLimit;
    }

    // Muat item konsumsi dari Local Storage
    const savedItems = localStorage.getItem('calorieItems');
    if (savedItems) {
        items = JSON.parse(savedItems);
        items.forEach(item => {
            totalKalori += item.kalori;
            renderItem(item); // Render kembali item yang tersimpan
        });
    }
    updateDisplay();
}

function saveData() {
    localStorage.setItem('kaloriLimit', kaloriLimit);
    localStorage.setItem('calorieItems', JSON.stringify(items));
}


// ----------------------------------------------------
// B. FUNGSI RENDER & VISUALISASI
// ----------------------------------------------------

function renderItem(item) {
    const listItem = document.createElement('li');
    // Menyimpan ID unik untuk fungsi penghapusan
    listItem.setAttribute('data-id', item.id);
    listItem.innerHTML = `
        <span>${item.nama}: ${item.kalori} kcal</span>
        <button onclick="deleteItem('${item.id}')" class="delete-btn">X</button>
    `;
    daftarMakanan.appendChild(listItem);
}

function updateDisplay() {
    progressText.textContent = `${totalKalori} / ${kaloriLimit} kcal`;

    // Hitung persentase progress
    let percentage = (totalKalori / kaloriLimit) * 100;

    // Batasi maksimum 100% untuk tampilan
    if (percentage > 100) {
        progressBarFill.style.width = '100%';
        progressBarFill.style.backgroundColor = '#ff4d4d'; // Beri warna merah jika over
    } else {
        progressBarFill.style.width = `${percentage}%`;
        progressBarFill.style.backgroundColor = '#42a5f5';
    }
}

// ----------------------------------------------------
// C. FUNGSI LOGIKA (EVENT HANDLERS)
// ----------------------------------------------------

function addItem() {
    const nama = inputNama.value.trim();
    const kaloriValue = parseInt(inputKalori.value);

    if (nama === "" || isNaN(kaloriValue) || kaloriValue <= 0) {
        alert("Input tidak valid!");
        return;
    }

    const newItem = {
        id: Date.now().toString(), // ID unik menggunakan timestamp
        nama: nama,
        kalori: kaloriValue
    };

    // Update data dan tampilan
    items.push(newItem);
    totalKalori += newItem.kalori;
    renderItem(newItem);
    updateDisplay();
    saveData();

    // Bersihkan input
    inputNama.value = '';
    inputKalori.value = '';
    inputNama.focus();
}

function deleteItem(id) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        // Kurangi total kalori
        totalKalori -= items[itemIndex].kalori;
        // Hapus dari array items
        items.splice(itemIndex, 1);

        // Hapus dari tampilan DOM
        document.querySelector(`li[data-id="${id}"]`).remove();

        updateDisplay();
        saveData();
    }
}

function resetDay() {
    if (confirm("Apakah Anda yakin ingin mereset semua data kalori hari ini?")) {
        totalKalori = 0;
        items = [];
        daftarMakanan.innerHTML = ''; // Kosongkan tampilan
        localStorage.removeItem('calorieItems'); // Hapus dari Local Storage
        updateDisplay();
    }
}

// ----------------------------------------------------
// D. INISIALISASI
// ----------------------------------------------------

// Event listener untuk tombol tambah
tombolTambah.addEventListener('click', addItem);
// Event listener untuk tombol reset
tombolReset.addEventListener('click', resetDay);

// Event listener untuk update batas kalori
limitInput.addEventListener('change', () => {
    kaloriLimit = parseInt(limitInput.value);
    saveData();
    updateDisplay();
});

// Muat data saat aplikasi pertama kali dijalankan
loadData();