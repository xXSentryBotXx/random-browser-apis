(async function() {
    const videosSelect = document.getElementById('videos');
    const video = document.getElementById('video');
    let stream = undefined

    videosSelect.addEventListener('change', async function(e){
        videoId = e.target.value;
        if (stream) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }

        if (videoId !== '-') {
            stream = await mediaDevices.getUserMedia(
                { 
                    audio: false, 
                    video: { 
                        deviceId: videoId, 
                        width: { ideal: 1920 }, 
                        height: { ideal: 1080 }
                    } 
                }
            );
            video.srcObject = stream;
            video.play();
        }
    }, false);

    const mediaDevices = navigator.mediaDevices;
    await mediaDevices.getUserMedia({ audio: true, video: false });

    const devices = await mediaDevices.enumerateDevices();
    console.log(devices)

    const videoDevices = devices.filter( device => {
        // console.log(device.kind, device.label)
        return device.kind === "videoinput"
    });

    let optionStr = '<option value="-" selected>-</option>';
    
    videoDevices.forEach( device => {
        // console.log(device)
        optionStr += `<option value="${device.deviceId}">${device.label}</option>`;
    });

    videosSelect.innerHTML = optionStr;
})();