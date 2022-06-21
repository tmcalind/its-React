import React, {
    useRef,
    useEffect
} from 'react'
import {
    useDispatch
} from "react-redux";
import {
    setSelectedObjectIds,
    setSelectedAddresses
} from "../slices/addressSlice";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import * as geometryEngineAsync from "@arcgis/core/geometry/geometryEngineAsync"

import { createMap } from "./MapTools";

import "@arcgis/core/assets/esri/themes/light/main.css";

const AddressMap = ({
        basemap,
        height,
        width,
        center,
        scale
    }) => {
        const dispatch = useDispatch();
        const mapDiv = useRef(null);

        useEffect(() => {
            if (mapDiv.current) {

                let addresses = [];
                let selectedObjectIds = [];

                const map = createMap(basemap);
                const addressLayerUrl = "https://citymap/arcgisa/rest/services/References/AddressMaster/MapServer/0";
                const addressLayer = new FeatureLayer({
                    //Address Points
                    url: addressLayerUrl,
                    popupTemplate: {
                        title: "{FullAddress}",
                        actions: [{
                            title: "Add/Remove",
                            id: "addRemoveAction",
                            className: "esri-icon-swap"
                        }]
                    },
                    id: "Address_layer",
                    labelingInfo: [{

                        labelExpressionInfo: {
                            expression: "$feature.MunicipalNumber"
                        },
                        labelPlacement: "center-center",
                        symbol: {
                            type: "text", // autocasts as new TextSymbol()
                            font: {
                                size: 8,
                                family: "Noto Sans"
                            },
                            horizontalAlignment: "left",
                            color: "#1B4D3E"
                        },
                        minScale: 6000
                    }],
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-marker",
                            size: 1,
                            color: "#1B4D3E"
                        }
                    },
                    minScale: 8000,
                    outFields: ["*"]
                });

                let addressSelectionLayerView;
                addressLayer.when(() => {
                    view.whenLayerView(addressLayer).then((layerView) => addressSelectionLayerView = layerView);
                })

                map.add(addressLayer);

                  let featLayer = new FeatureLayer({
                         
                            objectIdField: "ObjectID",
                            labelingInfo: [{

                                labelExpressionInfo: {
                                    expression: "$feature.Name"
                                },
                                labelPlacement: "center-center",
                                symbol: {
                                    type: "text", // autocasts as new TextSymbol()
                                    font: {
                                        size: 18,
                                        family: "Noto Sans"
                                    },
                                    horizontalAlignment: "left",
                                    color: "#1B4D3E"
                                },
                                minScale: 6000
                            }],
                            renderer: {
                                type: "simple",
                                symbol: {
                                    type: "simple-marker",
                                    size: 10,
                                    color: "#1B4D3E"
                                }
                            },
                            minScale: 8000,
                            outFields: ["*"]
                        })

                        map.add(featLayer);

                // add parcels
                const parcelsLayerUrl = "https://citymap/arcgisa/rest/services/References/ParcelMapping/MapServer/0"
                const parcelsLayer = new FeatureLayer({
                    url: parcelsLayerUrl,
                    id: "Parcel_layer",
                    minScale: 10000,
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-fill",
                            color: [120, 134, 107, 0.2]
                        },
                    }
                });
                map.add(parcelsLayer);

                // add buildings
                const buildingsLayerUrl = "https://citymap/arcgisb/rest/services/References/TOPO/MapServer/0"
                const buildingsLayer = new FeatureLayer({
                    url: buildingsLayerUrl,
                    id: "Building_layer",
                    minScale: 8000,
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-fill",
                            color: [238, 238, 238, 0.5]
                        },
                    }
                });
                map.add(buildingsLayer);


                const view = new MapView({
                    map,
                    container: mapDiv.current,
                    center,
                    scale,
                });

                const selectionSketchLayer = new GraphicsLayer();
                map.add(selectionSketchLayer);

                view.ui.add("select-by-polygon", "top-left");
                const selectButton = document.getElementById("select-by-polygon");
                selectButton.addEventListener("click", () => {
                    view.popup.close();
                    sketchViewModel.create("polygon");
                });

                view.ui.add("clear-all", "top-left");
                const clearAllButton = document.getElementById("clear-all");
                clearAllButton.addEventListener("click", () => {
                    selectedObjectIds = [];
                    displayResults(selectedObjectIds);

                    dispatch(setSelectedObjectIds([]));
                    dispatch(setSelectedAddresses([]));
                });

                const selectedAddressesLayer = new GraphicsLayer();
    
                map.add(selectedAddressesLayer);

                view.ui.add("upload-addresses", "top-left");
                const uploadButton = document.getElementById("upload-addresses");
                uploadButton.addEventListener("click", () => {
                    addressLayer
                        .queryFeatures({
                            objectIds: selectedObjectIds,
                            returnGeometry: false,
                            outFields: ["*"]
                        })
                        .then((featureSet) => {
                            addresses = featureSet.features.map((feature) => {
                                return {
                                    id: parseInt(feature.attributes.OBJECTID),
                                    ObjectId: parseInt(feature.attributes.OBJECTID),
                                    MunicipalNumber: parseInt(feature.attributes.MunicipalNumber),
                                    MunicipalNumberQualifier: feature.attributes.MunicipalNumberQualifier,
                                    StreetName: feature.attributes.StreetName,
                                    StreetType: feature.attributes.StreetType,
                                    StreetDirection: feature.attributes.StreetDirection,
                                    UnitNumber: feature.attributes.UnitNumber,
                                    FullAddress: feature.attributes.FullAddress,
                                    UnitFullAddress: feature.attributes.UnitFullAddress
                                };
                            });

                            dispatch(setSelectedAddresses(addresses));
                            
                            // console.table(addresses);
                        });
                });

                const sketchViewModel = new SketchViewModel({
                    view: view,
                    layer: selectionSketchLayer
                });

                sketchViewModel.on("create", async (event) => {
                    if (event.state === "complete") {

                        const geometries = selectionSketchLayer.graphics.map((graphic) => graphic.geometry)

                        const queryGeometry = await geometryEngineAsync.union(
                            geometries.toArray()
                        );

                        selectionSketchLayer.removeAll();

                        selectFeatures(queryGeometry);
                    }
                });

                const selectFeatures = (geometry) => {
                    if (addressSelectionLayerView) {
                        addressSelectionLayerView
                            .queryFeatures({
                                geometry: geometry,
                                returnGeometry: true,
                                outFields: ["*"]
                            })
                            .then((results) => {
                                selectedObjectIds = results.features
                                    .map((feature) => feature.attributes)
                                    .map((attribs) => attribs.OBJECTID);

                                displayResults(results);
                                dispatch(setSelectedObjectIds([...selectedObjectIds]));
                            });
                    }
                }

                const displayResults = (results) => {
                    selectedAddressesLayer.removeAll();
                    if (results.features) {
                        const features = results.features.map((graphic) => {
                            graphic.symbol = {
                                type: "simple-marker",
                                size: 18,
                                color: "yellow",
                                outline: {
                                    width: 0.8,
                                    color: "black"
                                }
                            };

                            graphic.attributes = {
                                Name: "Tom"
                            }

                            console.log(graphic)
                            return graphic;
                        });

                        selectedAddressesLayer.addMany(features);

                        featLayer.source = features;
                        // let featLayer = new FeatureLayer({
                        //     source: features,
                        //     objectIdField: "ObjectID",
                        //     labelingInfo: [{

                        //         labelExpressionInfo: {
                        //             expression: "$feature.Name"
                        //         },
                        //         labelPlacement: "center-center",
                        //         symbol: {
                        //             type: "text", // autocasts as new TextSymbol()
                        //             font: {
                        //                 size: 18,
                        //                 family: "Noto Sans"
                        //             },
                        //             horizontalAlignment: "left",
                        //             color: "#1B4D3E"
                        //         },
                        //         minScale: 6000
                        //     }],
                        //     renderer: {
                        //         type: "simple",
                        //         symbol: {
                        //             type: "simple-marker",
                        //             size: 1,
                        //             color: "#1B4D3E"
                        //         }
                        //     },
                        //     minScale: 8000,
                        //     outFields: ["*"]
                        // })

                        // map.add(featLayer);
                    }
                }

                view.popup.viewModel.on("trigger-action", (event) => {
                    const selectedFeatureObjectId = view.popup.viewModel.selectedFeature.attributes.OBJECTID;
                    if (event.action.id === "addRemoveAction") {
                        toggleSelected(selectedFeatureObjectId);   
                    }    
                });

                const toggleSelected = (objectId) => {
                    if (selectedObjectIds && selectedObjectIds.length > 0) {
                        const pos = selectedObjectIds.indexOf(objectId);
                        if (pos > -1) {
                            // if it's in the array; remove it
                            selectedObjectIds.splice(pos, 1);
                        } else {
                            // else add it
                            selectedObjectIds.push(objectId);
                        }
                    } else {
                        // if the array is empty; add it
                        selectedObjectIds.push(objectId);
                    }
                    
                    dispatch(setSelectedObjectIds([...selectedObjectIds]));

                    addressLayer
                        .queryFeatures({
                            objectIds: selectedObjectIds,
                            returnGeometry: true,
                            outFields: ["*"]
                        })
                        .then((results) => displayResults(results));
                }
            }
        }, [
            dispatch, 
            basemap,
            center,
            scale
        ]);

  return (
    <>
        <div className="mapDiv" ref={mapDiv} style={{ width, height }}></div>
        <div id="select-by-polygon"
            className="esri-widget esri-widget--button esri-widget esri-interactive"
            title="Select features by polygon">
            <span className="esri-icon-polygon"></span>
        </div>
        <div id="clear-all"
            className="esri-widget esri-widget--button esri-widget esri-interactive"
            title="Clear all selection">
            <span className="esri-icon-trash"></span>
        </div>
        <div id="upload-addresses"
            className="esri-widget esri-widget--button esri-widget esri-interactive"
            title="Upload selection">
            <span className="esri-icon-upload"></span>
        </div>
    </>
  )
}

export default AddressMap