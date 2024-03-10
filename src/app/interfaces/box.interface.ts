export interface Box {
    row: number;
    col: number;
    hasMine: boolean;
    isFlagged: boolean;
    isRotated: boolean;
    numberOfMinesAround: number;
    
}