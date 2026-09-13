/* ============================================================
   UNDER THE SAME MOON
   PREMIUM CINEMATIC SCRIPT
   26 MONTH ANNIVERSARY
   ============================================================ */


/* ============================================================
   1. ELEMENTS
   ============================================================ */

const startScreen = document.getElementById("start-screen");
const enterButton = document.getElementById("enter-button");
const loadingScreen = document.getElementById("loading-screen");

const world = document.getElementById("world");

const rainContainer = document.getElementById("rain");
const windowRain = document.getElementById("window-rain");

const fog = document.getElementById("fog");
const lightning = document.getElementById("lightning");
const sunrise = document.getElementById("sunrise");

const darkness = document.getElementById("darkness");

const floatingWords = document.getElementById("floating-words");
const memoryStars = document.getElementById("memory-stars");

const storyLayer = document.getElementById("story-layer");
const activityLayer = document.getElementById("activity-layer");

const soundToggle = document.getElementById("sound-toggle");

const ending = document.getElementById("ending");
const stillAwake = document.getElementById("still-awake");

const scenes = {
    city: document.getElementById("city-scene"),
    forest: document.getElementById("forest-scene"),
    cabin: document.getElementById("cabin-scene"),
    cabinInterior: document.getElementById("cabin-interior"),
    lake: document.getElementById("lake-scene"),
    clearing: document.getElementById("clearing-scene")
};


/* ============================================================
   2. AUDIO
   ============================================================ */

const rainAudio = new Audio("rain.mp3");
const thunderAudio = new Audio("thunder.mp3");
const windAudio = new Audio("wind.mp3");
const fireAudio = new Audio("fire.mp3");
const waterAudio = new Audio("water.mp3");

rainAudio.loop = true;
windAudio.loop = true;
fireAudio.loop = true;
waterAudio.loop = true;

rainAudio.preload = "auto";
thunderAudio.preload = "auto";
windAudio.preload = "auto";
fireAudio.preload = "auto";
waterAudio.preload = "auto";

rainAudio.volume = 0.42;
windAudio.volume = 0.12;
thunderAudio.volume = 0.5;
fireAudio.volume = 0;
waterAudio.volume = 0;

let soundEnabled = true;


/* ============================================================
   3. STATE
   ============================================================ */

let experienceStarted = false;
let experienceFinished = false;

let thunderTimer = null;

let currentMoment = null;
let currentScene = null;

let activityPaused = false;


/* ============================================================
   4. BASIC HELPERS
   ============================================================ */

const wait = (ms) =>
    new Promise(resolve =>
        setTimeout(resolve, ms)
    );


function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}


function random(min, max) {
    return Math.random() * (max - min) + min;
}


function randomInt(min, max) {
    return Math.floor(
        random(min, max + 1)
    );
}


/* ============================================================
   5. AUDIO HELPERS
   ============================================================ */

async function startAudio() {

    if (!soundEnabled) return;

    const ambientSounds = [
        rainAudio,
        windAudio,
        fireAudio,
        waterAudio
    ];

    const names = [
        "rain",
        "wind",
        "fire",
        "water"
    ];

    const results =
        await Promise.allSettled(
            ambientSounds.map(audio =>
                audio.play()
            )
        );

    results.forEach(
        (result, index) => {

            if (
                result.status ===
                "rejected"
            ) {

                console.error(
                    `${names[index]} audio failed:`,
                    result.reason
                );
            }
        }
    );
}


function fadeAudio(
    audio,
    targetVolume,
    duration = 2500
) {

    const startVolume =
        audio.volume;

    const difference =
        targetVolume -
        startVolume;

    const startTime =
        performance.now();


    function updateVolume(now) {

        const progress =
            clamp(
                (
                    now -
                    startTime
                ) /
                duration,
                0,
                1
            );

        audio.volume =
            clamp(
                startVolume +
                difference *
                progress,
                0,
                1
            );

        if (progress < 1) {

            requestAnimationFrame(
                updateVolume
            );
        }
    }

    requestAnimationFrame(
        updateVolume
    );
}


/* ============================================================
   6. SOUND TOGGLE
   ============================================================ */

if (soundToggle) {

    soundToggle.addEventListener(
        "click",
        async () => {

            soundEnabled =
                !soundEnabled;

            if (soundEnabled) {

                soundToggle.textContent =
                    "♪";

                await startAudio();

            } else {

                soundToggle.textContent =
                    "×";

                rainAudio.pause();
                windAudio.pause();
                thunderAudio.pause();
                fireAudio.pause();
                waterAudio.pause();
            }
        }
    );
}


/* ============================================================
   7. RANDOM STAR FIELD
   ============================================================ */

