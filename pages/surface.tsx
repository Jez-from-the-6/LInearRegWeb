import React, {useState, useEffect} from "react";
import {dataService} from "../skeleton/src/Routing/utilities/data.service";
import Constants from "../skeleton/src/utils/textConstants";
import {MDBContainer} from 'mdbreact';
import Plot from "react-plotly.js"

export const Main = () : JSX.Element => {
    const [scatterGraphics, setScatterGraphics] = useState(null);

    useEffect(() => {
        console.log("called")
        let mounted = true 
        getData()
        return () => mounted = false;
        async function getData() {
            let result = await dataService.requestGET(Constants.apiBaseUrl)
            let surfaceParams = await dataService.requestGET(Constants.apiSurfaceUrl)
            console.log(surfaceParams)
            let graphicData = [{
                x: surfaceParams["theta1_vals"],
                y: surfaceParams["theta0_vals"],
                z: surfaceParams["J_vals"],
                type: 'surface',
            }]

            if(mounted) {
                setScatterGraphics(graphicData)
            }
        }

    }, [])

        

    return scatterGraphics?  (
            <MDBContainer>
                <Plot
                data={scatterGraphics}
                layout={{
                    width: 1100,
                    height: 800,
                    title: 'A Fancy Plot',
                }}
                />
            </MDBContainer>
    ) : (<div>LOADING</div>)
}


export default Main;