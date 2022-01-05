
//because it's using async, gotta put into a variable instead of just returning
function getDataFor(sourceStr, variableToStoreRateSTR, variableToStoreDataSTR) {
    source = atx.createBufferSource();
    var request = new XMLHttpRequest();
  
    request.open('GET', sourceStr, true);
  
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      var audioData = request.response;
  
      atx.decodeAudioData(audioData, function(buffer) {
          source.buffer = buffer;
          var finalOutput = source.buffer.getChannelData(0);
          eval(`${variableToStoreRateSTR} = ${source.buffer.sampleRate};`);
          eval(`${variableToStoreDataSTR} = [${finalOutput}];`);

          source.connect(atx.destination);
          source.loop = true;
        },
  
        function(e){ console.log("Error with decoding audio data" + e.err); });
    }
  
    request.send();
  }