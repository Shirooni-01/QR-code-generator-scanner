const input = document.getElementById("qrInput");
const qrContainer = document.getElementById("qrcode");

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

const scanBtn = document.getElementById("scanBtn");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");

let qrCode;
let scannerStarted = false;
let html5QrCode;

// -----------------------------
// Generate QR
// -----------------------------
generateBtn.addEventListener("click", () => {

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter some text or URL.");
        return;
    }

    qrContainer.innerHTML = "";

    qrCode = new QRCode(qrContainer, {
        text: text,
        width: 220,
        height: 220
    });

});


// -----------------------------
// Download QR
// -----------------------------
downloadBtn.addEventListener("click", () => {

    const img = qrContainer.querySelector("img");
    const canvas = qrContainer.querySelector("canvas");

    if (img) {

        const link = document.createElement("a");
        link.href = img.src;
        link.download = "qrcode.png";
        link.click();

    } else if (canvas) {

        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "qrcode.png";
        link.click();

    } else {

        alert("Generate a QR code first.");

    }

});


// -----------------------------
// Share QR
// -----------------------------
shareBtn.addEventListener("click", async () => {

    const canvas = qrContainer.querySelector("canvas");

    if (!canvas) {
        alert("Generate a QR code first.");
        return;
    }

    if (!navigator.share) {
        alert("Sharing is not supported on this browser.");
        return;
    }

    canvas.toBlob(async (blob) => {

        const file = new File(
            [blob],
            "qrcode.png",
            { type: "image/png" }
        );

        try {

            await navigator.share({
                title: "QR Code",
                text: "Check out this QR Code",
                files: [file]
            });

        } catch (err) {
            console.log(err);
        }

    });

});


// -----------------------------
// QR Scanner
// -----------------------------
scanBtn.addEventListener("click", async () => {

    if (scannerStarted)
        return;

    scannerStarted = true;

    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {

                resultText.value = decodedText;

                html5QrCode.stop();

                scannerStarted = false;

            }
        );

    } catch (err) {

        alert("Unable to access camera.");

        scannerStarted = false;

    }

});


// -----------------------------
// Copy Text
// -----------------------------
copyBtn.addEventListener("click", async () => {

    if (resultText.value === "") {
        alert("Nothing to copy.");
        return;
    }

    await navigator.clipboard.writeText(resultText.value);

    alert("Copied!");

});


// -----------------------------
// Open Link
// -----------------------------
openBtn.addEventListener("click", () => {

    const text = resultText.value.trim();

    if (text === "") {
        alert("No scanned data.");
        return;
    }

    if (
        text.startsWith("http://") ||
        text.startsWith("https://")
    ) {

        window.open(text, "_blank");

    } else {

        alert("Scanned content is not a valid URL.");

    }

});


// -----------------------------
// Press Enter to Generate
// -----------------------------
input.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        generateBtn.click();
    }

});