function addCard(targetList) {
  var div = document.createElement("div");
  var textField = document.createElement("input");
  var imageUpload = document.createElement("input");
  var removeButton = document.createElement("button")

  textField.type = "text";
  textField.placeholder = "Card text";
  textField.setAttribute("maxlength", "62");
  textField.name = targetList + "TextField";
  imageUpload.type = "file";
  imageUpload.accept = "image/*";
  imageUpload.name = targetList + "ImageUpload";
  removeButton.type = "button";
  removeButton.onclick = function() {
    return this.parentNode.remove();
  }
  removeButton.appendChild(document.createTextNode("Delete"));

  var cardList = document.getElementById(targetList);
  var button = document.getElementById(targetList + '_add');

  cardList.insertBefore(div, button);
  div.appendChild(textField);
  div.appendChild(imageUpload);
  div.appendChild(removeButton);
  div.appendChild(document.createElement("br"));
}

function generateImage() {
  var form = document.getElementById("form");
  var charactersText = [];
  var charactersImages = [];
  var challengesText = [];
  var challengesImages = [];

  for (i of form.elements) {
    switch (i.name) {
      case "charactersTextField":
        charactersText.push(i.value);
        break;
      case "charactersImageUpload":
        charactersImages.push(i.value);
        break;
      case "challengesTextField":
        challengesText.push(i.value);
        break;
      case "challengesImageUpload":
        challengesImages.push(i.value);
        break;
      case "borderColor":
        var borderColor = i.value;
        break;
      case "charactersIcon":
        var charactersIcon = i.value;
        break;
      case "challengesIcon":
        var challengesIcon = i.value;
    }
  }
  alert(charactersText);
  alert(charactersImages);
  alert(challengesText);
  alert(challengesImages);
  alert(borderColor);
  alert(charactersIcon);
  alert(challengesIcon);
}
