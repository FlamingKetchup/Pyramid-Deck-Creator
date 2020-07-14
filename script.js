function addCard(targetList) {
  var div = document.createElement("div");
  var textField = document.createElement("input");
  var imageUpload = document.createElement("input");
  var removeButton = document.createElement("button")

  textField.type = "text";
  textField.placeholder = "Card text";
  textField.setAttribute("maxlength", "62");
  imageUpload.type = "file";
  imageUpload.accept = "image/*";
  removeButton.type = "button";
  removeButton.onclick = function() {
    return this.parentNode.remove();
  }
  removeButton.appendChild(document.createTextNode("Remove"));

  var cardList = document.getElementById(targetList);
  var button = document.getElementById(targetList + '_add');

  cardList.insertBefore(div, button)
  div.appendChild(textField);
  div.appendChild(imageUpload);
  div.appendChild(removeButton)
  div.appendChild(document.createElement("br"));
}

function removeParent() {
  if (this.parentNode != undefined) {
    this.parentNode.removeChild();
  }
}
