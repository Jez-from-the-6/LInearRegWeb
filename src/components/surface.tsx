import React, { useState, useEffect } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import { dataService } from '../../../../Routing/utilities/data.service';
import Constants from '../../../../shared/utils/textConstants';
import { MDBContainer } from 'mdbreact';
import { APICostSurfaceParams } from '../../../../shared/utils/types';
import Plot from 'react-plotly.js';

/**
 * @description Uses the values from the API to create a Surface Plot of the Cost Function
 * of the Regression Model
 */
export const Surface_Costfunction = (): JSX.Element => {
  const [graphicOptions, setGraphicOptions] = useState(null);

  useAsyncEffect(async isMounted => {
    const surfaceParams: APICostSurfaceParams = await dataService.requestGET(Constants.apiSurfaceUrl);
    if (!isMounted()) return;

    const graphicData = [
      {
        x: surfaceParams.theta1_vals,
        y: surfaceParams.theta0_vals,
        z: surfaceParams.J_vals,
        type: 'surface',
      },
    ];

    setGraphicOptions(graphicData);
  }, []);

  return graphicOptions ? (
    <Plot
      data={graphicOptions}
      layout={{
        width: 550,
        height: 400,
        title: 'Average Prediction Error as a Function of the Linear Model',
      }}
    />
  ) : (
    <div>LOADING</div>
  );
};

export default Surface_Costfunction;
