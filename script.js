/* ==========================================
   PORTAL RASMI BOLA JARING MSSM
   script.js (Versi Penuh, Stabil & Dinamik 3 Kategori)
========================================== */

console.log("Website MSSM Netball berjaya dibuka");

// ==========================================
// PENGURUSAN SUMBER DATA GOOGLE SHEET (3 KATEGORI)
// ==========================================
const DATA_SOURCES = {
    B12: {
        isPublishedVersion: false,
        base: "https://docs.google.com/spreadsheets/d/1ItWWq1j0D2nO6zxQzgv24nQuzhKqyXEe3_Eu4wIHAg0",
        gidJadual: "552404826",
        gidStanding: "626141204",
        gidUndianP2: "1119239277"
    },
    B15: {
        isPublishedVersion: false,
        base: "https://docs.google.com/spreadsheets/d/1Oc_BowwyXJF8-AubPLmSompXQ5YUDp23LWesuOmQEMw",
        gidJadual: "0",
        gidStanding: "580416185",
        gidUndianP2: "1119239277"
    },
    B18: {
        isPublishedVersion: true,
        base: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwsp6AKtDRnzX9xoQnXjVrYEE8uHO8mGZh9gMJzudmW7gQghV6G2k2IdkNEABf_Et5H65ZGbBdPkPm",
        gidJadual: "0",
        gidStanding: "0"
    }
};

// Fungsi automatik untuk mengesan kategori halaman semasa melalui HTML meta tag
function dapatkanKategoriSemasa() {
    const el = document.querySelector('meta[name="category-type"]');
    return el ? el.getAttribute('content') : 'B12'; 
}

const KATEGORI_AKTIF = dapatkanKategoriSemasa();
const SHEET_SEKARANG = DATA_SOURCES[KATEGORI_AKTIF] || DATA_SOURCES.B12;

// ==========================================
// BINA URL GVIZ SECARA DITAPIS
// ==========================================
let kumpulanURL, jadualURL, resultURL, standingURL, undianP2URL;

if (SHEET_SEKARANG.isPublishedVersion) {
    // Cara bina URL untuk format Published Web Link (B18)
    kumpulanURL = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidStanding}`;
    jadualURL   = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidJadual}`;
    resultURL   = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&sheet=RESULT`;
    standingURL = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidStanding}`;
    undianP2URL = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidUndianP2 || '0'}`;
} else {
    // Cara bina URL asal untuk format B12 & B15
    kumpulanURL = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&sheet=KUMPULAN`;
    jadualURL   = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidJadual}`;
    resultURL   = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&sheet=RESULT`;
    standingURL = `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidStanding}`;
    undianP2URL = SHEET_SEKARANG.gidUndianP2 
        ? `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&gid=${SHEET_SEKARANG.gidUndianP2}` 
        : `${SHEET_SEKARANG.base}/gviz/tq?tqx=out:json&sheet=UNDIAN P2`;
}

let currentIndex = 0;
let galleryImages = [];

// ==========================================
// 1. FUNGSI UTAMA GALLERY & LIGHTBOX
// ==========================================
function loadGallery(folder, files) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    galleryImages = [];

    let photoCount = 0;
    let videoCount = 0;

    files.forEach(file => {
        const ext = file.split(".").pop().toLowerCase();

        if (["jpg","jpeg","png","webp"].includes(ext)) {
            photoCount++;
            const img = document.createElement("img");
            img.src = folder + file;
            img.alt = file;
            img.loading = "lazy";
            img.className = "gallery-photo";

            const fullPath = folder + file;
            galleryImages.push(fullPath);

            img.onclick = function () {
                currentIndex = galleryImages.indexOf(fullPath);
                openLightbox();
            };

            gallery.appendChild(img);
        }
        else if (ext === "mp4") {
            videoCount++;
            const video = document.createElement("video");
            video.src = folder + file;
            video.controls = true;
            video.className = "gallery-video";
            gallery.appendChild(video);
        }
    });

    const photo = document.getElementById("photo-count");
    const video = document.getElementById("video-count");

    if (photo) photo.textContent = photoCount;
    if (video) video.textContent = videoCount;
}

