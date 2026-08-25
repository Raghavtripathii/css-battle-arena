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
  {
    id: 16,
    title: 'Avatar Stack',
    difficulty: 'medium',
    description: 'Three overlapping circular avatars with a ring border.',
    timeLimit: 150,
    pointsToWin: 80,
    html: `<div class="container"><div class="stack"><div class="avatar a1"></div><div class="avatar a2"></div><div class="avatar a3"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f18;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stack {
        display: flex;
      }
      .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 3px solid #0f0f18;
        margin-left: -16px;
      }
      .a1 { background: #f472b6; margin-left: 0; z-index: 3; }
      .a2 { background: #7c6af7; z-index: 2; }
      .a3 { background: #34d399; z-index: 1; }
    `,
    hints: [
      'Each avatar is a circle (border-radius: 50%) with a border matching the page background, so it looks cut out.',
      'Negative margin-left pulls each avatar to overlap the previous one.',
      'z-index controls the stacking order — the first avatar should sit on top.',
    ],
  },
  {
    id: 17,
    title: 'Notification Badge',
    difficulty: 'easy',
    description: 'A bell icon with a small red count badge in the corner.',
    timeLimit: 110,
    pointsToWin: 85,
    html: `<div class="container"><div class="bell-wrap"><div class="bell"></div><div class="badge">3</div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #14141f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bell-wrap {
        position: relative;
        width: 60px;
        height: 60px;
      }
      .bell {
        width: 100%;
        height: 100%;
        background: #2a2a40;
        border-radius: 14px;
      }
      .badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 20px;
        height: 20px;
        background: #ef4444;
        border: 2px solid #14141f;
        border-radius: 999px;
        color: white;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
    hints: [
      'The wrapper needs position: relative so the badge can be positioned against it.',
      'The badge uses position: absolute with negative top/right offsets to sit on the corner.',
      'A border matching the page background makes the badge look cleanly cut out of the icon.',
    ],
  },
  {
    id: 18,
    title: 'Star Rating',
    difficulty: 'easy',
    description: 'Five stars, the first three filled gold and the rest dim.',
    timeLimit: 120,
    pointsToWin: 80,
    html: `<div class="container"><div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span><span class="star">★</span><span class="star">★</span></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f18;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stars {
        display: flex;
        gap: 6px;
      }
      .star {
        font-size: 36px;
        color: #2a2a40;
        line-height: 1;
      }
      .star.filled {
        color: #fbbf24;
      }
    `,
    hints: [
      'All five stars share the same base class — only the color changes for filled ones.',
      'gap on the flex container spaces the stars evenly.',
      'A single extra class (.filled) is enough to override the color for the first three.',
    ],
  },
  {
    id: 19,
    title: 'Corner Ribbon',
    difficulty: 'hard',
    description: 'A "NEW" ribbon banner diagonally across the top-right corner.',
    timeLimit: 190,
    pointsToWin: 68,
    html: `<div class="container"><div class="card"><div class="ribbon">NEW</div></div></div>`,
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
        position: relative;
        width: 220px;
        height: 160px;
        background: #17172a;
        border-radius: 12px;
        overflow: hidden;
      }
      .ribbon {
        position: absolute;
        top: 18px;
        right: -34px;
        width: 130px;
        background: #7c6af7;
        color: white;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-align: center;
        padding: 4px 0;
        transform: rotate(45deg);
      }
    `,
    hints: [
      'The card needs overflow: hidden so the ribbon\'s corners get clipped to the card shape.',
      'The ribbon is a wide box rotated 45 degrees with transform: rotate(45deg).',
      'Positioning is trial and error: nudge top/right until the rotated strip crosses the corner cleanly.',
    ],
  },
  {
    id: 20,
    title: 'Skeleton Loader',
    difficulty: 'easy',
    description: 'A loading placeholder: an avatar circle plus two text bars.',
    timeLimit: 110,
    pointsToWin: 85,
    html: `<div class="container"><div class="skeleton"><div class="avatar"></div><div class="lines"><div class="line w1"></div><div class="line w2"></div></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #14141f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .skeleton {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #262636;
        flex-shrink: 0;
      }
      .lines {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .line {
        height: 12px;
        border-radius: 4px;
        background: #262636;
      }
      .w1 { width: 140px; }
      .w2 { width: 90px; }
    `,
    hints: [
      'The avatar and text block sit side by side in a flex row with a gap.',
      'The two text lines are stacked in their own flex column, each a different width.',
      'flex-shrink: 0 on the avatar stops it from getting squeezed if space is tight.',
    ],
  },
  {
    id: 21,
    title: 'Diagonal Split',
    difficulty: 'medium',
    description: 'The background is split diagonally into two solid colors.',
    timeLimit: 130,
    pointsToWin: 85,
    html: `<div class="container"></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: linear-gradient(135deg, #7c6af7 50%, #14141f 50%);
      }
    `,
    hints: [
      'This is one gradient, not two elements — a linear-gradient with a hard color stop.',
      'Two color stops at the exact same percentage (50%, 50%) creates a sharp edge instead of a fade.',
      'The angle (135deg) controls the direction of the split.',
    ],
  },
  {
    id: 22,
    title: 'Quote Card',
    difficulty: 'medium',
    description: 'A pull-quote with a large decorative quotation mark.',
    timeLimit: 160,
    pointsToWin: 75,
    html: `<div class="container"><div class="quote"><p class="text">Design is not just what it looks like. Design is how it works.</p><div class="author">— Steve Jobs</div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #14141f;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
      .quote {
        position: relative;
        max-width: 280px;
        padding-top: 24px;
      }
      .quote::before {
        content: '"';
        position: absolute;
        top: -34px;
        left: -8px;
        font-size: 80px;
        font-weight: 800;
        color: rgba(124,106,247,0.35);
        line-height: 1;
      }
      .text {
        font-size: 16px;
        font-weight: 600;
        color: white;
        line-height: 1.5;
        margin-bottom: 12px;
      }
      .author {
        font-size: 13px;
        color: #8888a0;
      }
    `,
    hints: [
      'The giant quotation mark is generated content: .quote::before { content: \'"\'; }',
      'position: relative on .quote and position: absolute on ::before lets the mark float above the text.',
      'A dim, semi-transparent color keeps the mark decorative instead of competing with the real text.',
    ],
  },
  {
    id: 23,
    title: 'Tag List',
    difficulty: 'easy',
    description: 'A wrapped row of colored pill tags.',
    timeLimit: 120,
    pointsToWin: 85,
    html: `<div class="container"><div class="tags"><span class="tag purple">Design</span><span class="tag green">CSS</span><span class="tag pink">Frontend</span><span class="tag blue">React</span></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f18;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-width: 260px;
      }
      .tag {
        font-size: 12px;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 999px;
      }
      .purple { background: rgba(124,106,247,0.15); color: #a78bfa; }
      .green  { background: rgba(52,211,153,0.15);  color: #34d399; }
      .pink   { background: rgba(244,114,182,0.15); color: #f472b6; }
      .blue   { background: rgba(96,165,250,0.15);  color: #60a5fa; }
    `,
    hints: [
      'flex-wrap: wrap lets the tags flow onto a new line once they run out of room.',
      'Each tag pairs a soft, low-opacity background with a matching brighter text color.',
      'gap handles spacing between tags in both directions — no manual margins needed.',
    ],
  },
  {
    id: 24,
    title: 'Vertical Timeline',
    difficulty: 'hard',
    description: 'A vertical line connecting three stacked milestone dots.',
    timeLimit: 200,
    pointsToWin: 68,
    html: `<div class="container"><div class="timeline"><div class="item"><div class="dot"></div><div class="label">Started project</div></div><div class="item"><div class="dot active"></div><div class="label">In progress</div></div><div class="item"><div class="dot"></div><div class="label">Launch</div></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0b0b12;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .timeline {
        position: relative;
        padding-left: 28px;
      }
      .timeline::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: #262636;
      }
      .item {
        position: relative;
        margin-bottom: 28px;
      }
      .item:last-child { margin-bottom: 0; }
      .dot {
        position: absolute;
        left: -28px;
        top: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #262636;
        border: 2px solid #0b0b12;
      }
      .dot.active {
        background: #7c6af7;
        box-shadow: 0 0 0 3px rgba(124,106,247,0.25);
      }
      .label {
        font-size: 13px;
        color: #c4c4d4;
        font-weight: 500;
      }
    `,
    hints: [
      'The connecting line is a single absolutely-positioned ::before on the timeline container, not per-item.',
      'Each dot is absolutely positioned to the left of its label, relative to its own .item.',
      'The active dot gets a soft glow using box-shadow with a spread and no blur.',
    ],
  },
  {
    id: 25,
    title: 'Credit Card',
    difficulty: 'hard',
    description: 'A gradient credit card with a chip, number, and holder name.',
    timeLimit: 210,
    pointsToWin: 65,
    html: `<div class="container"><div class="card"><div class="chip"></div><div class="number">4029&nbsp;&nbsp;1234&nbsp;&nbsp;5678&nbsp;&nbsp;9012</div><div class="bottom"><div class="name">A. SHARMA</div><div class="expiry">05/29</div></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        width: 260px;
        height: 160px;
        border-radius: 16px;
        background: linear-gradient(135deg, #7c6af7, #4c3fc7);
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .chip {
        width: 36px;
        height: 26px;
        border-radius: 5px;
        background: rgba(255,255,255,0.6);
      }
      .number {
        font-family: monospace;
        font-size: 16px;
        letter-spacing: 0.05em;
        color: white;
        font-weight: 600;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .name, .expiry {
        font-size: 11px;
        color: rgba(255,255,255,0.85);
        font-weight: 600;
        letter-spacing: 0.03em;
      }
    `,
    hints: [
      'The card is a flex column with justify-content: space-between to spread the chip, number, and bottom row vertically.',
      'The chip is just a small rounded rectangle with a semi-transparent white fill.',
      'The bottom row (name + expiry) is its own flex row with space-between.',
    ],
  },
  {
    id: 26,
    title: 'Search Bar',
    difficulty: 'easy',
    description: 'A rounded search input with an icon on the left.',
    timeLimit: 120,
    pointsToWin: 85,
    html: `<div class="container"><div class="search"><div class="icon"></div><span class="placeholder">Search levels…</span></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0f0f18;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .search {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 240px;
        background: #1c1c2a;
        border: 1px solid #2a2a3c;
        border-radius: 10px;
        padding: 10px 14px;
      }
      .icon {
        width: 14px;
        height: 14px;
        border: 2px solid #6b6b80;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .placeholder {
        font-size: 13px;
        color: #6b6b80;
      }
    `,
    hints: [
      'The search icon is faked as a plain circle — no real magnifying glass needed at this size.',
      'A subtle 1px border in a slightly lighter shade than the background gives the input definition.',
      'flex-shrink: 0 keeps the icon circle from getting squished by the text next to it.',
    ],
  },
  {
    id: 27,
    title: 'Stat Cards Row',
    difficulty: 'medium',
    description: 'Three equal-width stat cards in a row, each with a label and number.',
    timeLimit: 150,
    pointsToWin: 80,
    html: `<div class="container"><div class="row"><div class="card"><div class="num">2.4k</div><div class="lbl">Users</div></div><div class="card"><div class="num">89%</div><div class="lbl">Uptime</div></div><div class="card"><div class="num">312</div><div class="lbl">Levels</div></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0b0b12;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .row {
        display: flex;
        gap: 12px;
        width: 100%;
      }
      .card {
        flex: 1;
        background: #17172a;
        border-radius: 12px;
        padding: 16px 12px;
        text-align: center;
      }
      .num {
        font-size: 22px;
        font-weight: 800;
        color: #a78bfa;
        margin-bottom: 4px;
      }
      .lbl {
        font-size: 11px;
        color: #8888a0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    `,
    hints: [
      'flex: 1 on each card makes all three share the row equally, regardless of content length.',
      'text-align: center keeps both the number and label centered within each card.',
      'gap on the row handles spacing — no need for margins on individual cards.',
    ],
  },
  {
    id: 28,
    title: 'Folder Icon',
    difficulty: 'medium',
    description: 'A flat folder icon built with layered boxes — no images.',
    timeLimit: 160,
    pointsToWin: 76,
    html: `<div class="container"><div class="folder"><div class="tab"></div><div class="body"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #14141f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .folder {
        position: relative;
        width: 100px;
      }
      .tab {
        width: 40px;
        height: 12px;
        background: #fbbf24;
        border-radius: 4px 4px 0 0;
      }
      .body {
        width: 100px;
        height: 68px;
        background: #fcd34d;
        border-radius: 0 8px 8px 8px;
      }
    `,
    hints: [
      'This is two stacked boxes — a small tab and a wider body directly beneath it, no clever tricks.',
      'Only round the corners that are actually visible on the outside of the shape.',
      'The tab sits flush on top of the body — no gap, no absolute positioning required.',
    ],
  },
  {
    id: 29,
    title: 'Comparison Slider',
    difficulty: 'hard',
    description: 'A before/after image slider with a vertical handle at 60%.',
    timeLimit: 190,
    pointsToWin: 70,
    html: `<div class="container"><div class="slider"><div class="before"></div><div class="after"></div><div class="handle"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0a0a0f;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slider {
        position: relative;
        width: 280px;
        height: 180px;
        border-radius: 10px;
        overflow: hidden;
      }
      .before, .after {
        position: absolute;
        top: 0;
        height: 100%;
      }
      .before { left: 0; width: 100%; background: #34d399; }
      .after  { right: 0; width: 40%; background: #7c6af7; }
      .handle {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 60%;
        width: 3px;
        background: white;
        transform: translateX(-50%);
      }
    `,
    hints: [
      'Both panels are absolutely positioned inside the slider, stacked on top of each other.',
      'Instead of clip-path, the "after" panel is simply sized to 40% width and anchored to the right edge — same visual result, simpler CSS.',
      'The handle is a thin vertical bar positioned at the same 60% split, centered with translateX(-50%).',
    ],
  },
  {
    id: 30,
    title: 'Kanban Column',
    difficulty: 'hard',
    description: 'A single kanban column header with a count badge, holding two task cards.',
    timeLimit: 200,
    pointsToWin: 68,
    html: `<div class="container"><div class="column"><div class="header"><span class="title">In Progress</span><span class="count">2</span></div><div class="task">Design the landing page</div><div class="task">Fix scoring bug</div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #0b0b12;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .column {
        width: 220px;
        background: #14141f;
        border-radius: 12px;
        padding: 14px;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .title {
        font-size: 13px;
        font-weight: 700;
        color: #c4c4d4;
      }
      .count {
        font-size: 11px;
        font-weight: 700;
        color: #a78bfa;
        background: rgba(124,106,247,0.15);
        border-radius: 999px;
        padding: 2px 8px;
      }
      .task {
        background: #1c1c2a;
        border: 1px solid #262636;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        color: #c4c4d4;
        margin-bottom: 8px;
      }
      .task:last-child { margin-bottom: 0; }
    `,
    hints: [
      'The header uses justify-content: space-between to push the title left and the count badge right.',
      'Each task card is just a bordered box — style .task once and every card inherits it.',
      'margin-bottom on .task with a :last-child override avoids trailing extra space at the bottom.',
    ],
  },
]