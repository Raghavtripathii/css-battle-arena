import type { Level } from '../types'

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Dead Center',
    difficulty: 'easy',
    description: 'Center the red box perfectly in the middle of the screen.',
    timeLimit: 90,
    pointsToWin: 85,
    html: `<div class="container"><div class="box"></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #1a1a2e;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .box {
        width: 80px;
        height: 80px;
        background: #e63946;
        border-radius: 4px;
      }
    `,
    hints: [
      'The container uses flexbox.',
      'Two properties: align-items and justify-content.',
      'Both are set to center.',
    ],
  },
  {
    id: 2,
    title: 'Perfect Circle',
    difficulty: 'easy',
    description: 'Turn the square div into a perfect circle with a gradient.',
    timeLimit: 90,
    pointsToWin: 83,
    html: `<div class="container"><div class="circle"></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f23;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
      }
    `,
    hints: [
      'border-radius: 50% makes any square into a circle.',
      'Use linear-gradient for the background.',
      'The gradient goes from #667eea to #764ba2 at 135 degrees.',
    ],
  },
  {
    id: 3,
    title: 'Three Columns',
    difficulty: 'easy',
    description: 'Create three equal-width columns side by side.',
    timeLimit: 120,
    pointsToWin: 83,
    html: `<div class="container"><div class="col"></div><div class="col"></div><div class="col"></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #16213e;
        display: flex;
        gap: 12px;
        padding: 12px;
      }
      .col {
        flex: 1;
        background: #0f3460;
        border-radius: 6px;
      }
    `,
    hints: [
      'The container is a flex row.',
      'Each column uses flex: 1 to share space equally.',
      'There is a gap of 12px and padding of 12px on the container.',
    ],
  },
  {
    id: 4,
    title: 'Card Shadow',
    difficulty: 'easy',
    description: 'Build a white card with a soft shadow on a grey background.',
    timeLimit: 120,
    pointsToWin: 80,
    html: `<div class="container"><div class="card"><div class="title"></div><div class="line"></div><div class="line short"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        width: 240px;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      }
      .title {
        height: 16px;
        background: #1a1a2e;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      .line {
        height: 10px;
        background: #e0e0e0;
        border-radius: 3px;
        margin-bottom: 8px;
      }
      .line.short { width: 60%; }
    `,
    hints: [
      'The outer container has a light grey background (#f0f2f5).',
      'The card uses box-shadow with rgba for transparency.',
      'The short line uses width: 60% relative to the card.',
    ],
  },
  {
    id: 5,
    title: 'Flag of France',
    difficulty: 'medium',
    description: 'Recreate the French flag — three equal vertical stripes.',
    timeLimit: 150,
    pointsToWin: 85,
    html: `<div class="container"><div class="flag"><div class="stripe"></div><div class="stripe"></div><div class="stripe"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #2d2d2d;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .flag {
        width: 270px;
        height: 180px;
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 16px rgba(0,0,0,0.4);
      }
      .stripe { flex: 1; height: 100%; }
      .stripe:nth-child(1) { background: #002395; }
      .stripe:nth-child(2) { background: #ffffff; }
      .stripe:nth-child(3) { background: #ed2939; }
    `,
    hints: [
      'The flag is a flex container with three children.',
      'Each stripe uses flex: 1 to fill equal width.',
      'Use nth-child to color each stripe differently.',
    ],
  },
  {
    id: 6,
    title: 'Loading Spinner',
    difficulty: 'medium',
    description: 'Build an animated circular loading spinner.',
    timeLimit: 150,
    pointsToWin: 75,
    html: `<div class="container"><div class="spinner"></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .spinner {
        width: 64px;
        height: 64px;
        border: 5px solid rgba(124, 106, 247, 0.2);
        border-top-color: #7c6af7;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
    hints: [
      'The spinner is a circle with border-radius: 50%.',
      'Most of the border is transparent — only border-top-color is visible.',
      'The animation rotates from 0 to 360deg infinitely.',
    ],
  },
  {
    id: 7,
    title: 'CSS Grid Layout',
    difficulty: 'medium',
    description: 'Build a 2×2 grid of coloured boxes with a gap.',
    timeLimit: 150,
    pointsToWin: 83,
    html: `<div class="container"><div class="grid"><div class="cell a"></div><div class="cell b"></div><div class="cell c"></div><div class="cell d"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #111118;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 10px;
        width: 200px;
        height: 200px;
      }
      .cell { border-radius: 8px; }
      .a { background: #f87171; }
      .b { background: #fbbf24; }
      .c { background: #34d399; }
      .d { background: #60a5fa; }
    `,
    hints: [
      'The grid uses display: grid with two columns and two rows.',
      'grid-template-columns: 1fr 1fr creates two equal columns.',
      'Each cell has a different background color.',
    ],
  },
  {
    id: 8,
    title: 'Neon Button',
    difficulty: 'hard',
    description: 'Create a glowing neon button.',
    timeLimit: 180,
    pointsToWin: 75,
    html: `<div class="container"><button class="btn">Click Me</button></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #050510;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn {
        padding: 14px 36px;
        background: transparent;
        border: 2px solid #7c6af7;
        color: #7c6af7;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        box-shadow: 0 0 20px rgba(124,106,247,0.4), inset 0 0 20px rgba(124,106,247,0.05);
      }
    `,
    hints: [
      'The button has a transparent background with a colored border.',
      'box-shadow creates the glow — use rgba with low opacity.',
      'The text uses letter-spacing and text-transform: uppercase.',
    ],
  },
  {
    id: 9,
    title: 'Split Hero',
    difficulty: 'hard',
    description: 'Two-tone hero section with a diagonal cut between panels.',
    timeLimit: 180,
    pointsToWin: 70,
    html: `<div class="hero"><div class="left"><div class="headline"></div><div class="sub"></div></div><div class="right"></div></div>`,
    targetCSS: `
      .hero {
        width: 400px;
        height: 300px;
        display: flex;
        overflow: hidden;
      }
      .left {
        flex: 1;
        background: #0d0d18;
        padding: 40px 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
      }
      .right {
        flex: 0.7;
        background: linear-gradient(135deg, #7c6af7, #f472b6);
        margin-left: -40px;
      }
      .headline {
        height: 20px;
        background: white;
        border-radius: 4px;
        margin-bottom: 12px;
        width: 80%;
      }
      .sub {
        height: 12px;
        background: rgba(255,255,255,0.3);
        border-radius: 3px;
        width: 60%;
      }
    `,
    hints: [
      'The left panel uses clip-path: polygon to create the diagonal cut.',
      'The right panel overlaps slightly using a negative margin-left.',
      'The right panel uses a linear-gradient background.',
    ],
  },
  {
    id: 10,
    title: 'Glassmorphism Card',
    difficulty: 'hard',
    description: 'A frosted glass card over a gradient background.',
    timeLimit: 200,
    pointsToWin: 70,
    html: `<div class="container"><div class="glass"><div class="avatar"></div><div class="name"></div><div class="role"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .glass {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 32px;
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        border: 2px solid rgba(255,255,255,0.6);
      }
      .name {
        height: 14px;
        width: 100px;
        background: white;
        border-radius: 4px;
      }
      .role {
        height: 10px;
        width: 70px;
        background: rgba(255,255,255,0.5);
        border-radius: 3px;
      }
    `,
    hints: [
      'The glass effect uses background: rgba(255,255,255,0.15).',
      'backdrop-filter: blur(12px) creates the frosted look.',
      'The border is rgba(255,255,255,0.3) — semi-transparent white.',
    ],
  },
  {
    id: 11,
    title: 'Progress Bar',
    difficulty: 'easy',
    description: 'Build a rounded progress bar filled to 65%.',
    timeLimit: 100,
    pointsToWin: 85,
    html: `<div class="container"><div class="track"><div class="fill"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #14141f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .track {
        width: 240px;
        height: 16px;
        background: #262636;
        border-radius: 999px;
        overflow: hidden;
      }
      .fill {
        width: 65%;
        height: 100%;
        background: linear-gradient(90deg, #7c6af7, #a78bfa);
        border-radius: 999px;
      }
    `,
    hints: [
      'The outer track uses border-radius: 999px for a full pill shape.',
      'overflow: hidden on the track clips the inner fill to the same rounded shape.',
      'The fill is 65% width with its own gradient background.',
    ],
  },
  {
    id: 12,
    title: 'Speech Bubble',
    difficulty: 'medium',
    description: 'A chat bubble with a small triangular tail.',
    timeLimit: 150,
    pointsToWin: 78,
    html: `<div class="container"><div class="bubble">Hello!</div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #f5f6fa;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bubble {
        position: relative;
        background: #7c6af7;
        color: white;
        font-size: 15px;
        font-weight: 600;
        padding: 14px 22px;
        border-radius: 16px;
      }
      .bubble::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 28px;
        border-width: 10px 10px 0 0;
        border-style: solid;
        border-color: #7c6af7 transparent transparent transparent;
      }
    `,
    hints: [
      'The tail is a ::after pseudo-element, not a separate div.',
      'A CSS triangle is made from a box with zero width/height and solid borders on only some sides.',
      'position: relative on .bubble lets the tail be positioned absolutely against it.',
    ],
  },
  {
    id: 13,
    title: 'Toggle Switch',
    difficulty: 'medium',
    description: 'An iOS-style toggle switch in the "on" position.',
    timeLimit: 150,
    pointsToWin: 82,
    html: `<div class="container"><div class="switch"><div class="knob"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f18;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .switch {
        width: 64px;
        height: 34px;
        background: #34d399;
        border-radius: 999px;
        display: flex;
        align-items: center;
        padding: 3px;
        justify-content: flex-end;
      }
      .knob {
        width: 28px;
        height: 28px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
    `,
    hints: [
      'The track is a flex container with padding acting as the inner margin.',
      'justify-content: flex-end pushes the knob to the right side (the "on" state).',
      'The knob is a plain circle — border-radius: 50% on a square.',
    ],
  },
  {
    id: 14,
    title: 'Pricing Card',
    difficulty: 'hard',
    description: 'A pricing card with a gradient border and highlighted price.',
    timeLimit: 200,
    pointsToWin: 72,
    html: `<div class="container"><div class="card"><div class="badge">Popular</div><div class="price">$29<span>/mo</span></div><div class="line"></div><div class="line"></div><div class="line short"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0b0b12;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        width: 220px;
        background: #17172a;
        border: 1px solid transparent;
        border-radius: 16px;
        padding: 24px;
        background-image: linear-gradient(#17172a, #17172a), linear-gradient(135deg, #7c6af7, #f472b6);
        background-origin: border-box;
        background-clip: padding-box, border-box;
      }
      .badge {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #f472b6;
        background: rgba(244,114,182,0.12);
        padding: 4px 10px;
        border-radius: 999px;
        margin-bottom: 16px;
      }
      .price {
        font-size: 32px;
        font-weight: 800;
        color: white;
        margin-bottom: 20px;
      }
      .price span {
        font-size: 14px;
        font-weight: 500;
        color: #8888a0;
      }
      .line {
        height: 8px;
        background: #2a2a40;
        border-radius: 3px;
        margin-bottom: 10px;
      }
      .line.short { width: 60%; }
    `,
    hints: [
      'A gradient border on a rounded box uses two background-image layers with background-clip.',
      'The badge is a small pill using rgba background so the text color shows through faintly.',
      'The price uses a nested <span> styled smaller and dimmer for the "/mo" part.',
    ],
  },
  {
    id: 15,
    title: 'Checkerboard',
    difficulty: 'hard',
    description: 'A checkerboard pattern made without any extra HTML elements.',
    timeLimit: 180,
    pointsToWin: 78,
    html: `<div class="container"><div class="board"></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .board {
        width: 240px;
        height: 240px;
        background-color: #1a1a2e;
        background-image:
          linear-gradient(45deg, #7c6af7 25%, transparent 25%, transparent 75%, #7c6af7 75%),
          linear-gradient(45deg, #7c6af7 25%, transparent 25%, transparent 75%, #7c6af7 75%);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
        border-radius: 8px;
      }
    `,
    hints: [
      'The entire pattern is built with two overlapping linear-gradient backgrounds — no extra divs.',
      'background-size sets the size of one repeating tile.',
      'background-position offsets the second gradient layer by half a tile to create the checker offset.',
    ],
  },
]