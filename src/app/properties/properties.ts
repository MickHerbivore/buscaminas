import { Level } from "../interfaces/level.interface";

export const LEVELS: Level[] = [
    { id: '', name: 'Easy', rowsQuantity: 8, columnsQuantity: 8, minesQuantity: 10 },
    { id: '', name: 'Intermediate', rowsQuantity: 16, columnsQuantity: 16, minesQuantity: 40 },
    { id: '', name: 'Expert', rowsQuantity: 16, columnsQuantity: 30, minesQuantity: 99 }
];

export const STORAGE_GAME_ID = 'game-id';

export const ACTION_FLAG = 'FLAG'
export const ACTION_ROTATE = 'ROTATE';