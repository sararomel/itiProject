import React from 'react';
import { BsTwitter } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsFillClockFill } from "react-icons/bs";
import './TopNavBar.css';
const TopNavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" 
            data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <span className="nav-link myhover" ><AiFillFacebook /></span>
            </li>
            <li className="nav-item">
              <span className="nav-link myhover" ><BsTwitter /></span>
            </li>
            <li className="nav-item">
              <span className="nav-link myhover" ><BsPinterest /></span>
            </li>
            <li className="nav-item">
              <span className="nav-link myhover" ><BsInstagram /></span>
            </li>
            <li className="nav-item">
              <span className="nav-link text" >Welcome to MAHSOLY</span>
            </li>
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <span className="nav-link myhover right" ><BsFillEnvelopeFill /></span>
              </li>
              <li className="nav-item">
                <span className="nav-link myhover right" >Mahsoly@gmail.com</span>
              </li>
              <li className="nav-item">
                <span className="nav-link myhover right" ><BsFillClockFill /></span>
              </li>
              <li className="nav-item">
                <span className="nav-link myhover right" >Mon - Sat 8:00 - 6:30, Sunday - CLOSED</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
