import React, {useState, useEffect} from "react";
import {dataService} from "../skeleton/Routing/utilities/data.service";
import Constants from "../skeleton/shared/utils/textConstants";
import {Scatter} from 'react-chartjs-2';
import {MDBContainer} from 'mdbreact';

export const Main = () : JSX.Element => {
    const [graphics, setGraphics] = useState(null);
    
   
    const processData = (data) => {
        console.log(data)
        let result = [];
        Object.keys(data).map(key => {
            let current = data[key];
            result.push({x: current[0], y: current[1]})
        })

        return result
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
            let graphicData = {
                dataScatter: {
                    labels: ['Scatter'],
                    datasets: [
                        {
                            borderColor: 'rgba(99,0,125, 0.2)',
                            backgroundColor: 'rgba(99,0,125, 0.5)',
                            label: "Observed Housing Data",
                            data: processData(result)
                        }
                    ]
                },
                optionsScatter: {
                    color: "#F5DEB3",
                    backgroundColor: "#F5DEB3",
                    title: {
                        display: true,
                        text: 'Housing Prices in relation to City Population'
                    },
                    scales: {
                        xAxes: [
                            {
                                type: 'linear',
                                position: 'bottom',
                                ticks: {
                                    userCallback: function(tick) {
                                        return tick.toString();
                                    }
                                },
                                scaleLabel: {
                                    labelString: 'Population in 10,000s',
                                    display: true
                                }
                            }
                        ],
                        yAxes: [
                            {
                                type: 'linear',
                                ticks: {
                                    userCallback: function(tick) {
                                        return tick.toString();
                                    }
                                },
                                scaleLabel: {
                                    labelString: 'Profit in 10,000$s',
                                    display: true
                                }
                            }
                        ]
                    }
                }
            };

            if(mounted) setGraphics(graphicData)
        }

    }, [])

        

    return graphics?  (
        <MDBContainer style={{backgroundColor: "aliceblue"}}>
            <h3 className='mt-5'>Visualization of the relation City Population - Housing Price</h3>
            <Scatter
            data={graphics.dataScatter}
            options={graphics.optionsScatter}
            />
        </MDBContainer>
    ) : (<div>LOADING</div>)
}


export default Main;