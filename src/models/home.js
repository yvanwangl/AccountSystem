
export default {

    namespace: 'home',

    state: {
        activeIndex:0,
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location=>{
                dispatch({
                    type:'updateActiveIndex',
                    payload: location.pathname
                });
            });
        },
    },

    reducers: {
        updateActiveIndex(state, action){
            let pathname = action.payload;
            let activeIndex = 0;
            switch(pathname){
                case '/':
                    activeIndex=0;
                    break;
                case '/orders':
                    activeIndex=1;
                    break;
                case '/storage':
                    activeIndex=2;
                    break;
                case '/stock':
                    activeIndex=3;
                    break;
                case '/funds':
                    activeIndex=4;
                    break;
                case '/manage':
                    activeIndex=5;
                    break;
                default:
                    break;
            }
            return {...state, activeIndex:activeIndex};
        }
    },

}
