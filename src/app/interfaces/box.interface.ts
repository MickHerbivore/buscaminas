export interface Box {
    row: number;
    col: number;
    hasMine: boolean;
    isFlagged: boolean;
    isRotated: boolean;
    numberOfMinesAround: number;
}

export interface PatchBox {
    row: number;
    col: number;
    isFlagged: boolean;
    isRotated: boolean;
}