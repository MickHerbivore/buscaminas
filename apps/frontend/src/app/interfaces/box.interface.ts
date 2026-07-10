export interface Box {
    id: string;
    row: number;
    column: number;
    isFlagged: boolean;
    isRevealed: boolean;
    minesAroundQuantity: number | null;
    hasMine?: boolean;
}
