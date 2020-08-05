import { SET_DATA } from './mutation-types';

export default {
    /**
    *
    * @param { StoreState } state
    * @param { string } data
    */
    [SET_DATA](state, { data }) {
        state.data = data;
    },
};
