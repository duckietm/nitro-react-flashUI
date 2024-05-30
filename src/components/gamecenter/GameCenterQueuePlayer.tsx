import { useRef, useState } from 'react';
import Overlay from 'react-bootstrap/esm/Overlay';
import { LayoutAvatarImageView } from '../../common';

const GameCenterQueuePlayer = (props) => {
  const [showContext, setShowContext] = useState(false);
  const target = useRef(null);

  return (
    <>
      <div ref={target} className='col-md-2 mt-2' style={{cursor: "pointer"}}>
        <div onMouseEnter={() => setShowContext(true)} onMouseLeave={() => setShowContext(false)} className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
            <LayoutAvatarImageView style={{position: "absolute", marginLeft: "-45px", marginTop: "-46px"}} figure={ props.figure } headOnly={ true } direction={ 2 } />
        </div>
      </div>
      {showContext && 
        <Overlay target={target.current} show={true} placement="top">
          {({ placement, arrowProps, show: _show, popper, ...propis }) => (
            <div
              {...propis}
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0, 0.85)',
                padding: '2px 10px',
                color: 'white',
                zIndex: 99999999,
                borderRadius: 3,
                ...propis.style,
              }}
            >
              {props.name}
            </div>
          )}
        </Overlay>
      }
    </>
  )
}

export default GameCenterQueuePlayer