function openLightbox(){
    if(galleryImages.length === 0) return;
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if(lightbox) lightbox.style.display = "flex";
    if(lightboxImg) lightboxImg.src = galleryImages[currentIndex];
}

function closeLightbox(){
    const lightbox = document.getElementById("lightbox");
    if(lightbox) lightbox.style.display = "none";
}

function nextImage(){
    if(galleryImages.length === 0) return;
    currentIndex++;
    if(currentIndex >= galleryImages.length){
        currentIndex = 0;
    }
    const lightboxImg = document.getElementById("lightbox-img");
    if(lightboxImg) lightboxImg.src = galleryImages[currentIndex];
}

function prevImage(){
    if(galleryImages.length === 0) return;
    currentIndex--;
    if(currentIndex < 0){
        currentIndex = galleryImages.length - 1;
    }
    const lightboxImg = document.getElementById("lightbox-img");
    if(lightboxImg) lightboxImg.src = galleryImages[currentIndex];
}

document.addEventListener("keydown", function(e){
    const lightbox = document.getElementById("lightbox");
    if(!lightbox || lightbox.style.display !== "flex") return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowRight") nextImage();
    if(e.key === "ArrowLeft") prevImage();
});

window.onclick = function(e){
    const lightbox = document.getElementById("lightbox");
    if(lightbox && e.target === lightbox){
        closeLightbox();
    }
};

// ==========================================
// 2. AMBIL DATA KUMPULAN (TAB: KUMPULAN)
// ==========================================
if (document.getElementById("groupA") || document.getElementById("groupB")) {
    fetch(kumpulanURL)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substring(47).slice(0,-2));
        const rows = json.table.rows;

        // Group A
        const groupA = [];
        for (let i = 7; i <= 10; i++) {
            if(rows[i] && rows[i].c && rows[i].c[2]) {
                const team = rows[i].c[2].v;
                if(team) groupA.push(team);
            }
        }
        const listA = document.getElementById("groupA");
        if(listA){
            listA.innerHTML = "";
            groupA.forEach(team => { listA.innerHTML += `<li>${team}</li>`; });
        }   

        // Group B
        const groupB = [];
        for (let i = 7; i <= 10; i++) {
            if(rows[i] && rows[i].c && rows[i].c[5]) {
                const team = rows[i].c[5].v;
                if(team) groupB.push(team);
            }
        }
        const listB = document.getElementById("groupB");
        if(listB){
            listB.innerHTML = "";
            groupB.forEach(team => { listB.innerHTML += `<li>${team}</li>`; });
        }

        // Group C
        const groupC = [];
        for (let i = 15; i <= 18; i++) {
            if(rows[i] && rows[i].c && rows[i].c[2]) {
                const team = rows[i].c[2].v;
                if(team) groupC.push(team);
            }
        }
        const listC = document.getElementById("groupC");
        if (listC) {
            listC.innerHTML = "";
            groupC.forEach(team => { listC.innerHTML += `<li>${team}</li>`; });
        }

        // Group D
        const groupD = [];
        for (let i = 15; i <= 18; i++) {
            if(rows[i] && rows[i].c && rows[i].c[5]) {
                const team = rows[i].c[5].v;
                if(team) groupD.push(team);
            }
        }
        const listD = document.getElementById("groupD");
        if (listD) {
            listD.innerHTML = "";
            groupD.forEach(team => { listD.innerHTML += `<li>${team}</li>`; });
        }

        console.log(`Data kumpulan ${KATEGORI_AKTIF} berjaya dimuatkan.`);
    })
    .catch(err => console.error("Ralat memuatkan data Kumpulan: ", err));
}

