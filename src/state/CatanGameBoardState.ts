import React from 'react';

import LineToDraw from '../models/LineToDraw'
import {CatanGameColor} from '../models/CatanGameColor'

export type CatanGameBoardState = {
	roadsToDraw: Map<LineToDraw, CatanGameColor>
}
