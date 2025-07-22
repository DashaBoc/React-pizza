import React from "react"
import ContentLoader from "react-content-loader"

const Breadboard = () => (
  <ContentLoader 
  className="pizza-block"
    speed={2}
    width={280}
    height={500}
    viewBox="0 0 280 500"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  
  >
    <rect x="20" y="6" rx="135" ry="125" width="225" height="212" /> 
    <rect x="126" y="243" rx="0" ry="0" width="1" height="0" /> 
    <rect x="-1" y="270" rx="10" ry="10" width="280" height="88" /> 
    <rect x="1" y="382" rx="10" ry="10" width="95" height="30" /> 
    <rect x="1" y="235" rx="15" ry="15" width="280" height="22" /> 
    <rect x="121" y="372" rx="25" ry="25" width="152" height="45" />
  </ContentLoader>
)

export default Breadboard;