// ==========================================
// 3. AMBIL DATA JADUAL PERLAWANAN (TAB: JADUAL)
// ==========================================
const fixtureBody = document.getElementById("fixturesTable");
if (fixtureBody) {
    fetch(jadualURL)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substring(47).slice(0,-2));
        const rows = json.table.rows;

        fixtureBody.innerHTML = "";
        let tarikhSemasa = "-";

        for(let i=1;i<rows.length;i++){
            try{
                if(!rows[i] || !rows[i].c) continue;
                const row = rows[i].c;

                const ambilTeks = (index)=>{
                    if(!row[index]) return "";
                    return row[index].f ?? row[index].v ?? "";
                };

                const noMatch   = ambilTeks(0).trim();
                const tarikhRaw = ambilTeks(1).trim();
                const masa      = ambilTeks(2).trim();
                const kump      = ambilTeks(3).trim();
                const team1     = ambilTeks(4).trim();
                const team2     = ambilTeks(5).trim();
                const statusRaw = ambilTeks(6).trim();

                if(noMatch==="" || noMatch.toLowerCase()=="no perlawanan") continue;

                if(tarikhRaw!==""){
                    tarikhSemasa = tarikhRaw;
                }

                let statusClass = "status-pending";
                let statusIcon  = "🔴";
                let statusText  = "Belum Bermula";

                if(statusRaw!==""){
                    statusText = statusRaw;
                    const status = statusRaw.toLowerCase();

                    if(status.includes("selesai")){
                        statusClass = "status-selesai";
                        statusIcon = "🟢";
                    }
                    else if(status.includes("live")){
                        statusClass = "status-live";
                        statusIcon = "🟡";
                    }
                    else if(status.includes("ditangguh")){
                        statusClass = "status-postponed";
                        statusIcon = "⚫";
                    }
                }

                fixtureBody.innerHTML += `
                <tr>
                    <td>${noMatch}</td>
                    <td>${tarikhSemasa}</td>
                    <td>${masa}</td>
                    <td><span class="group-badge">${kump}</span></td>
                    <td>${team1}</td>
                    <td>${team2}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${statusIcon} ${statusText}
                        </span>
                    </td>
                </tr>`;
            }
            catch(e){
                console.log(e);
            }
        }
    })
    .catch(err=>console.error(err));
}

//==========================================
// 4. AMBIL DATA KEPUTUSAN JADUAL (TAB: RESULT)
// ==========================================
const tableBody = document.getElementById("resultsBody");
if (tableBody) {
    fetch(resultURL)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substring(47).slice(0,-2));
        const rows = json.table.rows;

        tableBody.innerHTML = ""; 

        const getLogo = (name) => {
            const cleanName = name.toLowerCase().replace('mss ', '').trim();
            return `../../../images/logo/${cleanName}.png`;
        };

        rows.forEach((row, i) => {
            if (!row.c || row.c[0] === null) return;
            const r = row.c;
            const val = (index) => (r[index]?.f || r[index]?.v || "").toString().trim();

            const noMatch  = val(0);
            const kump     = val(1);
            const team1    = val(2);
            const skor1    = val(3);
            const team2    = val(4);
            const skor2    = val(5);
            const pemenang = val(6);

            if (noMatch.toLowerCase().includes("match") || noMatch === "") return;
            
            tableBody.innerHTML += `
            <tr>
                <td>${noMatch}</td>
                <td><span class="group-badge">${kump}</span></td>
                <td>
                    <div class="team-cell">
                        <img src="${getLogo(team1)}" class="team-logo" onerror="this.style.display='none'">
                        <div><div class="team-name">${team1}</div></div>
                    </div>
                </td>
                <td>
                    <div class="score-box">
                        <span class="score">${skor1 || 0}</span>
                        <span class="score-separator">-</span>
                        <span class="score">${skor2 || 0}</span>
                    </div>
                </td>
                <td>
                    <div class="team-cell right">
                        <div><div class="team-name">${team2}</div></div>
                        <img src="${getLogo(team2)}" class="team-logo" onerror="this.style.display='none'">
                    </div>
                </td>
                <td class="result-cell"><span class="result-badge">${pemenang || "-"}</span></td>
            </tr>`;
        });
        console.log(`Data Keputusan ${KATEGORI_AKTIF} berjaya dipaparkan.`);
    })
    .catch(err => console.error("Ralat memuatkan data sheet RESULT: ", err));
}

function printResults(){
    window.print();
}

function downloadPDF(){
    const element = document.querySelector(".table-container");
    const option = {
        margin:0.5,
        filename:`Keputusan_MSSM_${KATEGORI_AKTIF}.pdf`,
        image:{ type:'jpeg', quality:1 },
        html2canvas:{ scale:2 },
        jsPDF:{ unit:'in', format:'a4', orientation:'landscape' }
    };
    html2pdf().set(option).from(element).save();
}

