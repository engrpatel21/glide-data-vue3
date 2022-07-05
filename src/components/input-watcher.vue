<template>
    <div>
    </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue'

export default defineComponent({
    name: 'input-watcher',
    props: ['value'],
    watch: {
        value() {
            this.$emit('changed')
        }
    }
})

</script>
