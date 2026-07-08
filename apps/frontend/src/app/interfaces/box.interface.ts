export interface Box {
    id: string;
    row: number;
    column: number;
    hasMine: boolean;
    isFlagged: boolean;
    isRotated: boolean;
    minesArroundQuantiy: number;
}

export interface PatchBox {
    row: number;
    column: number;
    isFlagged: boolean;
    isRotated: boolean;
}