// ==========================================
// 5. AMBIL DATA UNDIAN PUSINGAN 2 (TAB: UNDIAN P2)
// ==========================================
function muatTurunUndianP2() {
    const tableBodyP2 = document.getElementById("undianP2Body");
    
    if (!tableBodyP2) {
        console.warn("Makluman: Elemen 'undianP2Body' tiada dalam HTML halaman ini (Bukan halaman undian).");
        return; 
    }

    console.log("Sedang menarik data Undian P2 dari:", undianP2URL);

    fetch(undianP2URL)
    .then(res => res.text())
    .then(data => {
        const json = JSON.parse(data.substring(data.indexOf("{"), data.lastIndexOf("}") + 1));
        const rows = json.table.rows;
        
        console.log("Berjaya tarik data sheet P2. Ini struktur datanya:", rows);
        tableBodyP2.innerHTML = "";

        rows.forEach((row, index) => {
            if (!row.c) return;
            
            // Abaikan tajuk (row 0, row 1)
            if (index < 2) return; 

            const val = (i) => row.c[i] ? (row.c[i].f ?? row.c[i].v ?? "").toString().trim() : "";

            const johan       = val(2); 
            const naibJohan   = val(3); 
            const undianJohan = val(5); 
            const undianNaib  = val(6); 

            // Jangan masukkan baris yang kosong sepenuhnya
            if (!johan && !naibJohan && !undianJohan && !undianNaib) return;

            tableBodyP2.innerHTML += `
            <tr>
                <td>${johan || "-"}</td>
                <td>${naibJohan || "-"}</td>
                <td>${undianJohan || "-"}</td>
                <td>${undianNaib || "-"}</td>
            </tr>`;
        });
    })
    .catch(err => console.error("Ralat memuatkan data Undian P2:", err));
}

// ==========================================
// 8. AMBIL DATA KEDUDUKAN (TAB: STANDING)
// ==========================================
function muatTurunStanding() {
    const tableElements = {
        A: document.getElementById("standings-group-a"),
        B: document.getElementById("standings-group-b"),
        C: document.getElementById("standings-group-c"),
        D: document.getElementById("standings-group-d")
    };

    if (!tableElements.A && !tableElements.B) return;

    fetch(standingURL)
    .then(res => res.text())
    .then(data => {
        const json = JSON.parse(data.substring(data.indexOf("{"), data.lastIndexOf("}") + 1));
        const rows = json.table.rows;

        let html = { A: "", B: "", C: "", D: "" };

        rows.forEach(row => {
            if (!row.c) return;
            const val = (i) => row.c[i] ? (row.c[i].f ?? row.c[i].v ?? "").toString().trim() : "";

            const rank = val(1);
            const kod  = val(2);

            if (kod === "") return;
            if (!/^[ABCD]\d+$/i.test(kod)) return;

            const group = kod.charAt(0).toUpperCase();

            html[group] += `
            <tr class="${rank == "1" || rank == "2" ? "qualified" : ""}">
                <td>${rank}</td>
                <td class="team-col"><div class="team-cell"><span class="team-name">${kod}</span></div></td>
                <td>${val(3)}</td>
                <td>${val(4)}</td>
                <td>${val(5)}</td>
                <td>${val(6)}</td>
                <td>${val(7)}</td>
                <td>${val(8)}</td>
                <td>${val(9)}</td>
                <td>${val(10)}</td>
                <td class="pts-col">${val(11)}</td>
            </tr>`;
        });

        ["A","B","C","D"].forEach(group => {
            if (tableElements[group]) {
                tableElements[group].innerHTML = html[group] || "<tr><td colspan='11'>Tiada data</td></tr>";
            }
        });
    })
    .catch(err => console.error("Standing Error :", err));
}

// ==========================================
// AUTOMATIK JALANKAN FUNGSI SELEPAS HALAMAN DIBUKA
// ==========================================
window.addEventListener("load", () => {
    setTimeout(muatTurunStanding, 500);
    setTimeout(muatTurunUndianP2, 600);
});