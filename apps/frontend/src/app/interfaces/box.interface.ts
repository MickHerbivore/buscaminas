export interface Box {
    id: string;
    row: number;
    column: number;
    isFlagged: boolean;
    isRotated: boolean;
    minesAroundQuantity: number | null;
    hasMine?: boolean;
}
