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

voteSubmitButton.addEventListener('click', async function(e) {
    const selectedRadioButtons = Array.prototype.filter.call(voteRadioButtons, e => e.checked);
    const selectedRadioButton2 = selectedRadioButtons.find(e => e.name === 'candidateNameToVote2');
    const selectedRadioButton1M = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1M');
    const selectedRadioButton1F = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1F');
    let candidateNameToVote2;
    let candidateNameToVote1M;
    let candidateNameToVote1F;
    if (typeof selectedRadioButton2 !== 'undefined') {
        candidateNameToVote2 = selectedRadioButton2.value;
    } else {
        candidateNameToVote2 = undefined;
    }
    if (typeof selectedRadioButton1M !== 'undefined') {
        candidateNameToVote1M = selectedRadioButton1M.value;
    } else {
        candidateNameToVote1M = undefined;
    }
    if (typeof selectedRadioButton1F !== 'undefined') {
        candidateNameToVote1F = selectedRadioButton1F.value;
    } else {
        candidateNameToVote1F = undefined;
    }
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
        const selectedRadioButtons = Array.prototype.filter.call(voteRadioButtons, e => e.checked);
        const selectedRadioButton2 = selectedRadioButtons.find(e => e.name === 'candidateNameToVote2');
        const selectedRadioButton1M = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1M');
        const selectedRadioButton1F = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1F');
        let candidateNameToVote2;
        let candidateNameToVote1M;
        let candidateNameToVote1F;
        if (typeof selectedRadioButton2 !== 'undefined') {
            candidateNameToVote2 = selectedRadioButton2.value;
        } else {
            candidateNameToVote2 = undefined;
        }
        if (typeof selectedRadioButton1M !== 'undefined') {
            candidateNameToVote1M = selectedRadioButton1M.value;
        } else {
            candidateNameToVote1M = undefined;
        }
        if (typeof selectedRadioButton1F !== 'undefined') {
            candidateNameToVote1F = selectedRadioButton1F.value;
        } else {
            candidateNameToVote1F = undefined;
        }

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
    const selectedRadioButtons = Array.prototype.filter.call(voteRadioButtons, e => e.checked);
    const selectedRadioButton2 = selectedRadioButtons.find(e => e.name === 'candidateNameToVote2');
    const selectedRadioButton1M = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1M');
    const selectedRadioButton1F = selectedRadioButtons.find(e => e.name === 'candidateNameToVote1F');
    let candidateNameToVote2;
    let candidateNameToVote1M;
    let candidateNameToVote1F;
    if (typeof selectedRadioButton2 !== 'undefined') {
        candidateNameToVote2 = selectedRadioButton2.value;
    } else {
        candidateNameToVote2 = undefined;
    }
    if (typeof selectedRadioButton1M !== 'undefined') {
        candidateNameToVote1M = selectedRadioButton1M.value;
    } else {
        candidateNameToVote1M = undefined;
    }
    if (typeof selectedRadioButton1F !== 'undefined') {
        candidateNameToVote1F = selectedRadioButton1F.value;
    } else {
        candidateNameToVote1F = undefined;
    }

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
