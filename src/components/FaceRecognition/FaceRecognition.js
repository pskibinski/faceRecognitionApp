import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ url, box }) => {
	return(	
			<div className='relative imgContainer'>
				<img id='inputImage' className='br4' alt='' src={url} width='500px' height='auto' />
				<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
			</div>	
	)
}

export default FaceRecognition;