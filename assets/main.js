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
        // 获取元素的innerHTML
        var innerText = element.innerText;
        // 创建一个临时的textarea元素
        var textarea = document.createElement("textarea");
        // 将innerText赋值给textarea的value
        textarea.value = innerText;
        // 将textarea添加到文档中
        document.body.appendChild(textarea);
        // 选中textarea的内容
        textarea.select();
        // 复制选中的内容到剪贴板
        document.execCommand("copy");
        // 从文档中移除textarea元素
        document.body.removeChild(textarea);
        // 返回成功信息
        return "已复制" + id + "的innerText到剪贴板";
    } else {
        // 返回失败信息
        return "没有找到" + id + "对应的元素";
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
    const shareCode = document.getElementById('pwdInput').value;
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

    //const encodedShareCode = encodeURIComponent(shareCode);
    //const shareCodeUrl = `${window.location.href}?input=${encodedShareCode}`;
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
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    const pwdInput = document.getElementById("pwdInput");
    pwdInput.value = password;
}