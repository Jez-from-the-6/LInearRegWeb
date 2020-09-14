import React, {useState, useEffect, useRef} from "react";
import {dataService} from "../../skeleton/Routing/utilities/data.service";
import Constants from "../../skeleton/shared/utils/textConstants";
import {MDBContainer, MDBBtn} from 'mdbreact';
import Plot from "react-plotly.js"
import * as Plotly from "plotly.js";


export const Main = () : JSX.Element => {
    const [scatterGraphics, setScatterGraphics] = useState(null);
   
    const processDataset = (data) => {
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
        console.log(theta_hist)
        theta_hist.map((theta, index) => {
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
                ],
                name: "frame" + index  
            })
        })
           
        return {frames, base: frames[0].data};
    }

    
    useEffect(() => {
        let mounted = true 
        getData()
        return () => mounted = false;
        async function getData() {
            let result = await dataService.requestGET(Constants.apiBaseUrl)
            let lineParams = await dataService.requestGET(Constants.apiModelUrl + "?alpha=0.01&iterations=400")
            let scatterData = processDataset(result);
            let graphicData = prepLinearRegAnimation(lineParams.theta_history, scatterData)
            if(mounted) {
                
                setScatterGraphics(graphicData)
            }
        }

    }, [])

    const animate = () => {
        let frameNames = scatterGraphics.frames.map(frame => frame.name)
        Plotly.animate('graph', frameNames, {
            frame: {duration: 1000},
            transition: {duration: 10000, easing: 'linear'},
            mode: 'afterall'
        })
    }

    return scatterGraphics?  (
            <MDBContainer>   
                <button onClick={animate}>Animate!</button> 
                <Plot
                data={scatterGraphics.base}
                divId="graph"
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