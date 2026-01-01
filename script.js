const veriler = [
    { yil: 2000, katsayi: 21.9, dilim: 2500 },
    { yil: 2024, katsayi: 5.5,  dilim: 110000 },
    { yil: 2025, katsayi: 6.1,  dilim: 158000 },
    { yil: 2026, katsayi: 5.8,  dilim: 190000 }
];

window.onload = function() {
    // Grafik Çizimi (Aynı Mantık)
    const ctx = document.getElementById('katsayiChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: veriler.map(d => d.yil),
            datasets: [{
                label: 'Dilim / Asgari Ücret Katsayısı',
                data: veriler.map(d => d.katsayi),
                borderColor: '#e67e22',
                fill: false,
                tension: 0.3
            }]
        }
    });
};

function analizEt() {
    const brut = parseFloat(document.getElementById('brutMaas').value);
    if (!brut || brut < 33030) return alert("Lütfen en az brüt asgari ücret (33.030 TL) giriniz.");

    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = ''; // Önce temizle

    // Sabitler (2026 Projeksiyonu)
    const asgariBrut = 33030;
    const ilkDilimSiniri = 190000;
    const sgkOrani = 0.15; // %14 + %1 İşsizlik
    
    let kumulatifMatrah = 0;
    let tabloContent = '';

    const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    aylar.forEach(ay => {
        // 1. SGK Kesintisi
        const sgkKesintisi = brut * sgkOrani;
        const gelirVergisiMatrahi = brut - sgkKesintisi;
        
        // 2. Vergi Dilimi Kontrolü
        let vergiOrani = (kumulatifMatrah + gelirVergisiMatrahi) <= ilkDilimSiniri ? 0.15 : 0.20;
        let hamVergi = gelirVergisiMatrahi * vergiOrani;
        
        // 3. Asgari Ücret İstisnası (Asgari ücretin vergisi kadar indirim)
        const asgariMatrah = asgariBrut * (1 - sgkOrani);
        const asgariVergiIstisnasi = asgariMatrah * 0.15; // Asgari ücret hep %15'lik dilimden korunur
        
        let odenecekVergi = Math.max(0, hamVergi - asgariVergiIstisnasi);
        let netMaas = brut - sgkKesintisi - odenecekVergi;
        
        kumulatifMatrah += gelirVergisiMatrahi;

        tabloContent += `
            <tr class="${vergiOrani > 0.15 ? 'tax-warning' : ''}">
                <td>${ay}</td>
                <td>%${vergiOrani * 100}</td>
                <td>${Math.round(odenecekVergi).toLocaleString()} TL</td>
                <td><b>${Math.round(netMaas).toLocaleString()} TL</b></td>
            </tr>`;
    });

    resultsDiv.innerHTML = `
        <div class="card highlight" style="margin-bottom:20px;">
            <h3>Yıllık Net Maaş Simülasyonu</h3>
            <p>Brüt Maaş: ${brut.toLocaleString()} TL üzerinden hesaplanmıştır.</p>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Ay</th><th>Dilim</th><th>Vergi</th><th>Net Ele Geçen</th></tr>
                    </thead>
                    <tbody>${tabloContent}</tbody>
                </table>
            </div>
            <p class="info-text">
                * <b>Hesaplama Detayı:</b> SGK işçi payı (%15) düşülmüş ve asgari ücret vergi istisnası uygulanmıştır. 
                Turuncu satırlar %20'lik vergi dilimine girdiğiniz ayları göstermektedir.
            </p>
        </div>
    `;
}
