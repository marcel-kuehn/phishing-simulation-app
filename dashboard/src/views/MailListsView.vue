<template>
    <div>
        "{{ maillistsStore.mailLists }}"
    </div>
</template>

<script setup lang="ts">
import { useMailListsStore } from '@/stores/mailLists';
import { onMounted } from 'vue';

const maillistsStore = useMailListsStore();

onMounted(() => {
    maillistsStore.getMailLists();
});
</script>