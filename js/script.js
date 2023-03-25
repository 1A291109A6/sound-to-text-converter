function init() {
  const fileInput = document.getElementById('fileInput');
  const downloadLink = document.getElementById('downloadLink');

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const audioContext = new AudioContext();

      let decodeFunction;
      switch (file.type) {
        case 'audio/wav':
          decodeFunction = audioContext.decodeAudioData;
          break;
        case 'audio/mp3':
        case 'audio/mpeg':
          decodeFunction = audioContext.decodeAudioData.bind(audioContext, event.target.result);
          break;
        case 'audio/ogg':
          decodeFunction = audioContext.decodeAudioData.bind(audioContext, event.target.result);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }

      decodeFunction((buffer) => {
        const channelData = buffer.getChannelData(0);
        let textData = '';
        const samplingRate = buffer.sampleRate;
        const step = samplingRate / 8000;
        for (let i = 0; i < channelData.length; i += step) {
          textData += channelData[Math.floor(i)].toString() + '\n';
        }

        const blob = new Blob([textData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'wave_data.txt';
        downloadLink.click();
      });
    }

    reader.readAsArrayBuffer(file);
  });
}

window.onload = init;
