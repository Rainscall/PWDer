isE2R.onchange = function () {
    if (isE2R.checked) {
        toggleInputRange(10, 2, 4);
        toggleSymbolInput(false);
    } else {
        toggleInputRange(150, 8, 20);
        toggleSymbolInput(true);
    }
    generateRandomPassword(inputRange.value);
};

isSymbol.onchange = function () {
    if (isSymbol.checked) {
        toggleE2RInput(false);
    } else {
        toggleE2RInput(true);
    }
    generateRandomPassword(inputRange.value);
};

function toggleInputRange(maxValue, minValue, startValue) {
    inputRange.max = maxValue;
    inputRange.min = minValue;
    inputRange.value = startValue;
    rangeValue.innerText = inputRange.value;
}

function toggleSymbolInput(disable) {
    isSymbol.disabled = disable ? "" : "disabled";
    isSymbol.parentNode.style.textDecoration = disable ? "" : "line-through #adadad";
    isSymbol.parentNode.lastElementChild.style.color = disable ? "" : "#adadad";
}

function toggleE2RInput(disable) {
    isE2R.disabled = disable ? "" : "disabled";
    isE2R.parentNode.style.textDecoration = disable ? "" : "line-through #adadad";
    isE2R.parentNode.lastElementChild.style.color = disable ? "" : "#adadad";
}

function triggerButtonById(buttonId) {
    const button = document.getElementById(buttonId);

    if (button) {
        button.click();
    } else {
        console.log(`Button with id '${buttonId}' not found.`);
    }
}

function copyToClipboard(elementId) {
    var element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}

// 定义一个函数，接受一个参数id
function copyInnerText(id) {
    // 获取id对应的元素
    var element = document.getElementById(id);
    // 判断元素是否存在
    if (element) {
        var innerText = element.innerText;
        var textarea = document.createElement("textarea");
        textarea.value = innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        // 返回成功信息
        Toastify({
            text: "Copied.",
            duration: 1200,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
            }
        }).showToast();
        return 0;
    } else {
        // 返回失败信息
        return 1;
    }
}


function resetInput() {
    originInput.value = '';
    document.getElementById('pwdInput').value = '';
    forceDecyptResultBase.style.display = 'none';
    forceDecyptResult.innerText = '[WAITING...]';
}

function clearElement() {
    var element = document.getElementById("qrcode");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function shareText() {
    const shareCode = document.getElementById('pwdInput').innerText;
    const qrcode = document.getElementById('qrcode');
    qrcode.style.display = '';

    if (!shareCode) {
        console.log('no input');
        Toastify({
            text: "Nothing to share.",
            duration: 800,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#414141",
            }
        }).showToast();
        return;
    }

    const shareBasePart = document.getElementById('shareBasePart');
    shareBasePart.style.display = 'flex';
    clearElement();

    if (shareCode.length > 940) {
        qrcodeError.style.display = 'flex';
        qrcode.style.display = 'none';
        qrcode.textContent = 'Too long to convert it to QR code.';
        return;
    }

    new QRCode(qrcode, {
        'text': shareCode,
        'width': 256,
        'height': 256,
        'colorDark': 'black',
        'colorLoght': '#e5e5e5',
        'correctLevel': QRCode.CorrectLevel.M
    });
}


function closeQRCode() {
    var shareBasePart = document.getElementById('shareBasePart');
    shareBasePart.style.display = 'none';
    document.getElementById('qrcodeError').style.display = 'none';
}
function generateRandomPassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    const isSymbol = document.getElementById('isSymbol');
    const isE2R = document.getElementById('isE2R');
    if (isSymbol.checked) {
        charset += "@#$%&*";
    }

    if (isE2R.checked) {
        password = generateRandomE2R(length);
    }

    if (!isE2R.checked) {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
    }

    const pwdInput = document.getElementById("pwdInput");
    pwdInput.innerText = password;
}

var charSetCache = null; // 全局变量用于缓存字符集

function fetchAndCacheCharSet() {
    // 创建一个 XMLHttpRequest 对象用于从文件中获取字符集
    var xhr = new XMLHttpRequest();

    // 打开文件并发送请求
    xhr.open('GET', 'assets/pwdDir.txt', false); // 同步请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            charSetCache = xhr.responseText;
        }
    };
    xhr.send();
}

function generateRandomE2R(paramCount) {
    // 如果字符集没有被缓存，则先获取并缓存
    if (charSetCache === null) {
        fetchAndCacheCharSet();
    }

    // 如果字符集已经被缓存，则直接使用缓存
    var charSet = charSetCache;

    var words = charSet.split('\n').map(function (word) {
        return word.trim();
    });

    // 创建一个用于存储随机选中的词的数组
    var selectedWords = [];

    // 从字符集中随机选取指定数量的词
    for (var i = 0; i < paramCount; i++) {
        var randomIndex = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randomIndex]);
    }
    var result = selectedWords.join('-');
    return result;
}