function createBackgroundStars() {

    const starFields =
        document.querySelectorAll(
            ".stars"
        );

    starFields.forEach(
        (field, fieldIndex) => {

            const count =
                fieldIndex === 0
                    ? 90
                    : 55;

            for (
                let i = 0;
                i < count;
                i++
            ) {

                const star =
                    document.createElement(
                        "span"
                    );

                star.classList.add(
                    "generated-star"
                );

                const size =
                    fieldIndex === 0
                        ? random(
                              0.6,
                              1.4
                          )
                        : random(
                              1,
                              2.2
                          );

                star.style.position =
                    "absolute";

                star.style.width =
                    `${size}px`;

                star.style.height =
                    `${size}px`;

                star.style.left =
                    `${random(
                        0,
                        100
                    )}%`;

                star.style.top =
                    `${random(
                        0,
                        80
                    )}%`;

                star.style.borderRadius =
                    "50%";

                star.style.background =
                    `rgba(
                        235,
                        243,
                        247,
                        ${random(
                            0.25,
                            0.85
                        )}
                    )`;

                star.style.boxShadow =
                    `
                    0 0
                    ${random(
                        2,
                        8
                    )}px
                    rgba(
                        214,
                        232,
                        242,
                        ${random(
                            0.05,
                            0.35
                        )}
                    )
                    `;

                star.style.animation =
                    `
                    generatedTwinkle
                    ${random(
                        4,
                        11
                    )}s
                    ease-in-out
                    ${random(
                        -8,
                        0
                    )}s
                    infinite
                    alternate
                    `;

                field.appendChild(
                    star
                );
            }
        }
    );


    const style =
        document.createElement(
            "style"
        );

    style.textContent = `
        @keyframes generatedTwinkle {
            from {
                opacity: .25;
                transform: scale(.8);
            }

            to {
                opacity: 1;
                transform: scale(1.12);
            }
        }
    `;

    document.head.appendChild(
        style
    );
}


/* ============================================================
   8. PREMIUM CITY WINDOWS
   ============================================================ */

function generateCityWindows() {

    const buildings =
        document.querySelectorAll(
            ".city-layer .building"
        );

    buildings.forEach(
        building => {

            const count =
                randomInt(
                    2,
                    8
                );

            for (
                let i = 0;
                i < count;
                i++
            ) {

                if (
                    Math.random() >
                    0.55
                ) {

                    const windowLight =
                        document.createElement(
                            "span"
                        );

                    windowLight.classList.add(
                        "generated-window"
                    );

                    windowLight.style.position =
                        "absolute";

                    windowLight.style.width =
                        `${random(
                            1.2,
                            2.8
                        )}px`;

                    windowLight.style.height =
                        `${random(
                            2,
                            4
                        )}px`;

                    windowLight.style.left =
                        `${random(
                            10,
                            90
                        )}%`;

                    windowLight.style.top =
                        `${random(
                            10,
                            85
                        )}%`;

                    windowLight.style.borderRadius =
                        "1px";

                    const warm =
                        Math.random() >
                        0.25;

                    if (warm) {

                        windowLight.style.background =
                            `rgba(
                                213,
                                177,
                                124,
                                ${random(
                                    .16,
                                    .58
                                )}
                            )`;

                    } else {

                        windowLight.style.background =
                            `rgba(
                                177,
                                199,
                                211,
                                ${random(
                                    .12,
                                    .45
                                )}
                            )`;
                    }

                    windowLight.style.boxShadow =
                        `
                        0 0
                        ${random(
                            2,
                            6
                        )}px
                        currentColor
                        `;

                    building.appendChild(
                        windowLight
                    );
                }
            }
        }
    );
}


/* ============================================================
   9. CITY WINDOW FLICKER
   ============================================================ */

function startCityWindowFlicker() {

    setInterval(() => {

        if (
            currentScene !==
            "city"
        ) {
            return;
        }

        const windows =
            document.querySelectorAll(
                ".generated-window, .window-light"
            );

        if (
            windows.length === 0
        ) {
            return;
        }

        const randomWindow =
            windows[
                randomInt(
                    0,
                    windows.length - 1
                )
            ];

        const oldOpacity =
            randomWindow.style.opacity ||
            "1";

        randomWindow.style.opacity =
            Math.random() > .5
                ? ".15"
                : ".9";

        setTimeout(() => {

            randomWindow.style.opacity =
                oldOpacity;

        }, randomInt(
            300,
            1300
        ));

    }, 1800);
}


/* ============================================================
   10. RAIN
   ============================================================ */

