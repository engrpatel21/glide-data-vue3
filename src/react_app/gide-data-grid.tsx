import React, { FC } from 'react';

import DataEditor, { DataEditorProps, DrawCustomCellCallback, EditableGridCell, getMiddleCenterBias, GridCell, GridCellKind, GridColumn, Item, Theme, useCustomCells } from "@glideapps/glide-data-grid";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ConvertGridColumns, CustomCellType, DrawCustomCellCallbackArgs } from '../components/convert-interfaces'
import _ from 'lodash';
import { useExtraCells } from '@glideapps/glide-data-grid-cells';
// import DropDown from '../area/playground/components/grid-drop-down-cell';

interface ConvertGridProps {

    columns: ConvertGridColumns[];
    items: any[];
    height?: number;
}

const Title: FC<ConvertGridProps> = (props: ConvertGridProps) => {
    const defaultProps: Partial<DataEditorProps> = {
        smoothScrollX: true,
        smoothScrollY: true,
        isDraggable: false,
        onPaste: true,
        getCellsForSelection: true,
        rowMarkers: "number",
        width: "100%",
        height: _.toNumber(props.height) ?? 200, // default height

        keybindings: { // https://github.com/glideapps/glide-data-grid/blob/main/packages/core/API.md#keybindings
            search: true,
            downFill: true,
            copy: true,
            paste: true,
            pageDown: true,
            pageUp: true,
        }
    };



    const dataRef = React.useRef([...props.items]);

    const getRowThemeOverride = React.useCallback((row: number): Partial<Theme> | undefined => {
        if (row % 2 === 0) {
            return {
                bgCell: "#F9FDFF"
            }
        }
        return undefined;
    }, []);

    const getContent = React.useCallback((cell: Item): GridCell => {
        const [col, row] = cell;
        const dataRow = dataRef.current[row];
        const columnInfo = props.columns[col];
        const d = dataRow[columnInfo.id as string] as string;
        let theme: Partial<Theme> | undefined = undefined
        theme = {
            // accentColor: '#0000FF',
            // accentFg: '#0000FF',
            accentLight: '#0000FF'
        }
        if (columnInfo.gridCellKind === GridCellKind.Custom) {
            if (columnInfo.customCell?.type === CustomCellType.DropdownCell) {

                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: true,
                    // themeOverride: theme,
                    copyData: d,
                    data: {
                        kind: CustomCellType.DropdownCell,
                        allowedValues: columnInfo.customCell.data.allowedValues,
                        value: d,
                    },
                };
            }


        }



        return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            themeOverride: theme,
            allowWrapping: true,
            copyData: d,
            displayData: d as string,
            data: d as string,
        } as GridCell;


    }, []);

    const columns = React.useMemo<GridColumn[]>(() => {
        return props.columns
    }, []);

    const onCellEdited = React.useCallback((cell: Item, newValue: EditableGridCell) => {

        const [col, row] = cell;
        const columnInfo = props.columns[col];
        if (newValue.kind === GridCellKind.Text) {
            // we only have text cells, might as well just die here.

            dataRef.current[row][columnInfo.id] = newValue.data;


        } else if (newValue.kind === GridCellKind.Custom) {
            if (columnInfo.customCell?.type === CustomCellType.DropdownCell) {

                dataRef.current[row][columnInfo.id] = (newValue.data as any).value;
            }
        }
        // EventBus.$emit('test', { col, row, values: dataRef.current[row][columnInfo.id] })
    }, []);


    const drawCustomCell: DrawCustomCellCallback = React.useCallback((args: DrawCustomCellCallbackArgs) => {
        const { ctx, cell, rect, col, row, theme } = args
        if (cell.kind === GridCellKind.Loading) return false
        const columnInfo = props.columns[col - 1];
        const dataRow = dataRef.current[row];

        if (cell.kind === GridCellKind.Custom) {
            if (columnInfo.customCell?.type === CustomCellType.DropdownCell) {
                ctx.fillStyle = theme.textDark;
                ctx.fillText(
                    (cell.data as any).value,
                    rect.x + theme.cellHorizontalPadding,
                    rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
                );
            }
        }

        if (cell.kind === GridCellKind.Text) {
            ctx.save();
            const { x, y, width, height } = rect;
            const data = cell.displayData;

            const hasError = !!dataRow.cellError.find(error => error.col === col - 1 && dataRow._itemKey === row)

            if (hasError) {

                for (const error of dataRow.cellError) {
                    if (error.col === (col - 1) && dataRow._itemKey === row) {
                        ctx.fillStyle = '#FFEBEE'
                        ctx.fillRect(x + 1, y + 1, width - 1, height - 1);
                        ctx.textBaseline = 'bottom'
                        ctx.fillStyle = '#FF0000'
                        ctx.fillText(data, x + 8 + 0.5, y + height / 2 + 4.5);
                        ctx.textBaseline = 'top'
                        ctx.font = '.75rem Roboto'
                        ctx.fillText(error.error, x + 8 + 0.5, y + height / 2 + 4.5)
                    }
                }
            } else {
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(x + 1, y + 1, width - 1, height - 1);
                ctx.fillStyle = '#000000'
                ctx.fillText(data, x + 8 + 0.5, y + height / 2 + 4.5);
            }


            ctx.restore();

        }

        return true;
    }, [])
    // const { drawCell, provideEditor } = useExtraCells();
    const { drawCell, provideEditor } = useCustomCells([DropDown])
    return (
        <>

            <DataEditor {...defaultProps}
                getCellContent={getContent}
                onCellEdited={onCellEdited}
                columns={columns}
                rows={dataRef.current.length}
                onPaste={true}
                drawCell={drawCustomCell}
                provideEditor={provideEditor}

            />

        </>
    );
};

export default Title;
