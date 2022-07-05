<template>
    <div>

        <react-glide-grid-component :columns="columns" :items="localItems" :height="height" />

    </div>
</template>

<script lang="ts">

import { applyReactInVue } from 'veaury'
import ReactGlideGridComponent from '../react_app/gide-data-grid';
import { CellError, ConvertGridColumns, GridValidationRules } from './convert-interfaces';
import { } from 'vee-validate';
import InputWatcher from './input-watcher.vue';
import { defineComponent } from 'vue'

interface ItemWithKey {
    _itemKey: number;
    cellError: CellError[]
    [x: string]: any;
}

const glideGrid = applyReactInVue(ReactGlideGridComponent)

export default defineComponent({
    name: 'grid-wrapper',
    props: {
        columns: {
            type: Array,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            default: 200,
            required: false,
        }
    },
    data: () => ({

        localItems: [] as ItemWithKey[],
        value: ''

    }),

    async created() {
        this.setLocalList()

    },
    methods: {
        async test(event) {

            // const { col, row, value } = event;
            // console.log(this.$refs)
            // const result = await (this.$refs as InstanceType<typeof ValidationObserver>)[row][col].validate(value);
            // if (!result.valid) {
            //     this.localItems[row].cellError = { error: result.errors, col, row }
            // } else {
            //     this.localItems[row].cellError = null
            // }
            // console.log(this.localItems[row])



        },
        async reset(col, row, item) {
            const result = await (this.$refs as InstanceType<typeof ValidationObserver>)[row][col].validate();
            console.log('result', result)
            if (!result.valid) {
                this.localItems[row].cellError.push({ error: result.errors[0], col})
            } else {
                const errorIndex = this.localItems[row].cellError.findIndex(error => error.col === col)
                if (errorIndex >= 0) {
                    this.localItems[row].cellError.splice(errorIndex, 1)
                } 
            }
            console.log('items', this.localItems[row])
        },
        // onFinishEdit() {
        //     (this.$refs.gridObserver as InstanceType<typeof ValidationObserver>).validate()

        // },
        getValidationRules(validationRules: GridValidationRules[] | undefined, item) {
            const rules = {} as any
            if (validationRules) {
                for (const rule of validationRules) {
                    rules[`${rule.ruleName}`] = this.getParameters(item);

                }
            }
            return rules
        },
        getParameters(item) {
            const parameters = {}
            for (const [key, value] of Object.entries(item)) {
                parameters[`${key}`] = `@${key}-${item._itemKey}`
            }
            return parameters
        },
        updateErrors(event) {
            // console.log('errors', event)      
        },
        async setLocalList() {

            //TODO: may need to rework based on update loop.
            if (!this.localItems.length) {
                this.localItems = this.items.map<ItemWithKey>((item, i) => ({
                    _itemKey: i,
                    cellError: [],
                    ...item
                }))

            } else {
                this.localItems = this.items.map((item, i) => ({ _itemKey: i, ...item }))
            }

        },
        async validateGrid() {

            const isValid = await (this.$refs.gridObserver as InstanceType<typeof ValidationObserver>).validate();
            console.log(isValid)
            if (isValid) {
                try {
                    console.log('its valid')
                } catch (err) {
                    console.error('its not valid')
                }
            }
        }
    },
    watch: {

        // items: {
        //     handler(newValue, oldValue) {
        //         this.setLocalList();
        //     },
        //     deep: true,
        // },
    },


    /* data, methods, etc */
    components: {
        glideGrid,
        InputWatcher,
    },
});
</script>