function createRain(
    amount = 155
) {

    if (!rainContainer) return;

    rainContainer.innerHTML = "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const drop =
            document.createElement(
                "div"
            );

        drop.classList.add(
            "rain-drop"
        );


        const depth =
            Math.random();


        let length;
        let speed;
        let opacity;
        let width;


        if (depth < .5) {

            length =
                random(
                    28,
                    55
                );

            speed =
                random(
                    1.1,
                    1.7
                );

            opacity =
                random(
                    .08,
                    .18
                );

            width = .5;

        } else if (
            depth < .85
        ) {

            length =
                random(
                    55,
                    105
                );

            speed =
                random(
                    .72,
                    1.1
                );

            opacity =
                random(
                    .16,
                    .34
                );

            width = 1;

        } else {

            length =
                random(
                    100,
                    180
                );

            speed =
                random(
                    .48,
                    .75
                );

            opacity =
                random(
                    .25,
                    .48
                );

            width =
                random(
                    1,
                    1.6
                );
        }


        drop.style.left =
            `${random(
                -10,
                110
            )}%`;

        drop.style.width =
            `${width}px`;

        drop.style.setProperty(
            "--drop-length",
            `${length}px`
        );

        drop.style.setProperty(
            "--drop-speed",
            `${speed}s`
        );

        drop.style.setProperty(
            "--drop-delay",
            `${random(
                -6,
                0
            )}s`
        );

        drop.style.setProperty(
            "--drop-opacity",
            opacity
        );

        rainContainer.appendChild(
            drop
        );
    }
}


/* ============================================================
   11. WINDOW RAIN
   ============================================================ */

function createWindowRain(
    amount = 50
) {

    if (!windowRain) return;

    windowRain.innerHTML = "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const drop =
            document.createElement(
                "div"
            );

        drop.classList.add(
            "window-drop"
        );

        drop.style.left =
            `${random(
                2,
                98
            )}%`;

        drop.style.top =
            `${random(
                -20,
                90
            )}%`;

        drop.style.setProperty(
            "--size",
            `${random(
                1.5,
                5.5
            )}px`
        );

        drop.style.setProperty(
            "--duration",
            `${random(
                6,
                15
            )}s`
        );

        drop.style.setProperty(
            "--delay",
            `${random(
                -12,
                0
            )}s`
        );

        windowRain.appendChild(
            drop
        );
    }
}


/* ============================================================
   12. THUNDER
   ============================================================ */

async function triggerThunder() {

    if (
        !experienceStarted ||
        experienceFinished
    ) {
        return;
    }


    if (lightning) {

        lightning.classList.remove(
            "flash"
        );

        lightning.style.opacity =
            "0";

        void lightning.offsetWidth;


        const strength =
            random(
                .28,
                .72
            );


        lightning.style.background =
            `
            radial-gradient(
                circle at
                ${randomInt(
                    20,
                    80
                )}%
                ${randomInt(
                    5,
                    40
                )}%,
                rgba(
                    220,
                    232,
                    240,
                    ${strength}
                ),
                rgba(
                    142,
                    165,
                    181,
                    ${strength *
                    .22}
                ) 35%,
                transparent 72%
            )
            `;


        lightning.classList.add(
            "flash"
        );
    }


    if (
        Math.random() >
        .4
    ) {

        document.body.classList.add(
            "thunder-shake"
        );

        setTimeout(() => {

            document.body.classList.remove(
                "thunder-shake"
            );

        }, 450);
    }


    if (soundEnabled) {

        thunderAudio.currentTime = 0;

        thunderAudio.volume =
            random(
                .3,
                .58
            );

        thunderAudio
            .play()
            .catch(() => {});
    }
}


function scheduleThunder() {

    clearTimeout(
        thunderTimer
    );


    const nextThunder =
        randomInt(
            12000,
            28000
        );


    thunderTimer =
        setTimeout(() => {

            if (
                currentScene !==
                    "clearing" &&
                !experienceFinished
            ) {

                triggerThunder();
            }

            scheduleThunder();

        }, nextThunder);
}


/* ============================================================
   13. SCENE MANAGEMENT
   ============================================================ */

function showScene(
    sceneName,
    fadeTime = 5000
) {

    if (!scenes[sceneName]) return;


    currentScene =
        sceneName;


    Object.entries(
        scenes
    ).forEach(
        ([name, scene]) => {

            if (!scene) return;


            scene.style.transitionDuration =
                `${fadeTime}ms`;


            if (
                name ===
                sceneName
            ) {

                scene.classList.add(
                    "active"
                );

            } else {

                scene.classList.remove(
                    "active"
                );
            }
        }
    );
}


/* ============================================================
   14. SCENE CROSSFADE
   ============================================================ */

async function crossfadeScene(
    fromScene,
    toScene,
    duration = 6000
) {

    const from =
        scenes[fromScene];

    const to =
        scenes[toScene];


    currentScene =
        toScene;


    if (to) {

        to.style.transitionDuration =
            `${duration}ms`;

        to.classList.add(
            "active"
        );
    }


    await wait(
        duration * .4
    );


    if (from) {

        from.style.transitionDuration =
            `${duration}ms`;

        from.classList.remove(
            "active"
        );
    }


    await wait(
        duration * .6
    );
}


/* ============================================================
   15. CAMERA
   ============================================================ */

