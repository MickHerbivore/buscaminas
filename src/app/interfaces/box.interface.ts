export interface Box {
    x: number;
    y: number;
    hasMine: boolean;
    isFlagged: boolean;
    isRotated: boolean;
    numberOfMinesAround: number;
    
}