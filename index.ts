/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 */

import { DstAlphaFactor } from "three";

let map: google.maps.Map;
let featureLayer;
let ziplist: string[] = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 39.23, lng: -105.73 }, // Park County, CO 
        zoom: 8,
        // In the cloud console, configure this Map ID with a style that enables the
        // "Postal Code" Data Driven Styling type.
        mapId: 'f969b46c061723c', // <YOUR_MAP_ID_HERE>,
    });
    // Add the feature layer.
    //@ts-ignore
    featureLayer = map.getFeatureLayer('POSTAL_CODE');
    // Add the event listener for the feature layer.\
    featureLayer.addListener('click', handlePlaceClick);
    infoWindow = new google.maps.InfoWindow({});
    // Apply style on load, to enable clicking.
    applyStyleToSelected();
}
// Handle the click event.
async function handlePlaceClick(event) {
    let feature = event.features[0];
    if (!feature.placeId) return;
    const place = await feature.fetchPlace();
    if (ziplist.includes(place)){
        const index = ziplist.indexOf(place);
        if (index > -1) { // only splice array when item is found
          ziplist.splice(index, 1); // 2nd parameter means remove one item only
        }
    }else{ziplist.push(place)}
    // Apply the style to the feature layer.
    applyStyleToSelected(feature.placeId);
    // Add the info window.
    window.parent.postMessage(ziplist,'*');
}
// Stroke and fill with minimum opacity value.
//@ts-ignore
const styleDefault: google.maps.FeatureStyleOptions = {
    strokeColor: '#810FCB',
    strokeOpacity: 1.0,
    strokeWeight: 2.0,
    fillColor: 'white',
    fillOpacity: 0.1 // Polygons must be visible to receive click events.
};

// Style for the clicked Administrative Area Level 2 polygon.
//@ts-ignore
const styleClicked: google.maps.FeatureStyleOptions = {
    ...styleDefault,
    fillColor: '#810FCB',
    fillOpacity: 0.5
};
// Apply styles to the map.
function applyStyleToSelected(placeid?) {
    // Apply styles to the feature layer.
    featureLayer.style = (options) => {
        // Style fill and stroke for a polygon.
        if (placeid && options.feature.placeId == placeid) {
            return styleClicked;
        }
        // Style only the stroke for the entire feature type.
        return styleDefault;
    };
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export { };
