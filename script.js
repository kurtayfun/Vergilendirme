const veriler = [
    { yil: 2000, katsayi: 21.9, dilim: 2500 },
    { yil: 2005, katsayi: 13.5, dilim: 6600 },
    { yil: 2010, katsayi: 11.8, dilim: 8800 },
    { yil: 2015, katsayi: 9.7,  dilim: 12000 },
    { yil: 2020, katsayi: 7.5,  dilim: 22000 },
    { yil: 2024, katsayi: 5.5,  dilim: 110000 },
    { yil: 2025, katsayi: 6.1,  dilim: 158000 },
    { yil: 2026, katsayi: 5.8,  dilim: 190000 }
];

// Sayfa açıldığında çalışacaklar
window.onload = function() {
    // Tabloyu Doldur
    const tableBody = document.getElementById('tableBody');
    veriler.slice().reverse().forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.yil}</td><td>${row.dilim.toLocaleString()} TL</td><td>${row.katsayi}</td>`;
        tableBody.appendChild(tr);
    });

    // Grafiği Çiz
    const ctx = document.getElementById('katsayiChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: veriler.map(d => d.yil),
            datasets: [{
                label: 'Dilim / Asgari Ücret Katsayısı',
                data: veriler.map(d => d.katsayi),
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true }
    });
};

function analizEt() {
    const maas = parseFloat(document.getElementById('brutMaas').value);
    if (!maas) return alert("Lütfen maaş girin");

    document.getElementById('results').style.display = 'grid';
    
    // 2026 Analizi
    const ay2026 = Math.ceil(190000 / maas);
    document.getElementById('gecisAyMetni').innerHTML = ay2026 <= 12 
        ? `Maaşınız <b>${ay2026}. ayda</b> üst vergi dilimine giriyor.` 
        : `Yıl boyu %15 diliminde kalıyorsunuz.`;

    // Karşılaştırma
    const adaletliDilim = 33030 * 21.9;
    document.getElementById('eskiKiyasMetni').innerHTML = `2000 yılındaki katsayı (21.9) korunsaydı, vergi dilimi <b>${Math.round(adaletliDilim).toLocaleString()} TL</b> olacaktı ve muhtemelen hiç üst dilime girmeyecektiniz.`;
}
