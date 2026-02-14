// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("./customize.json")
    .then(data => data.json())
    .then(config => {
      // Helper function to get nested values
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
      };

      // Load metadata (title, meta tags)
      const metadataElements = document.querySelectorAll('[data-template^="metadata."]');
      metadataElements.forEach(element => {
        const templatePath = element.getAttribute('data-template');
        const value = getNestedValue(config, templatePath);
        if (value) {
          if (element.tagName === 'TITLE') {
            element.textContent = value;
          } else if (element.tagName === 'META') {
            element.setAttribute('content', value);
          }
        }
      });

      // Create a mapping from data-node-name to the new nested structure
      const dataNodeMapping = {
        // initialGreeting mappings
        'greeting': 'initialGreeting.greeting',
        'name': 'initialGreeting.name',
        'greetingText': 'initialGreeting.subtext',
        'text1': 'initialGreeting.announcement',
        'textInChatBox': 'initialGreeting.chatBoxMessage',
        'sendButtonLabel': 'initialGreeting.sendButtonLabel',
        'text2': 'initialGreeting.reactionsSequence.0',
        'text3': 'initialGreeting.reactionsSequence.1',
        'text4': 'initialGreeting.reactionsSequence.2.text',
        'text4Adjective': 'initialGreeting.reactionsSequence.2.emphasize',
        'text5Entry': 'initialGreeting.reactionsSequence.3',
        'text5Content': 'initialGreeting.reactionsSequence.4.text',
        'smiley': 'initialGreeting.reactionsSequence.4.smiley',
        'bigTextPart1': 'initialGreeting.reactionsSequence.5.drumRoll1',
        'bigTextPart2': 'initialGreeting.reactionsSequence.5.drumRoll2',
        // birthdayWish mappings
        'imagePath': 'birthdayWish.recipientImage',
        'wishHeading': 'birthdayWish.mainWish',
        'wishText': 'birthdayWish.message',
        // outro mappings
        'outroText': 'outro.message',
        'replayText': 'outro.replayText',
        'outroSmiley': 'outro.smiley'
      };

      // Load all data-node-name elements using the mapping
      let loadedCount = 0;
      const totalMappings = Object.keys(dataNodeMapping).length;

      Object.keys(dataNodeMapping).forEach((nodeName, index) => {
        const path = dataNodeMapping[nodeName];
        const value = getNestedValue(config, path);

        if (value !== undefined && value !== "") {
          const element = document.querySelector(`[data-node-name="${nodeName}"]`);
          if (element) {
            if (nodeName === "imagePath") {
              element.setAttribute("src", value);
            } else {
              element.innerText = value;
            }
          }
        }

        loadedCount++;
        // Check if all mappings are loaded - Run animation if so
        if (loadedCount === totalMappings) {
          animationTimeline();
        }
      });

      // Load scrapbook section
      if (config.scrapbook) {
        const scrapbookBtn = document.querySelector('[data-template="scrapbook.buttonLabel"]');
        if (scrapbookBtn && config.scrapbook.buttonLabel) {
          scrapbookBtn.textContent = config.scrapbook.buttonLabel;
        }

        // Load scrapbook images
        if (config.scrapbook.images) {
          config.scrapbook.images.forEach((imgSrc, index) => {
            const img = document.querySelector(`[data-template="scrapbook.images.${index}"]`);
            if (img) {
              img.setAttribute('src', imgSrc);
            }
          });
        }

        // Load scrapbook message
        const messageArea = document.querySelector('[data-template="scrapbook.message"]');
        if (messageArea && config.scrapbook.message) {
          messageArea.innerHTML = config.scrapbook.message.map(p => `<p>${p}</p>`).join('');
        }

        const readyBtn = document.querySelector('[data-template="scrapbook.readyButtonLabel"]');
        if (readyBtn && config.scrapbook.readyButtonLabel) {
          readyBtn.textContent = config.scrapbook.readyButtonLabel;
        }
      }

      // Load cake room section
      if (config.cakeRoom) {
        const cakeTitle = document.querySelector('[data-template="cakeRoom.title"]');
        if (cakeTitle && config.cakeRoom.title) {
          cakeTitle.textContent = config.cakeRoom.title;
        }

        const cakePopupContent = document.querySelector('[data-template="cakeRoom.popup"]');
        if (cakePopupContent && config.cakeRoom.popup) {
          const messages = config.cakeRoom.popup.messages;
          const emojis = config.cakeRoom.popup.emojis;
          cakePopupContent.innerHTML = messages.map((msg, i) =>
            `<p>${msg}<span class="cake-popup-emoji">${emojis[i] || ''}</span></p>`
          ).join('');
        }
      }

      // Load gift box popup
      if (config.giftBox) {
        const giftPopupContent = document.querySelector('[data-template="giftBox.popup"]');
        if (giftPopupContent && config.giftBox.popup) {
          const messages = config.giftBox.popup.messages;
          const emojis = config.giftBox.popup.emojis;
          giftPopupContent.innerHTML = messages.map((msg, i) =>
            `<p>${msg} <span class="gift-popup-emoji">${emojis[i] || ''}</span></p>`
          ).join('');
        }
      }

      // Store config globally for use by cake.js
      window.birthdayConfig = config;
    });
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = hbd.innerHTML
    .split("")
    .map(char => (char === " " ? '<span class="space-char"> </span>' : `<span>${char}</span>`))
    .join("");

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 360,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400
      },
      {
        opacity: 1,
        y: -1000
      },
      0.2
    )
    .from(
      ".kizzy-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    )
    .to(
      "#scrapbook-btn-container",
      0.5,
      {
        autoAlpha: 1
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Preload audio function - DEFINED FIRST
  const preloadAudio = () => {
    const birthdayMusic = document.getElementById("birthday-music");
    const popSound = document.getElementById("pop-sound");

    // Load the audio files into memory
    birthdayMusic.load();
    popSound.load();
  };

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });

  const scrapbookBtn = document.getElementById("scrapbook-btn");
  const scrapbookContainer = document.getElementById("scrapbook-container");
  const readyBtn = document.getElementById("ready-btn");

  scrapbookBtn.addEventListener("click", () => {
    // Hide the button
    TweenMax.to("#scrapbook-btn-container", 0.5, {
      autoAlpha: 0
    });
    // Show the scrapbook
    TweenMax.to(scrapbookContainer, 0.5, {
      autoAlpha: 1
    });
    // Preload audio - NOW IT'S DEFINED
    preloadAudio();
  });

  const cakeRoom = document.getElementById("cake-room");

  readyBtn.addEventListener("click", () => {
    // Hide the scrapbook
    TweenMax.to(scrapbookContainer, 0.5, {
      autoAlpha: 0,
      onComplete: () => {
        // Show the cake room
        TweenMax.to(cakeRoom, 0.5, {
          autoAlpha: 1
        });
        // Dispatch the event to initialize the cake script
        window.dispatchEvent(new Event("showCake"));
      }
    });
  });
};

// Run fetch and animation in sequence
fetchData();