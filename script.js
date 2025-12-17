async function encryptFile() {
  // to get file input and status text from HTML
  const input = document.getElementById("fileInput");
  const message = document.getElementById("status");
  // to check if user has selected a file
  if (input.files.length === 0) {
    message.innerText = "No file selected.";
    return;
  }
  //to take the first selected file
  const selectedFile = input.files[0];
  // to convert file into binary format
  const data = await selectedFile.arrayBuffer();
  // to create a secret key for encryption
  const secretKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  // for creeating a random initialization vector
  const randomIV = crypto.getRandomValues(new Uint8Array(12));
  // now encrypt the file data
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: randomIV },
    secretKey,
    data);
  // merging IV and encrypted data
  const finalData = new Uint8Array(
    randomIV.length + encryptedBuffer.byteLength
  );
  finalData.set(randomIV, 0);
  finalData.set(new Uint8Array(encryptedBuffer), randomIV.length);
  // for converting encrypted data to downloadable file
  const encryptedFile = new Blob([finalData]);
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(encryptedFile);
  downloadLink.download = selectedFile.name + ".enc";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  message.innerText = "File encrypted successfully.";
}
