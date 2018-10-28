import React from 'react';
import Prominent from './Prominent';

import './App.css';

const image = 'https://images.unsplash.com/photo-1540456348453-e29a1b8555b8?auto=format&fit=crop&w=800&q=80'

export default () => (
  <Prominent image={image}>
    {({swatches, image}) => {

      const colors = [...swatches].map(([name, swatch]) => swatch.getHex());

      return (
        <div className="App">

          <div className="App-color" style={{
            backgroundImage: `radial-gradient(farthest-corner at 40px 40px, ${colors[1]} 0%, ${colors[0]} 100%)`
          }}>
            <img src={image} className="App-logo" alt="" />
            <h1>Gradient</h1>
            <p>Extract prominent colors from an image.</p>
          </div>
      
          <header className="App-header">
            {[...swatches].map(([name, swatch], index) => (
              <div className="App-color" key={index} style={{backgroundColor: swatch.getHex()}}>
                <img src={image} className="App-logo" alt="" />

                <h1 style={{color: swatch.getTitleTextColor()}}>
                  {name}
                </h1>

                <p style={{color: swatch.getBodyTextColor()}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </header>

        </div>
      )
    }}
  </Prominent>
);
