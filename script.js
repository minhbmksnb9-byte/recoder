let mediaRecorder;
let stream;
let chunks = [];

async function startRecording() {
  chunks = [];

  stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: { ideal: 60, max: 60 }
    },
    audio: true
  });

  document.getElementById("preview").srcObject = stream;

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
    videoBitsPerSecond: 8000000
  });

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = uploadVideo;

  mediaRecorder.start(2000);
}

function stopRecording() {
  mediaRecorder.stop();
  stream.getTracks().forEach(track => track.stop());
}

function uploadVideo() {
  const blob = new Blob(chunks, { type: "video/webm" });

  uploadcare.fileFrom('object', blob).done(file => {
    const url = file.cdnUrl;

    document.getElementById("link").innerHTML =
      `✅ Uploaded: <a href="${url}" target="_blank">${url}</a>`;
  });
}
