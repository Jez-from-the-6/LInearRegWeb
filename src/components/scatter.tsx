import React, { useState, useEffect } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import { dataService } from '../../../../Routing/utilities/data.service';
import Constants from '../../../../shared/utils/textConstants';
import { MDBContainer } from 'mdbreact';
import Plot from 'react-plotly.js';

export const Main = (): JSX.Element => {
  const [scatterGraphics, setScatterGraphics] = useState(null);

  const processDataset = data => {
    console.log(data);
    let x = [];
    let y = [];
    Object.keys(data).map(key => {
      let current = data[key];
      x.push(current[0]);
      y.push(current[1]);
    });

    return { x, y };
  };

  const processTheta = theta => {
    let x = [];
    let y = [];
    for (var i = 0; i < 22; i++) {
      x.push(i);
      y.push(theta[0][0] + theta[1][0] * i);
    }
    return { x, y };
  };

  useAsyncEffect(async isMounted => {
    const data = await dataService.requestGET(Constants.apiBaseUrl);
    if (!isMounted()) return;

    const lineParams = await dataService.requestGET(Constants.apiModelUrl + '?alpha=0.01&iterations=400');
    if (!isMounted()) return;

    const scatterData = processDataset(data);
    const lineData = processTheta(lineParams.theta);
    const graphicData = [
      {
        x: scatterData['x'],
        y: scatterData['y'],
        type: 'scatter',
        mode: 'markers',
        marker: { color: 'purple' },
      },
      {
        x: lineData['x'],
        y: lineData['y'],
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'blue' },
      },
    ];

    setScatterGraphics(graphicData);
  }, []);

  return scatterGraphics ? (
    <MDBContainer>
      <Plot
        data={scatterGraphics}
        layout={{
          width: 550,
          height: 400,
          title: 'A Fancy Plot',
        }}
      />
    </MDBContainer>
  ) : (
    <div>LOADING</div>
  );
};

export default Main;
