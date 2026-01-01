// Tablo verileri
const veriler = [
    { yil: 2000, katsayi: 21.9, dilim: 2500 },
    { yil: 2005, katsayi: 13.5, dilim: 6600 },
    { yil: 2010, katsayi: 11.8, dilim: 8800 },
    { yil: 2015, katsayi: 9.7,  dilim: 12000 },
    { yil: 2020, katsayi: 7.5,  dilim: 22000 },
    { yil: 2024, katsayi: 5.5,  dilim: 110000 },
    { yil: 2026, katsayi: 5.8,  dilim: 190000 }
];

// Grafik Oluşturma
const ctx = document.getElementById('katsayiChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: veriler.map(d => d.yil),
        datasets: [{
            label: 'İlk Vergi Dilimi / Asgari Ücret Katsayısı',
            data: veriler.map(d => d.katsayi),
            borderColor: '#e67e22',
            backgroundColor: 'rgba(230, 126, 34, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }
});

function analizEt() {
    const maas = parseFloat(document.getElementById('brutMaas').value);
    if (!maas || maas <= 0) {
        alert("Lütfen geçerli bir maaş girin.");
        return;
    }

    const sonucDiv = document.getElementById('results');
    const gecisAyMetni = document.getElementById('gecisAyMetni');
    const eskiKiyasMetni = document.getElementById('eskiKiyasMetni');

    // 2026 Hesaplaması
    const dilim2026 = 190000;
    const ay2026 = Math.ceil(dilim2026 / maas);

    // 2000 Katsayısı ile Simülasyon (Adalet Kıyası)
    // 2026 asgari ücreti 33030 TL. 2000 katsayısı 21.9 olsaydı dilim ne olurdu?
    const adaletliDilim = 33030 * 21.9; 
    const adaletliAy = Math.ceil(adaletliDilim / maas);

    sonucDiv.style.display = 'grid';

    gecisAyMetni.innerHTML = ay2026 <= 12 
        ? `Maaşınız 2026 yılında <b>${ay2026}. ayda</b> üst vergi dilimine giriyor.` 
        : `Maaşınız 2026 yılında yıl boyu %15 diliminde kalıyor.`;

    eskiKiyasMetni.innerHTML = `Eğer 2000 yılındaki <b>21.9 katsayısı</b> korunsaydı, üst dilime 
        ${adaletliAy <= 12 ? '<b>' + adaletliAy + '. ayda</b>' : '<b>hiçbir zaman</b>'} girmeyecektiniz. 
        Vergi dilimi sınırı 190.000 TL yerine <b>${Math.round(adaletliDilim).toLocaleString()} TL</b> olmalıydı.`;
}
