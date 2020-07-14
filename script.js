var textField = document.createElement("input");
var imageUpload = document.createElement("input");
textField.type = "text";
textField.placeholder = "Card text";
textField.setAttribute('maxlength', '50')
imageUpload.type = "file";
imageUpload.accept = "image/*";
var characters = document.getElementById('characters');
characters.appendChild(textField);
characters.appendChild(imageUpload);
characters.appendChild(document.createElement("br"))
