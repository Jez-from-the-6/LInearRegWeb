import React, {useState, useEffect} from "react";
import {dataService} from "../skeleton/src/Routing/utilities/data.service";
import Constants from "../skeleton/src/utils/textConstants";
import {MDBContainer} from 'mdbreact';
import Plot from "react-plotly.js"

export const Main = () : JSX.Element => {
    const [scatterGraphics, setScatterGraphics] = useState(null);
    
   
    const processDataset = (data) => {
        console.log(data)
        let x = [];
        let y = [];
        Object.keys(data).map(key => {
            let current = data[key];
            x.push(current[0])
            y.push(current[1])
        })

        return {x, y}
    }

    const prepLinearRegAnimation = (theta_hist, scatterData) => {
        let scatterObject = {
            x: scatterData["x"],
            y: scatterData["y"],
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'purple'}
        }

        let frames = [];

        theta_hist.map(theta => {
            let x = [];
            let y = [];
            for (var i = 0; i < 22; i++) {
                x.push(i)
                y.push(theta[0] + (theta[1] * i))
            } 
            frames.push({  
                data: [
                    scatterObject,
                    { 
                        x,
                        y,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'blue'},
                    }
                ]  
            })
        })
           
        return {frames, scatterObject};
    }

    
    useEffect(() => {
        console.log("called")
        let mounted = true 
        getData()
        return () => mounted = false;
        async function getData() {
            let result = await dataService.requestGET(Constants.apiBaseUrl)
            let lineParams = await dataService.requestGET(Constants.apiModelUrl + "?alpha=0.01&iterations=400")
            console.log(lineParams);
            let scatterData = processDataset(result);
            console.log(scatterData)
            let graphicData = prepLinearRegAnimation(lineParams.theta_history, scatterData)

            if(mounted) {
                setScatterGraphics({frames: graphicData.frames, base: graphicData.scatterObject})
            }
        }

    }, [])

        

    return scatterGraphics?  (
            <MDBContainer>
                <div id="graph"/>
                {Plot.react('graph', { data: [scatterGraphics.base] })}
                <Plot
                data={[scatterGraphics.base]}
                frames={scatterGraphics.frames}
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