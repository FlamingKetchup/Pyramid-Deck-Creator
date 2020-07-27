const background = document.createElement("img");
const charIconImg = document.createElement("img");
const chalIconImg = document.createElement("img");
background.src = "card_background.png";
var modalBackground, modal, modalImage, modalButton, downloadButton, canvas, c;
window.onload = function() {
  modalBackground = document.getElementById("cropModalBackground");
  modal = document.getElementById("cropModal");
  modalImage = document.getElementById("modalImage");
  modalButton = document.getElementById("modalButton");
  downloadButton = document.getElementById("downloadButton");
  canvas = document.getElementById("preview");
  c = canvas.getContext("2d");
  c.font = "48px Kreon";
  c.textAlign = "center";
  c.textBaseline = "top";
  c.fillStyle = "white";
  c.webkitImageSmoothingEnabled = false;
  c.mozImageSmoothingEnabled = false;
  c.imageSmoothingEnabled = false;
}

Cropper.setDefaults({viewMode: 1, minContainerWidth: 1, minContainerHeight: 1, autoCropArea: 1, toggleDragModeOnDblclick: false, cropBoxMovable: false});

//Takes the file, crops it, and returns how to clip it
function cropImage(file, writeTarget) {
  const reader = new FileReader();
  reader.onload = function() {
    modalImage.src = reader.result;
    modalImage.onload = function() {
      const cropper = new Cropper(modalImage, {ready () {
        modalButton.onclick = function() {
          writeTarget.src = reader.result;
          writeTarget.dataset.cropX = cropper.getData({rounded: true}).x;
          writeTarget.dataset.cropY = cropper.getData({rounded: true}).y;
          writeTarget.dataset.width = cropper.getData({rounded: true}).width;
          writeTarget.dataset.height = cropper.getData({rounded: true}).height;
          cropper.destroy();
          modalBackground.style.display = "none";
          writeTarget.onload = function() {
            generateImage();
          }
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
  const imageStorage = document.createElement("img");

  textField.type = "text";
  textField.placeholder = "Card text";
  textField.setAttribute("maxlength", "62");
  textField.name = targetList + "TextField";
  textField.onchange = function() {
    generateImage();
  }
  imageUpload.type = "file";
  imageUpload.accept = "image/*";
  imageUpload.name = targetList + "ImageUpload";
  imageUpload.onchange = function() {
    cropImage(this.files[0], imageStorage);
  }
  removeButton.type = "button";
  removeButton.onclick = function() {
    this.parentNode.remove();
    generateImage();
  }
  removeButton.appendChild(document.createTextNode("Delete"));

  imageStorage.style.display = "none";

  const cardList = document.getElementById(targetList);
  const button = document.getElementById(targetList + '_add');

  cardList.insertBefore(div, button);
  div.appendChild(textField);
  div.appendChild(imageUpload);
  div.appendChild(removeButton);
  div.appendChild(imageStorage);
  div.appendChild(document.createElement("br"));
  generateImage();
}

//Renders the cards onto the canvas element with id="preview"
function generateImage() {
  const form = document.getElementById("form");
  var charactersText = [];
  var charactersImages = [];
  var challengesText = [];
  var challengesImages = [];
  var charIcon = {image: charIconImg, width: charIconImg.dataset.width, cropX: charIconImg.dataset.cropX, cropY: charIconImg.dataset.cropY, height: charIconImg.dataset.height};
  var chalIcon = {image: chalIconImg, width: chalIconImg.dataset.width, cropX: chalIconImg.dataset.cropX, cropY: chalIconImg.dataset.cropY, height: chalIconImg.dataset.height};

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
        console.log(i.parentNode.getElementsByTagName("img")[0]);
        charactersImages.push({image: i.parentNode.getElementsByTagName("img")[0], width: i.parentNode.getElementsByTagName("img")[0].dataset.width, cropX: i.parentNode.getElementsByTagName("img")[0].dataset.cropX, cropY: i.parentNode.getElementsByTagName("img")[0].dataset.cropY, height: i.parentNode.getElementsByTagName("img")[0].dataset.height});
        break;
      case "challengesImageUpload":
        challengesImages.push({image: i.parentNode.getElementsByTagName("img")[0], width: i.parentNode.getElementsByTagName("img")[0].dataset.width, cropX: i.parentNode.getElementsByTagName("img")[0].dataset.cropX, cropY: i.parentNode.getElementsByTagName("img")[0].dataset.cropY, height: i.parentNode.getElementsByTagName("img")[0].dataset.height});
    }
  }

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
      const scaleFactor = 130 / Math.max(images[i].width, images[i].height);
      c.drawImage(images[i].image, images[i].cropX, images[i].cropY, images[i].width, images[i].height, posX + 203 - (images[i].width * scaleFactor) / 2, posY + 393 - (images[i].height * scaleFactor) / 2, images[i].width * scaleFactor, images[i].height * scaleFactor);
    }
    if (i < charactersText.length && charIcon.image !== undefined) {
      const scaleFactor = 38 / Math.max(charIcon.width, charIcon.height);
      c.filter = "grayscale(100%)";
      c.drawImage(charIcon.image, charIcon.cropX, charIcon.cropY, charIcon.width, charIcon.height, posX + 366 - (charIcon.width * scaleFactor) / 2, posY + 545 - (charIcon.height * scaleFactor) / 2, charIcon.width * scaleFactor, charIcon.height * scaleFactor);
      c.filter = "none";
    }
    else if (chalIcon.image !== undefined) {
      const scaleFactor = 38 / Math.max(chalIcon.width, chalIcon.height);
      c.filter = "grayscale(100%)";
      c.drawImage(chalIcon.image, chalIcon.cropX, chalIcon.cropY, chalIcon.width, chalIcon.height, posX + 366 - (chalIcon.width * scaleFactor) / 2, posY + 545 - (chalIcon.height * scaleFactor) / 2, chalIcon.width * scaleFactor, chalIcon.height * scaleFactor);
      c.filter = "none";
    }
  }

  downloadButton.href = canvas.toDataURL();

}