function setCamera(name) {

    if (!world) return;


    const cameraClasses = [
        "camera-road",
        "camera-fog",
        "camera-forest",
        "camera-cabin",
        "camera-lake",
        "camera-clearing",
        "camera-moon"
    ];


    cameraClasses.forEach(
        className => {

            world.classList.remove(
                className
            );
        }
    );


    if (name) {

        world.classList.add(
            `camera-${name}`
        );
    }
}


/* ============================================================
   16. CINEMATIC CAMERA DRIFT
   ============================================================ */

function startAmbientCamera() {

    if (!world) return;


    let driftX = 0;
    let driftY = 0;


    function moveCamera() {

        if (
            experienceFinished
        ) {
            return;
        }


        const strength =
            currentScene ===
            "forest"
                ? .32
                : .2;


        driftX =
            random(
                -strength,
                strength
            );


        driftY =
            random(
                -strength * .6,
                strength * .6
            );


        world.style.setProperty(
            "--ambient-x",
            `${driftX}%`
        );


        world.style.setProperty(
            "--ambient-y",
            `${driftY}%`
        );


        setTimeout(
            moveCamera,
            randomInt(
                7000,
                12000
            )
        );
    }


    moveCamera();
}


/* ============================================================
   17. FOREST BREATHING
   ============================================================ */

function startForestMotion() {

    const foregroundTrees =
        document.querySelectorAll(
            ".foreground-tree"
        );


    setInterval(() => {

        if (
            currentScene !==
            "forest"
        ) {
            return;
        }


        foregroundTrees.forEach(
            (tree, index) => {

                const sway =
                    random(
                        -.5,
                        .5
                    );


                tree.style.transition =
                    "transform 8s ease-in-out";


                tree.style.transform =
                    `
                    rotate(
                        ${
                            index %
                            2 === 0
                                ? sway
                                : -sway
                        }deg
                    )
                    `;
            }
        );

    }, 7000);
}


/* ============================================================
   18. WATER MOVEMENT
   ============================================================ */

function startWaterMovement() {

    const reflection =
        document.querySelector(
            ".moon-reflection"
        );


    setInterval(() => {

        if (
            currentScene !==
            "lake" ||
            !reflection
        ) {
            return;
        }


        reflection.style.transition =
            "transform 6s ease-in-out";


        reflection.style.transform =
            `
            translateX(
                calc(
                    -50% +
                    ${random(
                        -4,
                        4
                    )}px
                )
            )
            scaleX(
                ${random(
                    .92,
                    1.08
                )}
            )
            `;

    }, 5500);
}


/* ============================================================
   19. STORY MOMENTS
   ============================================================ */

function hideCurrentMoment() {

    if (currentMoment) {

        currentMoment.classList.remove(
            "active"
        );

        currentMoment = null;
    }
}


async function showMoment(
    momentId,
    holdTime = 6500
) {

    const moment =
        document.getElementById(
            momentId
        );


    if (!moment) {

        console.warn(
            `Story moment "${momentId}" was not found.`
        );

        await wait(
            holdTime
        );

        return;
    }


    hideCurrentMoment();


    currentMoment =
        moment;


    moment.classList.add(
        "active"
    );


    await wait(
        holdTime
    );


    moment.classList.remove(
        "active"
    );


    await wait(
        1800
    );


    currentMoment = null;
}


/* ============================================================
   20. FLOATING WORDS
   ============================================================ */

function spawnMemoryWord(
    text,
    x = random(
        18,
        82
    ),
    y = random(
        22,
        75
    ),
    duration = 8000
) {

    if (!floatingWords) return;


    const word =
        document.createElement(
            "div"
        );


    word.classList.add(
        "memory-word"
    );


    word.textContent =
        text;


    word.style.left =
        `${x}%`;

    word.style.top =
        `${y}%`;


    word.style.animationDuration =
        `${duration}ms`;


    word.style.transform =
        `
        rotate(
            ${random(
                -2,
                2
            )}deg
        )
        `;


    floatingWords.appendChild(
        word
    );


    setTimeout(() => {

        word.remove();

    }, duration + 500);
}


/* ============================================================
   21. NICKNAMES
   ============================================================ */

async function nicknameSequence() {

    const words = [
        "bae bee",
        "sweetheart",
        "tashyyy",
        "ameeryyy",
        "sweetie",
        "baby",
        "love",
        "twin",
        "sweet cheeks",
        "butter cup"
    ];


    for (
        const word of words
    ) {

        spawnMemoryWord(
            word,
            random(
                15,
                85
            ),
            random(
                20,
                78
            ),
            randomInt(
                6000,
                8500
            )
        );


        await wait(
            randomInt(
                700,
                1200
            )
        );
    }
}


/* ============================================================
   22. QUOTES
   ============================================================ */

