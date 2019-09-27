var header = document.getElementById("snkly");

function toggleHeader() {
  if (this.classList.contains('condensed')) {
    this.classList.remove("condensed");
  } else {
    this.classList.add("condensed");
  }
};

header.addEventListener( 'click', toggleHeader);
setTimeout(function(){ header.classList.remove("condensed"); }, 1000);