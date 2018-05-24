import * as Mustache from "mustache";

if (sessionStorage.getItem('key') === null) {
    location = 'login.html';
}

const key = parseInt(sessionStorage.getItem('key'), 10);
sessionStorage.removeItem('key');

const grade = parseInt(sessionStorage.getItem('grade'), 10);
sessionStorage.removeItem('grade');

const cache = JSON.parse(sessionStorage.getItem('cache'));

loadTemplate();

let voteBody;
let voteSubmitButton;
let voteBackButton;
let voteForm;
let choose2Tab;
let choose1MTab;
let choose1FTab;
let choose2Bar;
let choose1MBar;
let choose1FBar;
let doneIcon2;
let doneIcon1M;
let doneIcon1F;
let voteRadioButtons;
let voteSnackbar;
let voteSnackbarText;

let voted = false;

async function loadTemplate() {
    const response = await fetch(new Request('vote-template.mst'));
    const template = await response.text();

    const candidateNames1M = cache.candidateNames.candidateNames1M;
    const candidateNames1F = cache.candidateNames.candidateNames1F;
    const candidateNames2 = cache.candidateNames.candidateNames2;
    const abstention1M = candidateNames1M.includes('기권');
    const abstention1F = candidateNames1F.includes('기권');
    const abstention2 = candidateNames2.includes('기권');


    if (abstention1M) {
        remove(candidateNames1M, '기권');
    }
    if (abstention1F) {
        remove(candidateNames1F, '기권');
    }
    if (abstention2) {
        remove(candidateNames2, '기권');
    }

    const candidateNames2Objects = candidateNames2.map(e => ({original: e, split: e.split(', ')}));
    const rendered = Mustache.render(template, {
        candidateNames1M,
        candidateNames1F,
        candidateNames2Objects,
        abstention1M,
        abstention1F,
        abstention2,
        firstGrade: grade === 1
    });

    voteBody = document.getElementById('vote-body');
    voteBody.innerHTML += rendered;

    voteSubmitButton = document.getElementById('vote-submit');
    voteBackButton = document.getElementById('vote-back');
    voteForm = document.getElementById('vote-form');
    choose2Tab = document.getElementById('choose2');
    choose1MTab = document.getElementById('choose1M');
    choose1FTab = document.getElementById('choose1F');
    choose2Bar = document.getElementById('choose2-bar');
    choose1MBar = document.getElementById('choose1M-bar');
    choose1FBar = document.getElementById('choose1F-bar');
    doneIcon2 = document.getElementById('done-icon2');
    doneIcon1M = document.getElementById('done-icon1M');
    doneIcon1F = document.getElementById('done-icon1F');
    voteRadioButtons = document.getElementsByClassName('vote-radio');
    voteSnackbar = document.getElementById('vote-snackbar');
    voteSnackbarText = document.getElementById('vote-snackbar-text');

    voteSubmitButton.addEventListener('click', async function(e) {
        const formData = new FormData(voteForm);

        const candidateNameToVote2 = formData.get('candidateNameToVote2');
        const candidateNameToVote1M = formData.get('candidateNameToVote1M');
        const candidateNameToVote1F = formData.get('candidateNameToVote1F');
        if (!candidateNameToVote2) {
            choose2Tab.classList.add('is-active');
            choose2Bar.classList.add('is-active');
            if (grade === 1) {
                choose1MTab.classList.remove('is-active');
                choose1FTab.classList.remove('is-active');
                choose1MBar.classList.remove('is-active');
                choose1FBar.classList.remove('is-active');
            }
            return;
        }
        if (grade === 1) {
            if (!candidateNameToVote1M) {
                choose2Tab.classList.remove('is-active');
                choose1MTab.classList.add('is-active');
                choose1FTab.classList.remove('is-active');
                choose2Bar.classList.remove('is-active');
                choose1MBar.classList.add('is-active');
                choose1FBar.classList.remove('is-active');
                return;
            }
            if (!candidateNameToVote1F) {
                choose2Tab.classList.remove('is-active');
                choose1MTab.classList.remove('is-active');
                choose1FTab.classList.add('is-active');
                choose2Bar.classList.remove('is-active');
                choose1MBar.classList.remove('is-active');
                choose1FBar.classList.add('is-active');
                return;
            }
        }

        const request = new Request('/api/vote', {
            method: 'POST',
            body: JSON.stringify({
                key: key,
                candidateName1M: candidateNameToVote1M,
                candidateName1F: candidateNameToVote1F,
                candidateName2: candidateNameToVote2
            }),
            headers: new Headers({
                'content-type': 'application/json'
            })
        });
        const response = await fetch(request);
        const result = await response.json();

        voteSnackbar.MaterialSnackbar.showSnackbar({
            message: result.message,
            timeout: 3000
        });

        setTimeout(() => {location = 'login.html'}, 3000);
        voted = true;
        voteSubmitButton.disabled = true;
    });

    voteBackButton.addEventListener('click', async function(e) {
        location = 'login.html';
    });

    Array.prototype.forEach.call(voteRadioButtons, voteRadioButton => {
        voteRadioButton.addEventListener('click', async function(e) {
            const formData = new FormData(voteForm);

            const candidateNameToVote2 = formData.get('candidateNameToVote2');
            const candidateNameToVote1M = formData.get('candidateNameToVote1M');
            const candidateNameToVote1F = formData.get('candidateNameToVote1F');

            doneIcon2.hidden = !candidateNameToVote2;
            if (grade === 1) {
                doneIcon1M.hidden = !candidateNameToVote1M;
                doneIcon1F.hidden = !candidateNameToVote1F;
            }

            voteSubmitButton.disabled = !canVote();
        });
    });
}

function canVote() {
    if (voted) return false;
    const formData = new FormData(voteForm);

    const candidateNameToVote2 = formData.get('candidateNameToVote2');
    const candidateNameToVote1M = formData.get('candidateNameToVote1M');
    const candidateNameToVote1F = formData.get('candidateNameToVote1F');
    if (!candidateNameToVote2) {
        return false;
    }
    if (grade === 1) {
        if (!candidateNameToVote1M) {
            return false;
        }
        if (!candidateNameToVote1F) {
            return false;
        }
    }
    return true;
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}
