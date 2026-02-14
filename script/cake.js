const initCake = () => {
  const cake = document.querySelector(".cake");
  const cakeContainer = document.querySelector(".cake-container");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let allCandlesBlownOut = false;
  let confettiInterval;

  const addCandle = (left, top) => {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
  }

  const addInitialCandles = () => {
    addCandle(100, 20);
    addCandle(120, 40);
    addCandle(140, 20);
    addCandle(80, 40);
    addCandle(60, 20);
  }

  const isBlowing = () => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 30;
  }

  const popSound = document.getElementById("pop-sound");
  const birthdayMusic = document.getElementById("birthday-music");

  const createConfetti = () => {
    const confettiContainer = document.querySelector(".confetti-container");
    const colors = ["#fde2e4", "#ffc2d1", "#ff9a8b", "#b19cd9", "#fffaf0"];
    const shapes = ['circle', 'square'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");

      // Random starting position across the top
      const startX = Math.random() * 100;
      confetti.style.left = startX + "vw";

      // Random horizontal drift
      const drift = (Math.random() - 0.5) * 200;
      confetti.style.setProperty('--tx', drift + 'px');

      // Random size
      const size = Math.random() * 10 + 5;
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";

      // Random shape
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = "50%";
      }

      // Random color
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Random animation duration and delay
      const duration = Math.random() * 2 + 3;
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      confetti.style.animation = `confetti-fall ${duration}s linear forwards`;

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, (duration + 0.5) * 1000);
    }
  };

  const startContinuousConfetti = () => {
    createConfetti();
    confettiInterval = setInterval(() => {
      createConfetti();
    }, 1000);
  };

  const blowOutCandles = () => {
    if (allCandlesBlownOut) return;

    if (isBlowing()) {
      let allOut = true;
      candles.forEach((candle) => {
        if (!candle.classList.contains("out")) {
          candle.classList.add("out");
        }
      });

      // Check if all candles are out
      candles.forEach((candle) => {
        if (!candle.classList.contains("out")) {
          allOut = false;
        }
      });

      if (allOut && !allCandlesBlownOut) {
        allCandlesBlownOut = true;

        // Add webhook logging for blowing out candles
        try {
          const webhookConfig = window.birthdayConfig?.discordWebhook;
          if (webhookConfig?.url) {
            fetch(webhookConfig.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: webhookConfig.notifications?.candlesBlownOut || 'All cake candles blown out!',
              }),
            });
          }
        } catch (error) {
          console.error('Error sending webhook for candles blown out:', error);
        }

        // Play pop sound
        popSound.play().catch(err => console.log("Pop sound error:", err));

        // Play birthday music
        birthdayMusic.play().catch(err => console.log("Music error:", err));

        // Start continuous confetti
        startContinuousConfetti();

        // Enable cake click after 1 second
        setTimeout(() => {
          cakeContainer.style.cursor = 'pointer';
          cakeContainer.addEventListener('click', showCakePopup);
        }, 1000);
      }
    }
  }

  const showCakePopup = () => {
    const popup = document.getElementById('cake-popup-overlay');
    popup.classList.add('active');
    try {
      const webhookConfig = window.birthdayConfig?.discordWebhook;
      if (webhookConfig?.url) {
        fetch(webhookConfig.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: webhookConfig.notifications?.cakeClicked || 'Cake clicked and popup shown!',
          }),
        });
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  };

  const closeCakePopup = () => {
    const popup = document.getElementById('cake-popup-overlay');
    popup.classList.remove('active');
  };

  // Setup popup close handlers
  const closeBtn = document.getElementById('cake-popup-close');
  const popupOverlay = document.getElementById('cake-popup-overlay');

  closeBtn.addEventListener('click', closeCakePopup);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      closeCakePopup();
    }
  });

  // Gift box functionality
  const giftBox = document.getElementById('gift-box');
  const giftPopupOverlay = document.getElementById('gift-popup-overlay');
  const giftCloseBtn = document.getElementById('gift-popup-close');

  if (giftBox) {
    giftBox.addEventListener('click', (e) => {
      e.stopPropagation();
      giftPopupOverlay.classList.add('active');

      // Send webhook notification
      try {
        const webhookConfig = window.birthdayConfig?.discordWebhook;
        if (webhookConfig?.url) {
          fetch(webhookConfig.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: webhookConfig.notifications?.giftBoxClicked || "Gift box clicked!",
            }),
          });
        }
      } catch (error) {
        console.error('Error sending gift box webhook:', error);
      }
    });
  }

  const closeGiftPopup = () => {
    giftPopupOverlay.classList.remove('active');
  };

  if (giftCloseBtn) {
    giftCloseBtn.addEventListener('click', closeGiftPopup);
  }

  if (giftPopupOverlay) {
    giftPopupOverlay.addEventListener('click', (e) => {
      if (e.target === giftPopupOverlay) {
        closeGiftPopup();
      }
    });
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        addInitialCandles();
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
};

window.addEventListener("showCake", initCake);