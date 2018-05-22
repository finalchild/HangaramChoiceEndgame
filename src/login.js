const keyInput = document.getElementById('login-key');
const keyError = document.getElementById('key-error');
const keyInputContainer = document.getElementById('key-input-container');
keyInput.addEventListener('input', async function (e) {
    if (!keyInput.value || keyInput.value.length !== 8) {
        return;
    }
    if (!checkKeyString()) {
        keyInput.focus();
        return;
    }

    const key = Math.floor(parseInt(keyInput.value, 10) / 10);
    await login(key);
});

function checkKeyString() {
    const keyString = keyInput.value;
    if (!keyInput.value || keyInput.value.length !== 8) {
        keyInput.setCustomValidity('8자리의 키를 입력해 주세요!');
        keyError.textContent = '8자리의 키를 입력해 주세요!';
        keyInputContainer.classList.add('is-invalid');
        return false;
    }
    const keyWithCheckDigit = parseInt(keyInput.value, 10);
    if (!isValidKeyWithCheckDigit(keyWithCheckDigit)) {
        keyInput.setCustomValidity('확인 숫자가 잘못되었습니다!');
        keyError.textContent = '확인 숫자가 잘못되었습니다!';
        keyInputContainer.classList.add('is-invalid');
        return false;
    }
    return true;
}

function isValidKeyWithCheckDigit(key) {
    return Number.isSafeInteger(key) && key > 0 && key < 100000000 && isValidMod10(key);
}

async function login(key) {
    const cache = JSON.parse(sessionStorage.getItem('cache'));
    const request = new Request('/api/login',  {
        method: 'POST',
        body: JSON.stringify({
            key: key,
            candidateCacheId: (cache && cache.candidatesCacheId) ? cache.candidatesCacheId : undefined
        }),
        headers: new Headers({
            'content-type': 'application/json'
        })
    });
    const response = await fetch(request);
    const result = await response.json();
    if (typeof result.error === 'string') {
        keyInput.setCustomValidity(result.error);
        keyError.textContent = result.error;
        keyInputContainer.classList.add('is-invalid');
        return
    }
    sessionStorage.setItem('key', key.toString());
    sessionStorage.setItem('grade', result.grade.toString());
    if (result.cache) {
        sessionStorage.setItem('cache', JSON.stringify(result.cache));
    }
    location = 'vote.html';
}

function isValidMod10(number) {
    let sum = 0;
    let index = 0;
    while (number > 0) {
        const lastNumber = number % 10;
        number = (number - lastNumber) / 10;
        if (index % 2 === 0) {
            sum += lastNumber;
        } else if (lastNumber <= 4) {
            sum += lastNumber * 2;
        } else {
            sum += lastNumber * 2 - 9;
        }
        index++;
    }
    return sum % 10 === 0;
}