async function quoteSequence() {

    const quotes = [
        "SONNNN",
        "Are we deadahh",
        "im crine bro",
        "STOP OMG",
        "DUDEEEE",
        "i wanna be babied",
        "hi twin",
        "BROOO",
        "sonion",
        "haiaiai"
    ];


    for (
        const quote of quotes
    ) {

        spawnMemoryWord(
            quote,
            random(
                10,
                88
            ),
            random(
                18,
                75
            ),
            randomInt(
                5200,
                7500
            )
        );


        await wait(
            randomInt(
                600,
                1000
            )
        );
    }
}


/* ============================================================
   23. FOG CONTROL
   ============================================================ */

function setFog(
    level = "light"
) {

    if (!fog) return;


    switch (level) {

        case "heavy":

            fog.classList.add(
                "heavy"
            );

            fog.style.opacity =
                "1";

            break;


        case "medium":

            fog.classList.remove(
                "heavy"
            );

            fog.style.opacity =
                ".7";

            break;


        default:

            fog.classList.remove(
                "heavy"
            );

            fog.style.opacity =
                ".42";

            break;
    }
}


/* ============================================================
   24. RAIN CONTROL
   ============================================================ */

function setRainIntensity(
    level = "medium"
) {

    if (!rainContainer) return;


    switch (level) {

        case "off":

            rainContainer.style.opacity =
                "0";

            fadeAudio(
                rainAudio,
                0,
                3500
            );

            break;


        case "light":

            rainContainer.style.opacity =
                ".28";

            fadeAudio(
                rainAudio,
                .2,
                3000
            );

            break;


        case "medium":

            rainContainer.style.opacity =
                ".58";

            fadeAudio(
                rainAudio,
                .42,
                3000
            );

            break;


        case "heavy":

            rainContainer.style.opacity =
                ".88";

            fadeAudio(
                rainAudio,
                .64,
                2600
            );

            break;
    }
}


/* ============================================================
   25. WIND CONTROL
   ============================================================ */

function setWind(
    volume = .12
) {

    fadeAudio(
        windAudio,
        clamp(
            volume,
            0,
            .7
        ),
        3500
    );
}


/* ============================================================
   26. MEMORY STARS
   ============================================================ */

function createMemoryStars(
    amount = 115
) {

    if (!memoryStars) return;


    memoryStars.innerHTML = "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        star.classList.add(
            "memory-star"
        );


        if (
            Math.random() >
            .82
        ) {

            star.classList.add(
                "large"
            );
        }


        star.style.left =
            `${random(
                4,
                96
            )}%`;


        star.style.top =
            `${random(
                4,
                82
            )}%`;


        star.dataset.delay =
            randomInt(
                0,
                8500
            );


        star.style.opacity =
            random(
                .45,
                1
            );


        memoryStars.appendChild(
            star
        );
    }
}


function revealMemoryStars() {

    if (!memoryStars) return;


    const stars =
        memoryStars.querySelectorAll(
            ".memory-star"
        );


    stars.forEach(
        star => {

            const delay =
                Number(
                    star.dataset.delay
                ) || 0;


            setTimeout(() => {

                star.classList.add(
                    "visible"
                );

            }, delay);
        }
    );
}


/* ============================================================
   27. ACTIVITY SYSTEM
   ============================================================ */

function showActivity(id) {

    return new Promise(
        resolve => {

            const activity =
                document.getElementById(
                    id
                );


            if (!activity) {

                console.warn(
                    `Activity "${id}" not found.`
                );

                resolve();

                return;
            }


            activityPaused = true;


            activity.classList.add(
                "active"
            );


            activity.dataset.resolve =
                "waiting";


            activity._resolveActivity =
                () => {

                    if (
                        activity.dataset.resolve !==
                        "waiting"
                    ) {
                        return;
                    }


                    activity.dataset.resolve =
                        "done";


                    activity.classList.remove(
                        "active"
                    );


                    activityPaused =
                        false;


                    setTimeout(
                        resolve,
                        1200
                    );
                };
        }
    );
}


/* ============================================================
   28. DODGE CHARGER ACTIVITY
   ============================================================ */

function setupDodgeCharger() {

    const object =
        document.getElementById(
            "dodge-charger-object"
        );


    const reveal =
        document.querySelector(
            "#dodge-charger-activity .dodge-reveal"
        );


    const activity =
        document.getElementById(
            "dodge-charger-activity"
        );


    if (
        !object ||
        !activity
    ) {
        return;
    }


    let clicked =
        false;


    object.addEventListener(
        "click",
        async () => {

            if (clicked) return;


            clicked = true;


            object.style.transition =
                "all .6s cubic-bezier(.2,.8,.2,1)";


            object.style.transform =
                `
                scale(1.12)
                rotate(3deg)
                `;


            if (reveal) {

                reveal.textContent =
                    "BRO REALLY THOUGHT I BOUGHT A DODGE CHARGER 😭";

                reveal.classList.add(
                    "show"
                );
            }


            await wait(
                1900
            );


            object.style.transform =
                `
                scale(.96)
                rotate(-2deg)
                `;


            if (reveal) {

                reveal.textContent =
                    "it was literally a phone charger 💀";
            }


            await wait(
                2500
            );


            if (
                activity._resolveActivity
            ) {

                activity._resolveActivity();
            }
        }
    );
}


