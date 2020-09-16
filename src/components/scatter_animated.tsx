import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../skeleton/Routing/utilities/data.service';
import Constants from '../../skeleton/shared/utils/textConstants';
import { MDBContainer, MDBBtn } from 'mdbreact';
import Plot from 'react-plotly.js';
import * as Plotly from 'plotly.js';
import { Coordinates2D, SetOfParams } from '../../skeleton/shared/utils/types';

/**
 * @description Requests the Dataset and Model from the Backend and uses it generate a graphic.
 * The graphic contains the dataset as a Scatterplot. It also contains the model as a line graph.
 *
 * The Line Graph is animated through Button Click. The Animation shows the training process of the model.
 *
 * @requires Functioning API.
 */
export const Scatter_With_Model = (): JSX.Element => {
  // After the Data is received and processed, the information for the graphic is stored here
  const [graphicOptions, setGraphicOptions] = useState(null);

  // Helper Function: Processes the Dataset from the Server into an <Coordinates> Object.
  // The attribute values with matching index represent the coordinates for a point.
  const processDataset = (data: SetOfParams): Coordinates2D => {
    let x = [];
    let y = [];
    Object.keys(data).map(key => {
      let current = data[key];
      x.push(current[0]);
      y.push(current[1]);
    });

    return { x, y };
  };

  // Helper Function
  const prepLinearRegAnimation = (theta_hist: SetOfParams, scatterData: Coordinates2D): AnimatedGraphicParams => {
    let scatterObject = {
      x: scatterData.x,
      y: scatterData.y,
      type: 'scatter',
      mode: 'markers',
      name: 'Observed Housing Prices',
      marker: { color: 'purple' },
    };

    let frames = [];
    console.log(theta_hist);
    theta_hist.map((theta, index) => {
      let x = [];
      let y = [];
      for (var i = 0; i < 22; i++) {
        x.push(i);
        y.push(theta[0] + theta[1] * i);
      }
      frames.push({
        data: [
          scatterObject,
          {
            x,
            y,
            type: 'scatter',
            mode: 'lines',
            name: 'Linear Prediction Model',
            marker: { color: 'blue' },
          },
        ],
        name: 'frame' + index,
      });
    });

    return { frames, baseFrame: frames[0].data };
  };

  useEffect(() => {
    let mounted = true;
    getData();
    return () => (mounted = false);
    async function getData() {
      let result = await dataService.requestGET(Constants.apiBaseUrl);
      let lineParams = await dataService.requestGET(Constants.apiModelUrl + '?alpha=0.01&iterations=400');
      let scatterData = processDataset(result);
      let graphicData = prepLinearRegAnimation(lineParams.theta_history, scatterData);
      if (mounted) {
        setGraphicOptions(graphicData);
      }
    }
  }, []);

  /*
    const animate = () => {
        let frameNames = scatterGraphics.frames.map(frame => frame.name)
        Plotly.animate('graph', frameNames, {
            frame: {duration: 1000},
            transition: {duration: 10000, easing: 'linear'},
            mode: 'afterall'
        })
    } 
    */

  // Helper Function: Creates the Button on the Graphic that animates the training Process
  const getAnimationButton = (): Array<object> => {
    let frameNames = graphicOptions.frames.map(frame => frame.name);
    let transitionOptions = { frame: { duration: 1000 }, transition: { duration: 10000, easing: 'linear' }, mode: 'afterall' };

    return [
      {
        buttons: [
          {
            args: [frameNames, transitionOptions],
            label: 'Train Model!',
            method: 'animate',
            execute: true,
          },
        ],
        direction: 'left',
        pad: { r: 0, t: 0 },
        showactive: true,
        type: 'buttons',
        x: 0,
        xanchor: 'left',
        y: 1.3,
        yanchor: 'top',
      },
    ];
  };

  return graphicOptions ? (
    <MDBContainer>
      <Plot
        data={graphicOptions.baseFrame}
        divId="graph"
        frames={graphicOptions.frames}
        layout={{
          width: 550,
          height: 400,
          margin: { t: 100 },
          title: 'Housing Price/ Profit',
          updatemenus: getAnimationButton(),
        }}
      />
    </MDBContainer>
  ) : (
    <div>LOADING</div>
  );
};

type AnimatedGraphicParams = {
  frames: Array<object>;
  baseFrame: Array<object>;
};

export default Scatter_With_Model;
