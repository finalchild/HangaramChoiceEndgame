if (sessionStorage.getItem('key') === null) {
    location = 'login.html';
}

const key = parseInt(sessionStorage.getItem('key'), 10);
sessionStorage.removeItem('key');

const grade = parseInt(sessionStorage.getItem('grade'), 10);
sessionStorage.removeItem('grade');

const cache = JSON.parse(sessionStorage.getItem('cache'));

let voted = false;

const voteBody = document.getElementById('vote-body');
voteBody.innerHTML += sessionStorage.getItem('rendered');
sessionStorage.removeItem('rendered');

const voteSubmitButton = document.getElementById('vote-submit');
const voteBackButton = document.getElementById('vote-back');
const voteForm = document.getElementById('vote-form');
const choose2Tab = document.getElementById('choose2');
const choose1MTab = document.getElementById('choose1M');
const choose1FTab = document.getElementById('choose1F');
const choose2Bar = document.getElementById('choose2-bar');
const choose1MBar = document.getElementById('choose1M-bar');
const choose1FBar = document.getElementById('choose1F-bar');
const doneIcon2 = document.getElementById('done-icon2');
const doneIcon1M = document.getElementById('done-icon1M');
const doneIcon1F = document.getElementById('done-icon1F');
const voteRadioButtons = document.getElementsByClassName('vote-radio');
const voteSnackbar = document.getElementById('vote-snackbar');
const voteSnackbarText = document.getElementById('vote-snackbar-text');

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
