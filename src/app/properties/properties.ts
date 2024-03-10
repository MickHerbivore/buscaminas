import { Level } from "../interfaces/level.interface";

export const LEVELS: Level[] = [
    { name: 'Easy', rows: 8, cols: 8, mines: 10 },
    { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
    { name: 'Expert', rows: 16, cols: 30, mines: 99 }
];