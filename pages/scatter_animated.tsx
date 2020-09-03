import React, {useState, useEffect, useRef} from "react";
import {dataService} from "../skeleton/src/Routing/utilities/data.service";
import Constants from "../skeleton/src/utils/textConstants";
import {MDBContainer, MDBBtn} from 'mdbreact';
import Plot from "react-plotly.js"
import * as Plotly from "plotly.js";


export const Main = () : JSX.Element => {
    const [scatterGraphics, setScatterGraphics] = useState(null);
    
    const graphicRef = useRef(null)


   
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
        console.log(Plotly)
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

    const create = () => {
        Plotly.newPlot(graphicRef.current, [{
            x: [1, 2, 3],
            y: [0, 0.5, 1],
            line: {simplify: false},
        }])    
    }

    const animate = () => {
        Plotly.animate(graphicRef.current, {
            data: [{y: [Math.random(), Math.random(), Math.random()]}],
            traces: [0],
            layout: {}
          }, {
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 500
            }
          })
    }

    return scatterGraphics?  (
            <MDBContainer>   
                <div id="myDiv" ref={graphicRef} />
                <button onClick={create}>Create!</button> 
                <button onClick={animate}>Animate!</button> 
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