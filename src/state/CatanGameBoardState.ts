import React from 'react';

import LineToDraw from '../models/LineToDraw'

enum CatanGameColor {
	RED,
	BLUE,
	YELLOW,
	WHITE,
}

type CatanGameBoardState = {
	roadsToDraw: Map<LineToDraw, CatanGameColor>
}

export default CatanGameBoardState