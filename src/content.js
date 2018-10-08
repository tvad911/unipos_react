import React from 'react';
import ReactDOM from 'react-dom';
import UserDetail from 'Components/user-detail/user-detail';
import registerServiceWorker from './registerServiceWorker';
import commons from 'Utils/commons';
import {dispatch} from 'Utils/helpers';

function run() {
    ReactDOM.render(<UserDetail />, document.getElementById('user_detail_wrapper'));
    registerServiceWorker();
}

let user_detail_wrapper = document.createElement('div');
user_detail_wrapper.setAttribute('id', 'user_detail_wrapper');
document.getElementById('content').appendChild(user_detail_wrapper);

chrome.runtime.onMessage.addListener((params) => {
    if (params.message === 'onPageLoad') {
        if (window.location.href.indexOf(commons.BASE_URL) != -1) {
            let urlParams = window.location.href.replace(commons.BASE_URL, '').split("?")[1];
            if (urlParams !== null && urlParams !== undefined) {
                let currentUserId = urlParams.split("=")[1];
                let route = dispatch();
                if (Object.keys(route).length) {
                    const loadedStates = ['complete', 'loaded', 'interactive'];
                    if (loadedStates.includes(document.readyState) && document.body) {
                        run();
                    } else {
                        window.addEventListener('DOMContentLoaded', run, false);
                    }

                    let action = route.action;
                    let controller = route.controller.substring(route.controller.lastIndexOf('/') + 1);
                    controller = controller.charAt(0).toLowerCase() + controller.slice(1);
                    controllers.default[controller][action]();
                }
            }
        }
    }
});

chrome.runtime.sendMessage({ message: "onPageLoad" });