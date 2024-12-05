// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React from 'react';

const StockChart = () => {
  
  return (
    <div>
      <iframe src="http://127.0.0.1:8000/stock_charts" height={"800px"} width={"1000px"} frameborder="0" 
      ></iframe>
    </div>
  );
};

export { StockChart };