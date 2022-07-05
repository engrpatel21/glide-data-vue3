<template>
    <div>
        react in vue with [vuera](https://github.com/akxcv/vuera)

        <grid-wrapper :columns="columns" :items="items" :height="300" />

    </div>
</template>

<script lang="ts">
import { GridCellKind } from '@glideapps/glide-data-grid';
import GridWrapper from './grid-wrapper.vue';
import {
    ConvertGridColumns, CustomCellType, DemoColumn,
} from './convert-interfaces';


export default {

    data: () => ({

        columns: [
            {
                title: 'Column Name',
                id: 'columnName',
                width: 200,
                validationRules: [
                    {
                        ruleName: 'valid_column_name',
                        needsCrossValidation: true
                    }
                ],
            },
            {
                title: 'Target Column Name',
                id: 'targetColumnName',
                width: 200,
                validationRules: [
                    {
                        ruleName: 'valid_column_name',
                        needsCrossValidation: true
                    }
                ],
            },
            {
                title: 'Description',
                id: 'columnDescription',
                width: 200,
                gridCellKind: GridCellKind.Custom,
                customCell: {
                    data: { allowedValues: ['var', 'int', 'bigint', 'float'] },
                    type: CustomCellType.DropdownCell
                }
            },

        ] as ConvertGridColumns[],
        items: [
            {
                columnName: 'name', targetColumnName: '', columnDescription: 'varchar', columnType: 'varchar',
            },
            {
                columnName: '1t', targetColumnName: '', columnDescription: 'varchar', columnType: 'varchar',
            },
            {
                columnName: 'createdDate', targetColumnName: 'CREATED_DATE', columnDescription: 'varchar',
            },
        ] as DemoColumn[],
    }),
    methods: {

    },

    /* data, methods, etc */
    components: { GridWrapper },
};
</script>
