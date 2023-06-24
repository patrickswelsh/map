/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 */


let map: google.maps.Map;
let featureLayer;
let ziplist: string[] = [];
let placelist: string[] = [];

let params = new URLSearchParams(location.search); //get the lat and lng from parameters in the url
let lat: number = Number(params.get('lat')); 
let lng: number  = Number(params.get('lng'));


function initMap() {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: lat, lng: lng },
        zoom: 8,
        // In the cloud console, configure this Map ID with a style that enables the
        // "Administrative Area Level 2" Data Driven Styling type.
        mapId: 'f969b46c061723c', // <YOUR_MAP_ID_HERE>,
    });
    // Add the feature layer.
    //@ts-ignore
    featureLayer = map.getFeatureLayer('POSTAL_CODE');
    // Add the event listener for the feature layer.
    featureLayer.addListener('click', handlePlaceClick);
    // Apply style on load, to enable clicking.
    applyStyleToSelected();
}
// Handle the click event.
async function handlePlaceClick(event) {
    let feature = event.features[0];
    if (!feature.placeId) return;
    // Apply the style to the feature layer.

    if (placelist.includes(feature.placeId)){
        const index = placelist.indexOf(feature.placeId);
        if (index > -1) { // only splice array when item is found
          placelist.splice(index, 1); // 2nd parameter means remove one item only
        }
    }else{placelist.push(feature.placeId)}

    applyStyleToSelected(placelist);

    const place = await feature.fetchPlace();
    if (ziplist.includes(place.displayName)){
        const index = ziplist.indexOf(place.displayName);
        if (index > -1) { // only splice array when item is found
          ziplist.splice(index, 1); // 2nd parameter means remove one item only
        }
    }else{ziplist.push(place.displayName)}


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
function applyStyleToSelected(placelist?) {

    // Apply styles to the feature layer.
    featureLayer.style = (options) => {
        // Style fill and stroke for a polygon.
        if ( placelist && placelist.indexOf(options.feature.placeId) != -1) {
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
