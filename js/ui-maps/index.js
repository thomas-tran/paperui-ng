import { Map, Marker, TileLayer } from 'leaflet/dist/leaflet-src.esm';

/**
 * @category Web Components
 * @customelement ui-maps
 * @description A map component, using leaflet.
 * @example <caption>An example</caption>
 * <ui-maps></ui-maps>
 */
class UiMaps extends HTMLElement {
  constructor() {
    super();
    this.value = [51.505, -0.09];
  }

  connectedCallback() {
    this.style.display = "block";
    this.style["height"] = "300px";
    this.map = new Map(this, {
      center: this.value,
      zoom: 4,
      trackResize: false
    });
    this.marker = new Marker(this.value).addTo(this.map);
    this.marker.bindPopup("<b>You are here</b>").openPopup();
    this.map.on("click", (e) => {
      this.value = [e.latlng.lat, e.latlng.lng];
      this.marker.setLatLng(e.latlng);
      this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
    })
    this.tileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(this.map);
  }
  disconnectedCallback() {
    if (this.map) this.map.remove();
  }
}

customElements.define('ui-maps', UiMaps);

/**
 * Maps UI module
 * 
 * Because this component is not used on every page, it has its own module.
 * 
 * @category Web Components
 * @module ui-maps
 */