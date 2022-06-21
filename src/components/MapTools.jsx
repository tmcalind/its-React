import WebMap from "@arcgis/core/WebMap";


export const createMap = (basemap) => {
    let map;
    if (basemap === "LONDON_BASEMAP") {
      map = new WebMap({
        portalItem: {
          id: "9616afa1c77d4654950a53d519765442",
        },
      });
    } else {
      map = new WebMap({ basemap });
    }
  
    return map;
  };