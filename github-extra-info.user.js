// ==UserScript==
// @name         github-extra-info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add ⌛creation date/🍴forks/📁 repo size to repo search result page,code search page and repo detail page.
// @author       CXXN008
// @match        *://github.com/*/*
// @match        *://github.com/search*
// @source       https://github.com/CXXN008/github-repo-info
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        window.onurlchange
// @license      MIT

// ==/UserScript==


(function () {
    'use strict';
    // github free rates are limited to 5000 / hour ,if u get some errors in console , try https://github.com/settings/tokens -> Generate new token & paste here
    const API_TOKEN = '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'
    const STYLE = ``

    const PAGE_SELECTOR = { 'search': 'li.repo-list-item> div > div> div > a.v-align-middle', 'repo': 'strong.mr-2 > a:nth-child(1)', 'code': '.Link--secondary' }

    const getPageType = (urlParams) => {
        const q = urlParams.get("q")?.toLocaleLowerCase();
        const type = urlParams.get("type")?.toLocaleLowerCase();
        if(q){
            if(type === 'code'){
                return 'code'
            }else{
                return 'search'
            }
        }else {
            return 'repo'
        }
    }


    window.onurlchange = (c) => {
        // console.log(c)
        const params = {
            "headers": {
                "authorization": `token ${API_TOKEN}`,
            }
        }

        const pageType = getPageType(new URLSearchParams(location.search))
        // console.log(pageType)
        document.querySelectorAll(PAGE_SELECTOR[pageType]).forEach(async e => {
            const p = e.parentElement
            let span = p.querySelector(`#my-span-tag`)
            if (span === null) {
                span = document.createElement('span')
                span.id = 'my-span-tag'
                span.style = STYLE
                span.innerText = '... ...'
                p.append(span)
            }

            const j = (await (await fetch(`https://api.github.com/repos${e.getAttribute('href')}`, params)).json())

            const date = j.created_at.split('T')[0]
            const size = (j.size / 1024).toFixed(2)
            const forks = j.forks_count

            span.innerText = `/⌛${date}/🍴${forks}/📁${size}MB`




        })
    }

})();