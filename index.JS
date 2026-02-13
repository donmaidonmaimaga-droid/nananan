const map = L.map("map").setView([36.2048, 138.2529], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// 🔁 APIではなくローカルJSON読み込み
fetch("museums.json")
.then(response => response.json())
.then(data => {

  data.elements.forEach(el => {

    let lat, lon;

    if (el.type === "node") {
      lat = el.lat;
      lon = el.lon;
    } else if (el.center) {
      lat = el.center.lat;
      lon = el.center.lon;
    }

    if (!lat || !lon) return;

    const name = el.tags?.name || "名称不明の美術館";
    const website = el.tags?.website || el.tags?.url;

    const marker = L.circleMarker([lat, lon], {
      radius: 6,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.8
    }).addTo(map);

    let popup = `<b>${name}</b><br/>`;

    if (website) {
      popup += `<a href="${website}" target="_blank">公式HPを見る</a>`;
    } else {
      popup += `公式HP情報なし`;
    }

    marker.bindPopup(popup);

  });

})
.catch(error => {
  console.error("JSON読み込みエラー:", error);
});
