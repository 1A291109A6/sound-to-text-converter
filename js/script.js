// ページの読み込みが完了した時に呼び出される関数
function init() {
  // HTMLの要素を取得
  const fileInput = document.getElementById('fileInput');
  const downloadLink = document.getElementById('downloadLink');
  
  // ファイルが選択されたときに呼び出される関数
  fileInput.addEventListener('change', (event) => {
    // 選択されたファイルを取得
    const file = event.target.files[0];
    
    // FileReaderオブジェクトを作成
    const reader = new FileReader();
    
    // ファイルを読み込んだ時に呼び出される関数
    reader.onload = (event) => {
      // Web Audio APIを使用して、wavファイルのデータを解析
      const audioContext = new AudioContext();
      audioContext.decodeAudioData(event.target.result, (buffer) => {
        const channelData = buffer.getChannelData(0);
        let textData = '';
        for (let i = 0; i < channelData.length; i++) {
          // チャンネルデータをテキストに変換
          textData += channelData[i].toString() + '\n';
        }
        
        // ダウンロード用のリンクを作成
        const blob = new Blob([textData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'wave_data.txt';
        
        // ダウンロードリンクをクリックして、自動ダウンロードする
        downloadLink.click();
      });
    };
    
    // ファイルを読み込む
    reader.readAsArrayBuffer(file);
  });
}
