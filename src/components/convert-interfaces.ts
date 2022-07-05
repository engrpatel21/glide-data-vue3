import { GridCell, GridCellKind, Rectangle, SizedGridColumn, Theme } from '@glideapps/glide-data-grid';
import ImageWindowLoader from '@glideapps/glide-data-grid/dist/ts/common/image-window-loader';

export interface CustomCellDataDropDown {
    allowedValues: string[]
}

export interface GridValidationRules {
    ruleName: string,
    needCrossValidation: boolean,
    crossColumnValidationIds?: string[]
}

export interface ConvertGridColumns extends SizedGridColumn {
    validationRules?: GridValidationRules[];
    gridCellKind?: GridCellKind; // defaults to text GridCellKind.Text,
    customCell?: {
        type: CustomCellType // required if girdCell is set and not text
        data: CustomCellDataDropDown;
    }
}

export enum CustomCellType {
    DropdownCell = 'dropdown-cell',
    TextWithErrorCell = 'text-with-error-cell'
}

export interface DrawCustomCellCallbackArgs {
    ctx: CanvasRenderingContext2D;
    cell: GridCell;
    theme: Theme;
    rect: Rectangle;
    col: number;
    row: number;
    hoverAmount: number;
    hoverX: number | undefined;
    hoverY: number | undefined;
    highlighted: boolean;
    imageLoader: ImageWindowLoader;
    requestAnimationFrame: () => void;
}

export class EtlColumnMapping {
    sourceColumnName = '';
    targetColumnName = '';
    columnOrdinality = '';
    dataType = '';
    columnLength = '';
    columnScale = '';
    columnPrecision = '';
    isColumnNullable = '';
    sourceDataTypeId = '';
}

export interface ManualSchemaEntryGridRow extends EtlColumnMapping {
    key: number;
    errors: string[];
}
export class CellError {
    error: string | null = null;
    col: number = -1
}
export class DemoColumn {
    columnName = '';

    targetColumnName = '';

    columnDescription = '';

    cellError?: CellError = new CellError();
}

