function highlightEmptyInputs(inputs, e) {
    for(let i = 0; i < inputs.length; ++i) {
        if(inputs[i].value === "") {
            inputs[i].style.borderColor = "red";
            e.preventDefault();
        } else {
            inputs[i].style.borderColor = "white";
        }
    }
}

function highlightEmptyFileInput(input, e) {
    if(input.files.length <= 2) {
        input.style.borderColor = "red";
        e.preventDefault();
    } else {
        input.style.borderColor = "white";
    }
}

function validatePhoneNumber(phoneNumber, e) {
    let phonePattern = new RegExp('^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$');
    if(phoneNumber.length !== 10 || !phonePattern.test(phoneNumber)) {
        phoneNumber.style.borderColor = "red";
        alert("Incorrect format for phone number.");
        e.preventDefault();
    } else {
        phoneNumber.style.borderColor = "white";
    }
}


document.getElementById("post-ad-button").addEventListener("click", (e) => {
    e.returnValue = true;
    let inputs = document.getElementsByClassName("user-input");
    let fileInput = document.getElementById("file-input");
    let phoneNumber = document.getElementById("phone");
    highlightEmptyInputs(inputs, e);
    highlightEmptyFileInput(fileInput, e);
    validatePhoneNumber(phoneNumber, e);
});