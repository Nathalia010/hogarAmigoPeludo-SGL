

const title = document.getElementsByTagName('title')[0].textContent;

const pageList = document.getElementById('ul-navbar').children;

for (let page of pageList) {
    if (page.innerText === title) {
        page.setAttribute('style', 'text-shadow: 0 4px 8px #3861FC;');
    }
}