/* ============================================================
   29. MHMM BATTLE
   ============================================================ */

function setupMhmmBattle() {

    const activity =
        document.getElementById(
            "mhmm-activity"
        );


    if (!activity) return;


    const arena =
        activity.querySelector(
            ".mhmm-arena"
        );


    const score =
        activity.querySelector(
            ".mhmm-score"
        );


    const button =
        activity.querySelector(
            ".mhmm-button"
        );


    if (
        !arena ||
        !button
    ) {
        return;
    }


    let userScore = 0;
    let ameerScore = 0;
    let finished = false;


    button.addEventListener(
        "click",
        () => {

            if (finished) return;


            userScore++;


            createMhmmWord(
                arena,
                "mhmm",
                random(
                    8,
                    75
                ),
                random(
                    10,
                    75
                )
            );


            if (
                Math.random() >
                .4
            ) {

                setTimeout(() => {

                    ameerScore++;


                    createMhmmWord(
                        arena,
                        "MHMMM",
                        random(
                            8,
                            75
                        ),
                        random(
                            10,
                            75
                        )
                    );


                    updateScore();

                }, randomInt(
                    160,
                    500
                ));
            }


            updateScore();


            if (
                userScore >= 8
            ) {

                finished =
                    true;


                button.disabled =
                    true;


                button.textContent =
                    "fine 😭";


                if (score) {

                    score.textContent =
                        "winner: literally nobody because neither of you knows when to stop";
                }


                setTimeout(() => {

                    if (
                        activity._resolveActivity
                    ) {

                        activity._resolveActivity();
                    }

                }, 2900);
            }
        }
    );


    function updateScore() {

        if (
            !score ||
            finished
        ) {
            return;
        }


        score.textContent =
            `tash: ${userScore} • ameer: ${ameerScore}`;
    }
}


function createMhmmWord(
    arena,
    text,
    x,
    y
) {

    const word =
        document.createElement(
            "div"
        );


    word.classList.add(
        "mhmm-word"
    );


    word.textContent =
        text;


    word.style.left =
        `${x}%`;


    word.style.top =
        `${y}%`;


    word.style.fontSize =
        `${random(
            .9,
            1.65
        )}rem`;


    word.style.transform =
        `
        rotate(
            ${random(
                -8,
                8
            )}deg
        )
        `;


    arena.appendChild(
        word
    );


    setTimeout(() => {

        word.remove();

    }, 2200);
}


/* ============================================================
   30. DARK FADE
   ============================================================ */

async function fadeToBlack(
    hold = 1200,
    fadeIn = 2500,
    fadeOut = 2500
) {

    if (!darkness) return;


    darkness.style.transitionDuration =
        `${fadeIn}ms`;


    darkness.classList.add(
        "active"
    );


    await wait(
        fadeIn + hold
    );


    darkness.style.transitionDuration =
        `${fadeOut}ms`;


    darkness.classList.remove(
        "active"
    );


    await wait(
        fadeOut
    );
}


/* ============================================================
   31. OPENING
   ============================================================ */

async function openingSequence() {

    currentScene =
        "city";


    showScene(
        "city",
        5000
    );


    setCamera(
        "road"
    );


    setRainIntensity(
        "medium"
    );


    setFog(
        "light"
    );


    setWind(
        .1
    );


    await wait(
        3500
    );


    await showMoment(
        "opening-one",
        5500
    );


    await showMoment(
        "opening-two",
        5200
    );


    await wait(
        1000
    );
}


/* ============================================================
   32. CITY / FOG
   ============================================================ */

async function cityFogSequence() {

    setCamera(
        "fog"
    );


    setFog(
        "heavy"
    );


    setRainIntensity(
        "light"
    );


    setWind(
        .17
    );


    nicknameSequence();


    await wait(
        1800
    );


    await showMoment(
        "fog-names",
        7000
    );


    await wait(
        1200
    );


    await showMoment(
        "fog-only-you",
        6500
    );


    await wait(
        900
    );
}


/* ============================================================
   33. FOREST
   ============================================================ */

async function forestSequence() {

    setFog(
        "medium"
    );


    setRainIntensity(
        "heavy"
    );


    setWind(
        .23
    );


    setCamera(
        "forest"
    );


    await crossfadeScene(
        "city",
        "forest",
        6500
    );


    quoteSequence();


    await wait(
        1000
    );


    await showMoment(
        "forest-jokes-one",
        6400
    );


    await showMoment(
        "forest-jokes-two",
        7000
    );


    await wait(
        1500
    );


    await showActivity(
        "dodge-charger-activity"
    );


    await wait(
        1200
    );


    await showMoment(
        "forest-everything",
        5800
    );


    await showActivity(
        "mhmm-activity"
    );


    await wait(
        1300
    );
}


