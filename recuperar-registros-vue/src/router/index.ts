import { createRouter, createWebHistory } from 'vue-router';
import FormView from '../views/FormView.vue';
import RecordsView from '../views/RecordsView.vue';

const routes = [
    {
        path: '/',
        name: 'Form',
        component: FormView
    },
    {
        path: '/records',
        name: 'Records',
        component: RecordsView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;