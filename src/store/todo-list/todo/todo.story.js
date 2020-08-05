import Todo from './todo.vue';

export default { title: 'todo' };

export const component = () => ({
    components: { Todo },
    props: {

    },
    template: '<todo />',
});