/* ============================================================
   34. CABIN EXTERIOR
   ============================================================ */

async function cabinExteriorSequence() {

    setCamera(
        "cabin"
    );


    setRainIntensity(
        "medium"
    );


    setFog(
        "light"
    );


    setWind(
        .1
    );


    await crossfadeScene(
        "forest",
        "cabin",
        6500
    );


    await wait(
        2500
    );


    spawnMemoryWord(
        "HAI",
        60,
        40,
        6000
    );


    await wait(
        1200
    );


    spawnMemoryWord(
        "HAIAIAIAIAIA BAEE BEEE",
        30,
        66,
        7000
    );


    await wait(
        4500
    );
}


/* ============================================================
   35. CABIN INTERIOR
   ============================================================ */

async function cabinInteriorSequence() {

    if (windowRain) {

        windowRain.classList.add(
            "active"
        );
    }


    setRainIntensity(
        "light"
    );


    setWind(
        .035
    );


    fadeAudio(
        fireAudio,
        .38,
        3500
    );


    fadeAudio(
        rainAudio,
        .18,
        2500
    );


    await crossfadeScene(
        "cabin",
        "cabinInterior",
        5000
    );


    await wait(
        1900
    );


    await showMoment(
        "cabin-jokes-stop",
        5800
    );


    await showMoment(
        "cabin-talking",
        5800
    );


    await showMoment(
        "cabin-burden",
        6000
    );


    await showMoment(
        "cabin-ordinary",
        5800
    );


    await showMoment(
        "cabin-loved",
        8500
    );


    await wait(
        1200
    );


    spawnMemoryWord(
        "you tell me everything",
        55,
        60,
        8000
    );


    await wait(
        2200
    );


    spawnMemoryWord(
        "and I love that you do",
        42,
        40,
        8000
    );


    await wait(
        5000
    );


    if (windowRain) {

        windowRain.classList.remove(
            "active"
        );
    }


    fadeAudio(
        fireAudio,
        0,
        3500
    );
}


/* ============================================================
   36. LAKE
   ============================================================ */

async function lakeSequence() {

    setCamera(
        "lake"
    );


    setFog(
        "light"
    );


    setRainIntensity(
        "light"
    );


    setWind(
        .16
    );


    fadeAudio(
        waterAudio,
        .32,
        4500
    );


    await crossfadeScene(
        "cabinInterior",
        "lake",
        7000
    );


    await wait(
        2300
    );


    await showMoment(
        "lake-distance-one",
        6500
    );


    await showMoment(
        "lake-distance-two",
        7600
    );


    await wait(
        1500
    );


    spawnMemoryWord(
        "different places",
        26,
        45,
        7000
    );


    await wait(
        1300
    );


    spawnMemoryWord(
        "same sky",
        67,
        32,
        7000
    );


    await wait(
        4800
    );
}


/* ============================================================
   37. LOST IN FOG
   ============================================================ */

async function lostFogSequence() {

    fadeAudio(
        waterAudio,
        0,
        3500
    );


    setRainIntensity(
        "heavy"
    );


    setWind(
        .28
    );


    setFog(
        "heavy"
    );


    setCamera(
        "fog"
    );


    await wait(
        2800
    );


    triggerThunder();


    await wait(
        1800
    );


    await showMoment(
        "lost-one",
        6000
    );


    await showMoment(
        "lost-two",
        6000
    );


    await wait(
        1000
    );


    await showMoment(
        "lost-walking",
        6500
    );


    await wait(
        900
    );


    await showMoment(
        "lost-ameer",
        7800
    );


    await wait(
        1200
    );


    await showMoment(
        "lost-doing-better",
        7600
    );


    await wait(
        1200
    );
}


/* ============================================================
   38. CLEARING
   ============================================================ */

async function clearingSequence() {

    setFog(
        "light"
    );


    setRainIntensity(
        "off"
    );


    setWind(
        .03
    );


    setCamera(
        "clearing"
    );


    await crossfadeScene(
        "lake",
        "clearing",
        8500
    );


    await wait(
        2500
    );


    revealMemoryStars();


    await wait(
        4200
    );


    await showMoment(
        "clearing-watched-you",
        7000
    );


    await showMoment(
        "clearing-proud",
        7000
    );


    await wait(
        1300
    );


    await showMoment(
        "tash-proud",
        6800
    );


    await showMoment(
        "tash-best",
        6500
    );


    await showMoment(
        "tash-dont-give-up",
        7200
    );


    await showMoment(
        "tash-great-things",
        7200
    );


    await showMoment(
        "tash-hope-you-know",
        7000
    );


    await wait(
        1600
    );
}


