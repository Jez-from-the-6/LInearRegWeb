import React, { useState, useEffect } from 'react';
import { dataService } from '../../skeleton/Routing/utilities/data.service';
import Constants from '../../skeleton/shared/utils/textConstants';
import { MDBContainer } from 'mdbreact';
import { APICostSurfaceParams } from '../../skeleton/shared/utils/types';
import Plot from 'react-plotly.js';

/**
 * @description Uses the values from the API to create a Surface Plot of the Cost Function
 * of the Regression Model
 */
export const Surface_Costfunction = (): JSX.Element => {
  const [graphicOptions, setGraphicOptions] = useState(null);

  useEffect(() => {
    let mounted = true;
    getData();
    return () => (mounted = false);

    async function getData() {
      let surfaceParams: APICostSurfaceParams = await dataService.requestGET(Constants.apiSurfaceUrl);
      let graphicData = [
        {
          x: surfaceParams.theta1_vals,
          y: surfaceParams.theta0_vals,
          z: surfaceParams.J_vals,
          type: 'surface',
        },
      ];

      if (mounted) {
        setGraphicOptions(graphicData);
      }
    }
  }, []);

  return graphicOptions ? (
    <MDBContainer>
      <Plot
        data={graphicOptions}
        layout={{
          width: 550,
          height: 400,
          title: 'Average Prediction Error as a Function of the Linear Model',
        }}
      />
    </MDBContainer>
  ) : (
    <div>LOADING</div>
  );
};

export default Surface_Costfunction;
