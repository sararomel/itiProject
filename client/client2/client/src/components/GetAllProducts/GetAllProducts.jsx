import React, { Component } from 'react'
import './GetAllProducts.css';
import {BiUserCircle, BiChevronLeft, BiChevronRight} from 'react-icons/bi';
import {FaRegComments} from 'react-icons/fa';
import {BsCart} from "react-icons/bs";
import {IoEyeOutline} from 'react-icons/io5';
import {FiHeart} from 'react-icons/fi';
import {AiOutlinePlusCircle, AiFillDelete} from 'react-icons/ai'; // 
import {MdUpdate} from 'react-icons/md';
import {BsCurrencyDollar} from 'react-icons/bs';
import {Link} from 'react-router-dom';
export default class GetAllProducts extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      image: ''
    }
  }
  

  handleImage = (img) =>{
		const reader = new FileReader();
		reader.onload = ()=>{
			if(reader.readyState === 2){
				this.setState({
					image : reader.result
				})
			}
		}
		reader.readAsDataURL(img)
	}
  render() {
    return (
      <div className='container get-all-products'>
        <div className="row">
          {
            this.props.crops.map((crop)=>{
              let userDate = new Date(crop.createdAt).toString().split(' ');
              return (
                <div className="col-lg-4 mb-5 product" key={crop._id}>
                  <img className='mb-2' alt='' src={crop.images} />
                  <BiUserCircle className='fs-5 mb-1 shape'/> <span className="me-2 shape-span">by {crop.Owner.name}</span>
                  <FaRegComments className='fs-5 mb-1 shape'/> <span className="me-2 shape-span">{crop.comments.length} Comments</span>
                  <BsCurrencyDollar className='fs-5 mb-1 shape'/> <span className="me-2 shape-span">{crop.price} dollar</span>
                  <h3 className='mt-2'>{crop.description}</h3>
                  <div className="date">
                    <h5><span className="text-center ms-1 fw-bolder">{userDate[2]}</span> <br /><span className='text-center fw-bolder'>{userDate[1]}</span></h5>
                  </div>
                  <div className="buy-see-love text-center">
                    <Link to="/singleProduct"><FiHeart className='me-1'/></Link>
                    <Link to={`/SingleProduct/${crop._id}`}><IoEyeOutline className='me-1' /></Link>
                    <Link to="/singleProduct"><BsCart className='me-1'/></Link>
                    <Link to="/singleProduct"><MdUpdate className='me-1'/></Link>
                    <Link to="/singleProduct"><AiFillDelete className='me-1'/></Link>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='add-product text-center mb-4'>
          <Link to="/addProducts">
            <button className='btn btn-success fw-bolder'> 
              <AiOutlinePlusCircle className='mb-2 me-2 fw-bolder fs-2'/>Add Product
            </button>
          </Link>
        </div>
        <div className="pages text-center d-flex align-items-center justify-content-center">
          <BiChevronLeft className='me-2'/>
          <div className="one me-2 active">1</div>
          <div className="two me-2">2</div>
          <div className="three me-2">3</div>
          <div className="four me-2">4</div>
          <div className="five me-2">5</div>
          <BiChevronRight className='me-2'/>
        </div>
      </div>
    )
  }
}
