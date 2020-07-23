const background = document.createElement("img");
background.src = "card_background.png";
var modalBackground, modal, modalImage, modalButton;
window.onload = function () {
  modalBackground = document.getElementById("cropModalBackground");
  modal = document.getElementById("cropModal");
  modalImage = document.getElementById("modalImage");
  modalButton = document.getElementById("modalButton");
}
Cropper.setDefaults({viewMode: 1, minContainerWidth: 1, minContainerHeight: 1, restore: false, autoCropArea: 1, toggleDragModeOnDblclick: false, cropBoxMovable: false});

//Takes the file and puts it into the image
function readImage(file, image) {
  const reader = new FileReader();
  reader.onload = function () {
    image.src = reader.result;
  }
  reader.readAsDataURL(file);
}

//Takes the file, crops it, and returns how to clip it
function cropImage(file, writeTarget) {
  const reader = new FileReader();
  reader.onload = function () {
    modalImage.src = reader.result;
    modalImage.onload = function () {
      const cropper = new Cropper(modalImage, {ready () {
        modalButton.onclick = function () {
          writeTarget.dataset.cropX = cropper.getData({rounded: true}).x;
          writeTarget.dataset.cropY = cropper.getData({rounded: true}).y;
          writeTarget.dataset.width = cropper.getData({rounded: true}).width;
          writeTarget.dataset.height = cropper.getData({rounded: true}).height;
          cropper.destroy();
          modalBackground.style.display = "none";
        }
      }});
      modalBackground.style.display = "block";
    }
  }
  reader.readAsDataURL(file);
}

//Adds a text and a file input to the target container
function addCard(targetList) {
  const div = document.createElement("div");
  const textField = document.createElement("input");
  const imageUpload = document.createElement("input");
  const removeButton = document.createElement("button");

  textField.type = "text";
  textField.placeholder = "Card text";
  textField.setAttribute("maxlength", "62");
  textField.name = targetList + "TextField";
  imageUpload.type = "file";
  imageUpload.accept = "image/*";
  imageUpload.name = targetList + "ImageUpload";
  imageUpload.onchange = function () {
    cropImage(this.files[0], this);
  }
  removeButton.type = "button";
  removeButton.onclick = function () {
    return this.parentNode.remove();
  }
  removeButton.appendChild(document.createTextNode("Delete"));

  const cardList = document.getElementById(targetList);
  const button = document.getElementById(targetList + '_add');

  cardList.insertBefore(div, button);
  div.appendChild(textField);
  div.appendChild(imageUpload);
  div.appendChild(removeButton);
  div.appendChild(document.createElement("br"));
}

//Renders the cards onto the canvas element with id="preview"
function generateImage() {
  const form = document.getElementById("form");
  var charactersText = [];
  var charactersImages = [];
  var challengesText = [];
  var challengesImages = [];
  var challengesImagesCropData = [];

  //Organizing user input
  for (i of form.elements) {
    switch (i.name) {
      case "borderColor":
        var borderColor = i.value;
        break;
      case "charactersTextField":
        charactersText.push(i.value);
        break;
      case "challengesTextField":
        challengesText.push(i.value);
        break;
      case "charactersImageUpload":
        charactersImages.push({image: i.files[0], width: i.dataset.width, cropX: i.dataset.cropX, cropY: i.dataset.cropY, height: i.dataset.height});
        break;
      case "challengesImageUpload":
        challengesImages.push({image: i.files[0], width: i.dataset.width, cropX: i.dataset.cropX, cropY: i.dataset.cropY, height: i.dataset.height});
        break;
      case "charactersIcon":
        var charactersIcon = {image: i.files[0], width: i.dataset.width, cropX: i.dataset.cropX, cropY: i.dataset.cropY, height: i.dataset.height};
        break;
      case "challengesIcon":
        var challengesIcon = {image: i.files[0], width: i.dataset.width, cropX: i.dataset.cropX, cropY: i.dataset.cropY, height: i.dataset.height};
    }
  }

  var canvas = document.getElementById("preview");
  var c = canvas.getContext("2d");
  c.font = "48px Kreon";
  c.textAlign = "center";
  c.textBaseline = "top";
  c.fillStyle = "white";

  c.clearRect(0, 0, canvas.width, canvas.height);

  text = [...charactersText, ...challengesText];
  images = [...charactersImages, ...challengesImages];

//Split text into appropriately size chunks
  var splitText, tempString;
  for (var i = 0; i < text.length; i++) {
    splitText = text[i].split(" ");
    text[i] = [];
    tempString = "";
    for (j of splitText) {
      if (c.measureText(j).width > 300) {
        alert("One of the words in your card text is too long. Please shorten it before continuing");
        return;
      }
      if (c.measureText(tempString + j).width > 350) {
        text[i].push(tempString);
        tempString = "";
      }
      tempString += j + " ";
    }
    text[i].push(tempString);
  }

  //Process image files into images
  var tempImage;
  for (var i = 0; i < images.length; i++) {
    if (images[i].image !== undefined) {
      tempFile = images[i].image;
      images[i].image = document.createElement("img");
      readImage(tempFile, images[i].image);
    }
  }

  if (charactersIcon.image !== undefined) {
    tempFile = charactersIcon.image;
    charactersIcon.image = document.createElement("img");
    readImage(tempFile, charactersIcon.image);
  }

  if (challengesIcon.image !== undefined) {
    tempFile = challengesIcon.image;
    challengesIcon.image = document.createElement("img");
    readImage(tempFile, challengesIcon.image);
  }

  //Actually rendering cards
  for (let i = 0; i < text.length; i++) {
    let posX = i % 10 * 410;
    let posY = Math.floor(i / 10) * 584;
    c.drawImage(background, posX, posY);
    c.strokeStyle = borderColor;
    c.lineWidth = 12;
    c.strokeRect(posX + 6, posY + 6, 395, 569);
    c.strokeStyle = "#000000";
    c.lineWidth = 6;
    for (var j = 0; j < text[i].length; j++) {
      c.strokeText(text[i][j], posX + 203, posY + 55 + j * 48);
      c.fillText(text[i][j], posX + 203, posY + 55 + j * 48);
    }
    if (images[i].image !== undefined) {
      images[i].image.onload = function() {
        c.drawImage(images[i].image, images[i].cropX, images[i].cropY, images[i].width, images[i].height, posX + 138, posY + 328, 130, 130);
      }
    }
    if (i < charactersText.length && charactersIcon.image !== undefined) {
      charactersIcon.image.addEventListener("load", function() {
        c.filter = "grayscale(100%)";
        c.drawImage(charactersIcon.image, charactersIcon.cropX, charactersIcon.cropY, charactersIcon.width, charactersIcon.height, posX + 347, posY + 526, 38, 38);
        c.filter = "none";
      });
    }
    else if (challengesIcon.image !== undefined) {
      charactersIcon.image.addEventListener("load", function() {
        c.filter = "grayscale(100%)";
        c.drawImage(challengesIcon.image, challengesIcon.cropX, challengesIcon.cropY, challengesIcon.width, challengesIcon.height, posX + 347, posY + 526, 38, 38);
        c.filter = "none";
      });
    }

  }
}
