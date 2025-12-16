async function encryptFile() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  if (fileInput.files.length === 0) {
    status.innerText = "Please select a file first.";
    return;
  }

  const file = fileInput.files[0];
  const fileData = await file.arrayBuffer();

  // Generate AES-GCM key
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt file data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    fileData
  );

  // Combine IV + encrypted data
  const combinedData = new Uint8Array(iv.byteLength + encryptedData.byteLength);
  combinedData.set(iv, 0);
  combinedData.set(new Uint8Array(encryptedData), iv.byteLength);

  // Create encrypted file download
  const blob = new Blob([combinedData]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
a.href = url;
a.download = file.name + ".enc";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

  status.innerText = "File encrypted and downloaded successfully.";
}
