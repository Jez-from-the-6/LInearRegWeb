import React from 'react';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import LinRegImg from "../../images/LinReg.png";

const CardExample = () => {
  return (
    <MDBRow>
      <MDBCol md='2'>
        <MDBCard>
          <MDBCardImage
            top
            src={LinRegImg}
            overlay='white-slight'
            hover
            waves
            alt='MDBCard image cap'
          />
          <MDBCardBody className='elegant-color white-text rounded-bottom'>
            <MDBCardTitle>Linear Regression</MDBCardTitle>
            <hr className='hr-light' />
            <MDBCardText className='white-text'>
              Explore how to use data to get the most accurate linear prediction function
            </MDBCardText>
            <a href='/intro' className='black-text d-flex justify-content-end'>
              <h5 className='white-text'>
                To the Project
                <MDBIcon icon='angle-double-right' className='ml-2' />
              </h5>
            </a>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  )
}

export default CardExample;