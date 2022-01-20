import './Login.css';
import Avatar from '../../public/images/avatar.svg';
import { FaLock} from 'react-icons/fa';
import {ImPhone} from 'react-icons/im'
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class Login extends Component {

  componentDidMount(){
    const inputs = document.querySelectorAll(".input-login");
    function addcl(){
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }
    function remcl(){
      let parent = this.parentNode.parentNode;
      if(this.value === ""){
        parent.classList.remove("focus");
      }
    }
    inputs.forEach(input => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  }
  render() {
    return (
      <div className="container-fluid login-components mt-5 d-flex justify-content-center">
      <div className="login-content">
			<form className="login-form-component">
				<img src={Avatar} alt='' />
				<h2 className="title-login" >Login</h2>
				<div className="input-div-login one">
					<div className="i">
						<ImPhone className="icon fas fa-user" />
					</div>
					<div className="div">
						<h5>Mobile Number</h5>
						<input type="text" className="input-login" />
					</div>
				</div>
				
				<div className="input-div-login pass">
					<div className="i">
						<FaLock className="icon fas fa-lock" />
					</div>
					<div className="div">
						<h5>Password</h5>
						<input type="password" className="input-login" />
					</div>
				</div>
				<span className='forget-password-login' href="#">Forgot Password?</span>
				<input type="submit" className="btn-login" value="Login" />
        <Link to="/Register" className='register-link'><input className="btn-login" type='button' value="Register" /></Link>
			</form>
		</div>
  </div>
    );
  }
}

export default Login;
