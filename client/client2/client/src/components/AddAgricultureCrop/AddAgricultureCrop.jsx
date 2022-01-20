import React, { Component } from 'react'
import {IoMdArrowDropdown} from 'react-icons/io';
import {AiOutlinePlus} from 'react-icons/ai';
import './AddAgricultureCrop.css';
export default class AddAgricultureCrop extends Component {
  constructor(props) {
    super(props)
    this.cropNameArrow = React.createRef();
    this.cropNames = React.createRef();
    this.isCropNameOpened = false;
    this.cropBox = React.createRef();
    this.measurement = React.createRef();
    this.measurementBox = React.createRef();
    this.measurementArrow = React.createRef();
    this.isMeasurementArrowOpened = false;
  }
  
  handleClick(){
    this.cropNames.current.style.display = (this.isCropNameOpened === false ? 'block' : "none");
    this.isCropNameOpened = !this.isCropNameOpened;
  }

  handleClickMeasurement(){
    this.measurement.current.style.display = (this.isMeasurementArrowOpened === false ? 'block' : "none");
    this.isMeasurementArrowOpened = !this.isMeasurementArrowOpened;
  }

  changeCropName = (cropName) =>{
    this.cropBox.current.innerHTML = cropName;
    this.handleClick();
  }

  changeMeasurement = (measurement) => {
    this.measurementBox.current.innerHTML = measurement;
    this.handleClickMeasurement();
  }
  
  render() {
    return (
      <div className="agriculture-crops" >
        <h2 className='mb-3 fw-bolder'>Agriculture Crops</h2>
        <form action="" method='post'>
          <div className="d-flex align-items-center justify-content-between">
            <div className='selected-box quantity mb-3'>
              <div className='select-parent'>
                <div className='mt-2 selected'><span ref={this.cropBox}>Crop Name </span> <IoMdArrowDropdown refs={this.cropNameArrow} className='ms-3 mb-1 bottom-arrow' onClick={()=> this.handleClick()}/></div>
                <div className="crop-names" ref={this.cropNames}>
                  <div onClick={()=> this.changeCropName('Banana')}>Banana</div>
                  <div onClick={()=> this.changeCropName('Apple')}>Apple</div>
                  <div onClick={()=> this.changeCropName('Carrot')}>Carrot</div>
                  <div onClick={()=> this.changeCropName('Strawberry')}>Strawberry</div>
                  <div onClick={()=> this.changeCropName('Corn')}>Corn</div>
                </div>
              </div>
            </div>
            <div className='selected-box quantity-id mb-3'>
              <div className='select-parent'>
                <input className='mt-2 selected' placeholder='Price' type='number' /> 
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className='selected-box quantity mb-3'>
              <div className='select-parent'>
                <input className='mt-2 selected' placeholder='Quantity' type='number' /> 
              </div>
            </div>
            <div className='selected-box quantity-id mb-3'>
              <div className='select-parent'>
                <div className='mt-2 selected'><span ref={this.measurementBox}>Measurement </span> <IoMdArrowDropdown refs={this.measurementArrow} className='ms-3 mb-1 bottom-arrow' onClick={()=> this.handleClickMeasurement()}/></div>
                <div className="crop-names" ref={this.measurement}>
                  <div onClick={()=> this.changeMeasurement('Ton')}>Ton</div>
                  <div onClick={()=> this.changeMeasurement('Kilo Gram')}>Kilo Gram</div>
                  <div onClick={()=> this.changeMeasurement('Ardib')}>Ardib</div>
                  <div onClick={()=> this.changeMeasurement('Sack')}>Sack</div>
                  <div onClick={()=> this.changeMeasurement('Piece')}>Piece</div>
                  <div onClick={()=> this.changeMeasurement('Box')}>Box</div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className='selected-box location-longitude mb-3'>
              <div className='select-parent'>
                <input className='mt-2 selected' placeholder='Location Longitude' type='number' /> 
              </div>
            </div>
            <div className='selected-box location-latitude mb-3'>
              <div className='select-parent'>
                <input className='mt-2 selected' placeholder='Location Latitude' type='number' /> 
              </div>
            </div>
          </div>
          <div className='selected-box mb-3'>
            <div className='select-parent'>
              <div className='mt-2 selected'><span>Choose Images </span> <AiOutlinePlus className='ms-3 mb-1 bottom-arrow'/></div>
            </div>
          </div>
          <textarea placeholder='Write Description' rows="5" className=' mb-3'></textarea>
          <button className='agriculture-crop-submit btn btn-success fw-bolder'>Add Agriculture Crop</button>
        </form>
      </div>
    )
  }
}