/* ============================================================
   39. MOON
   ============================================================ */

async function moonSequence() {

    setCamera(
        "moon"
    );


    await wait(
        4500
    );


    await showMoment(
        "moon-long-time",
        6000
    );


    await showMoment(
        "moon-laugh",
        4800
    );


    await showMoment(
        "moon-rage",
        5000
    );


    await showMoment(
        "moon-dude",
        5000
    );


    await showMoment(
        "moon-babied",
        5200
    );


    await wait(
        1000
    );


    await showMoment(
        "moon-love-her",
        6000
    );


    await showMoment(
        "moon-she-loves-you",
        8200
    );


    await wait(
        1800
    );
}


/* ============================================================
   40. SUNRISE
   ============================================================ */

async function sunriseSequence() {

    setCamera(
        "clearing"
    );


    if (sunrise) {

        sunrise.classList.add(
            "active"
        );
    }


    setWind(
        .06
    );


    await wait(
        5000
    );


    await showMoment(
        "sunrise-meaning",
        7000
    );


    await showMoment(
        "sunrise-roof",
        8500
    );


    await wait(
        4000
    );
}


/* ============================================================
   41. ENDING
   ============================================================ */

async function endingSequence() {

    experienceFinished =
        true;


    clearTimeout(
        thunderTimer
    );


    setRainIntensity(
        "off"
    );


    fadeAudio(
        windAudio,
        0,
        4000
    );


    fadeAudio(
        fireAudio,
        0,
        3000
    );


    fadeAudio(
        waterAudio,
        0,
        3000
    );


    await fadeToBlack(
        1500,
        3500,
        2200
    );


    if (ending) {

        ending.classList.add(
            "active"
        );
    }


    await wait(
        6000
    );


    const chaos =
        document.querySelector(
            ".final-chaos"
        );


    if (chaos) {

        chaos.textContent =
            "HAIAIAIAIAIA BAEE BEEE";


        chaos.classList.add(
            "show"
        );
    }


    await wait(
        5000
    );


    if (ending) {

        ending.classList.remove(
            "active"
        );
    }


    if (darkness) {

        darkness.style.transitionDuration =
            "2800ms";


        darkness.classList.add(
            "active"
        );
    }


    await wait(
        3300
    );


    rainAudio.volume =
        .12;


    if (soundEnabled) {

        rainAudio
            .play()
            .catch(() => {});
    }


    await wait(
        3500
    );


    if (stillAwake) {

        stillAwake.textContent =
            "...unless you're still awake.";


        stillAwake.classList.add(
            "show"
        );
    }
}


/* ============================================================
   42. FULL EXPERIENCE
   ============================================================ */

async function runExperience() {

    if (
        experienceStarted
    ) {
        return;
    }


    experienceStarted =
        true;


    await startAudio();


    createRain();
    createWindowRain();
    createMemoryStars();


    scheduleThunder();


    startAmbientCamera();


    if (startScreen) {

        startScreen.classList.add(
            "hidden"
        );
    }


    await wait(
        2200
    );


    if (loadingScreen) {

        loadingScreen.classList.add(
            "active"
        );
    }


    await wait(
        1800
    );


    if (loadingScreen) {

        loadingScreen.classList.remove(
            "active"
        );
    }


    await wait(
        2200
    );


    await openingSequence();

    await cityFogSequence();

    await forestSequence();

    await cabinExteriorSequence();

    await cabinInteriorSequence();

    await lakeSequence();

    await lostFogSequence();

    await clearingSequence();

    await moonSequence();

    await sunriseSequence();

    await endingSequence();
}


/* ============================================================
   43. START BUTTON
   ============================================================ */

if (enterButton) {

    enterButton.addEventListener(
        "click",
        runExperience,
        {
            once: true
        }
    );
}


/* ============================================================
   44. ACTIVITY SETUP
   ============================================================ */

setupDodgeCharger();

setupMhmmBattle();


/* ============================================================
   45. INITIAL VISUAL SETUP
   ============================================================ */

window.addEventListener(
    "load",
    () => {

        createBackgroundStars();

        generateCityWindows();

        createRain();

        createWindowRain();

        createMemoryStars();

        startCityWindowFlicker();

        startForestMotion();

        startWaterMovement();
    }
);


/* ============================================================
   46. TAB VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !experienceStarted
        ) {
            return;
        }


        if (
            document.hidden
        ) {

            rainAudio.pause();

            windAudio.pause();

            thunderAudio.pause();

            fireAudio.pause();

            waterAudio.pause();

        } else if (
            soundEnabled
        ) {

            rainAudio
                .play()
                .catch(() => {});


            windAudio
                .play()
                .catch(() => {});


            fireAudio
                .play()
                .catch(() => {});


            waterAudio
                .play()
                .catch(() => {});
        }
    }
);