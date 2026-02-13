// Leaflet動的読み込み
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
document.head.appendChild(css);

const script = document.createElement("script");
script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
document.head.appendChild(script);

script.onload = () => {

  const map = L.map("map").setView([36.2048, 138.2529], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // 日本国内の美術館のみ取得
  const query = `
  [out:json][timeout:25];
  area["ISO3166-1"="JP"][admin_level=2];
  (
    node["tourism"="museum"](area);
    way["tourism"="museum"](area);
    relation["tourism"="museum"](area);
  );
  out center tags;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(res => res.json())
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

      // 🔴 赤い丸マーカー
      const marker = L.circleMarker([lat, lon], {
        radius: 6,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.8
      }).addTo(map);

      let popupContent = `<b>${name}</b><br/>`;

      if (website) {
        popupContent += `<a href="${website}" target="_blank">公式ホームページを見る</a>`;
      } else {
        popupContent += `公式HP情報なし`;
      }

      marker.bindPopup(popupContent);

    });

  })
  .catch(err => {
    console.error("取得エラー:", err);
  });

};
