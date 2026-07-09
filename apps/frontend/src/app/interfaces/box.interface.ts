export interface Box {
    id: string;
    row: number;
    column: number;
    isFlagged: boolean;
    isRotated: boolean;
    minesArroundQuantiy: number | null;
    hasMine?: boolean;
}
