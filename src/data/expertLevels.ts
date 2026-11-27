import type { Level } from '../types'

// The Expert pack — the hardest levels in the game. They lean on things the
// earlier levels barely touch: border-trick triangles, box-shadow star fields,
// rotated elements with custom transform-origins, grid-template-areas, and
// pseudo-elements. Ids continue straight on from the core levels (42+).
export const EXPERT_LEVELS: Level[] = [
  {
    id: 42,
    isNew: true,
    title: 'Pixel Rocket',
    difficulty: 'expert',
    description: 'A rocket on a starry sky: gradient body, porthole, two fins, a layered flame and a planet horizon.',
    timeLimit: 420,
    pointsToWin: 95,
    html: `<div class="container"><div class="stars"></div><div class="rocket"><div class="window"></div><div class="fin left"></div><div class="fin right"></div><div class="flame"></div></div></div>`,
    targetCSS: `
      .container {
        position: relative;
        width: 400px;
        height: 300px;
        background: linear-gradient(180deg, #1e1b4b, #6d28d9);
        overflow: hidden;
      }
      .container::after {
        content: '';
        position: absolute;
        bottom: -110px;
        left: 50%;
        margin-left: -260px;
        width: 520px;
        height: 210px;
        border-radius: 50%;
        background: #fb923c;
        box-shadow: 0 -8px 0 #fdba74;
      }
      .stars {
        position: absolute;
        top: 30px;
        left: 40px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow:
          90px 70px 0 #fde68a,
          250px 90px 0 #ffffff,
          290px 20px 0 #fde68a,
          330px 120px 0 #ffffff,
          0 150px 0 #fde68a,
          300px 160px 0 #ffffff,
          60px 110px 0 #ffffff;
      }
      .rocket {
        position: absolute;
        top: 28px;
        left: 50%;
        margin-left: -46px;
        width: 92px;
        height: 190px;
        background: linear-gradient(90deg, #d4d4e8, #ffffff 45%, #b9b9d4);
        border-radius: 50% 50% 16px 16px / 60% 60% 16px 16px;
        z-index: 2;
      }
      .window {
        position: absolute;
        top: 56px;
        left: 50%;
        margin-left: -19px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #1e1b4b;
        border: 5px solid #fbbf24;
      }
      .fin {
        position: absolute;
        bottom: 0;
        width: 36px;
        height: 70px;
        background: #f43f5e;
      }
      .fin.left {
        left: -28px;
        border-radius: 50px 0 8px 0;
      }
      .fin.right {
        right: -28px;
        border-radius: 0 50px 0 8px;
      }
      .flame {
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -18px;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-top: 56px solid #fbbf24;
      }
      .flame::after {
        content: '';
        position: absolute;
        top: -56px;
        left: -9px;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-top: 32px solid #ef4444;
      }
    `,
    hints: [
      'The stars are ONE tiny 3px dot — every other star is a comma-separated box-shadow offset from it. The planet is the container\'s ::after: a wide oval pushed below the bottom edge.',
      'Body shape: border-radius with a slash (50% 50% 16px 16px / 60% 60% 16px 16px) makes the pointed top. The fins sit at the bottom, hanging 28px outside each side, with opposite rounded corners.',
      'The flame is a zero-size box drawn with borders: transparent left/right + a coloured border-top makes a downward triangle. The inner red flame is a smaller triangle on its ::after.',
    ],
  },
  {
    id: 43,
    isNew: true,
    title: 'Sunset Valley',
    difficulty: 'expert',
    description: 'A gradient sky, a glowing sun, two overlapping mountains and a lake with the sun reflected in it.',
    timeLimit: 420,
    pointsToWin: 94,
    html: `<div class="container"><div class="sun"></div><div class="mount back"></div><div class="mount front"></div><div class="lake"></div></div>`,
    targetCSS: `
      .container {
        position: relative;
        width: 400px;
        height: 300px;
        background: linear-gradient(180deg, #0f172a 0%, #7e22ce 35%, #fb7185 65%, #fdba74 100%);
        overflow: hidden;
      }
      .sun {
        position: absolute;
        top: 96px;
        left: 50%;
        margin-left: -52px;
        width: 104px;
        height: 104px;
        border-radius: 50%;
        background: linear-gradient(180deg, #fef08a, #f97316);
        box-shadow: 0 0 40px rgba(253, 186, 116, 0.6);
      }
      .mount {
        position: absolute;
        bottom: 82px;
        width: 0;
        height: 0;
        border-left: 160px solid transparent;
        border-right: 160px solid transparent;
      }
      .back {
        left: -80px;
        border-bottom: 150px solid #4c1d95;
      }
      .front {
        right: -90px;
        border-bottom: 120px solid #1e1b4b;
      }
      .lake {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 82px;
        background: linear-gradient(180deg, #312e81, #0f172a);
      }
      .lake::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        margin-left: -38px;
        width: 76px;
        height: 46px;
        border-radius: 50%;
        background: rgba(251, 191, 36, 0.6);
      }
    `,
    hints: [
      'The sky is one 4-stop linear-gradient from near-black navy (#0f172a) at the top to peach (#fdba74) at the bottom — the purple and pink stops sit at 35% and 65%.',
      'Mountains are triangles made with borders (width 0, left/right transparent, coloured border-bottom). They both sit exactly on the lake\'s top edge and overlap the sun and each other.',
      'The reflection is the lake\'s ::before: a semi-transparent amber oval centered under the sun. The sun itself has a soft glow from a large blurred box-shadow.',
    ],
  },
  {
    id: 44,
    isNew: true,
    title: 'Pricing Tiers',
    difficulty: 'expert',
    description: 'Three pricing cards side by side; the middle one is highlighted, enlarged and wears a floating badge.',
    timeLimit: 480,
    pointsToWin: 94,
    html: `<div class="container"><div class="plan"><div class="name">Free</div><div class="price">$0</div><ul><li>1 project</li><li>Basic stats</li></ul><div class="cta">Start</div></div><div class="plan pro"><div class="badge">Popular</div><div class="name">Pro</div><div class="price">$12</div><ul><li>10 projects</li><li>Analytics</li><li>Support</li></ul><div class="cta">Upgrade</div></div><div class="plan"><div class="name">Team</div><div class="price">$29</div><ul><li>Unlimited</li><li>SSO login</li></ul><div class="cta">Contact</div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #1e1b4b;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .plan {
        position: relative;
        width: 112px;
        padding: 20px 12px 14px;
        background: #ffffff;
        border: 1px solid #e0e0f0;
        border-radius: 14px;
        text-align: center;
      }
      .pro {
        background: linear-gradient(160deg, #8b7bff, #5b3fd6);
        border-color: #c4b5fd;
        transform: scale(1.08);
        padding-top: 26px;
      }
      .badge {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 3px 10px;
        background: #fbbf24;
        color: #1e1b4b;
        font-size: 8px;
        font-weight: 700;
        border-radius: 999px;
        white-space: nowrap;
      }
      .name {
        color: #6b6b8a;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      .price {
        margin: 6px 0 12px;
        color: #1e1b4b;
        font-size: 30px;
        font-weight: 800;
      }
      ul {
        list-style: none;
      }
      li {
        padding: 7px 0;
        color: #4b4b6b;
        font-size: 9px;
        border-top: 1px solid #e8e8f4;
      }
      .cta {
        margin-top: 14px;
        padding: 8px 0;
        background: #1e1b4b;
        color: #ffffff;
        font-size: 10px;
        font-weight: 600;
        border-radius: 8px;
      }
      .pro .name { color: #ddd6fe; }
      .pro .price { color: #ffffff; }
      .pro li {
        color: #ede9fe;
        border-top-color: rgba(255, 255, 255, 0.25);
      }
      .pro .cta {
        background: #fbbf24;
        color: #1e1b4b;
      }
    `,
    hints: [
      'The container is a flex row, centered both ways, with a 10px gap. Every card is 112px wide, white, with the same padding and a 1px border.',
      'The Pro card is the same box with a gradient background, a purple border, transform: scale(1.08) and extra top padding. The badge is position:absolute, pulled up with top:-10px and centered with left:50% + translateX(-50%).',
      'Feature rows are list items with no bullets (list-style: none), 7px vertical padding and only a border-top. The name is small uppercase text with letter-spacing; the buttons are rounded 8px blocks, dark on normal cards and yellow on the Pro card (override with .pro .cta).',
    ],
  },
  {
    id: 45,
    isNew: true,
    title: 'Analytics Dashboard',
    difficulty: 'expert',
    description: 'A named-area CSS grid: sidebar, top bar, three coloured stat tiles, a bar chart and an activity feed.',
    timeLimit: 480,
    pointsToWin: 96,
    html: `<div class="container"><div class="dash"><div class="side"></div><div class="top"></div><div class="stat s1"></div><div class="stat s2"></div><div class="stat s3"></div><div class="chart"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div><div class="feed"><div class="row"></div><div class="row"></div><div class="row"></div><div class="row"></div></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #eef0ff;
      }
      .dash {
        display: grid;
        width: 100%;
        height: 100%;
        padding: 12px;
        gap: 8px;
        grid-template-columns: 56px 1fr 1fr 1fr;
        grid-template-rows: 36px 70px 1fr;
        grid-template-areas:
          "side top top top"
          "side s1 s2 s3"
          "side chart chart feed";
      }
      .side  { grid-area: side;  background: #1e1b4b; border-radius: 10px; }
      .top   { grid-area: top;   background: #ffffff; border-radius: 10px; }
      .s1    { grid-area: s1;    background: #7c6af7; border-top: 4px solid #4c3fc4; }
      .s2    { grid-area: s2;    background: #34d399; border-top: 4px solid #059669; }
      .s3    { grid-area: s3;    background: #fbbf24; border-top: 4px solid #d97706; }
      .stat {
        border-radius: 10px;
      }
      .chart {
        grid-area: chart;
        display: flex;
        align-items: flex-end;
        gap: 6px;
        padding: 10px;
        background: #ffffff;
        border-radius: 10px;
      }
      .bar {
        flex: 1;
        background: #7c6af7;
        border-radius: 3px 3px 0 0;
      }
      .bar:nth-child(1) { height: 40%; }
      .bar:nth-child(2) { height: 65%; }
      .bar:nth-child(3) { height: 50%; }
      .bar:nth-child(4) { height: 85%; background: #f43f5e; }
      .bar:nth-child(5) { height: 60%; }
      .bar:nth-child(6) { height: 95%; }
      .feed {
        grid-area: feed;
        padding: 10px;
        background: #1e1b4b;
        border-radius: 10px;
      }
      .row {
        height: 8px;
        margin-bottom: 9px;
        background: #4338ca;
        border-radius: 4px;
      }
      .row:nth-child(2) { width: 70%; }
      .row:nth-child(3) { width: 85%; }
      .row:nth-child(4) { width: 50%; }
    `,
    hints: [
      'Use display:grid on .dash with columns 56px 1fr 1fr 1fr and rows 36px 70px 1fr, plus 12px padding and an 8px gap. The sidebar spans every row.',
      'grid-template-areas lets you place things by name: "side top top top" / "side s1 s2 s3" / "side chart chart feed". Give each child a matching grid-area.',
      'Chart bars are flex children (flex:1) aligned to the bottom with align-items:flex-end; each bar\'s height is a percentage set with :nth-child. The 4th bar is red-pink. Stat tiles are solid colours with a darker 4px top border. Feed rows are 8px bars with shrinking widths on rows 2–4.',
    ],
  },
  {
    id: 46,
    isNew: true,
    title: 'Analog Clock',
    difficulty: 'expert',
    description: 'A clock face reading 10:10:30 — ticks, three hands rotated from their base, and a center cap.',
    timeLimit: 540,
    pointsToWin: 94,
    html: `<div class="container"><div class="clock"><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="hand hour"></div><div class="hand minute"></div><div class="hand second"></div><div class="dot"></div></div></div>`,
    targetCSS: `
      .container {
        width: 400px;
        height: 300px;
        background: #fde68a;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .clock {
        position: relative;
        width: 240px;
        height: 240px;
        border: 8px solid #1e1b4b;
        border-radius: 50%;
        background: radial-gradient(circle, #4338ca, #1e1b4b);
        box-shadow: 0 0 0 4px #f97316;
      }
      .tick {
        position: absolute;
        top: 8px;
        left: 50%;
        margin-left: -2px;
        width: 4px;
        height: 14px;
        background: #f0f0f8;
        border-radius: 2px;
        transform-origin: 50% 104px;
      }
      .tick:nth-child(2) { transform: rotate(90deg); }
      .tick:nth-child(3) { transform: rotate(180deg); }
      .tick:nth-child(4) { transform: rotate(270deg); }
      .hand {
        position: absolute;
        bottom: 50%;
        left: 50%;
        transform-origin: 50% 100%;
      }
      .hour {
        width: 6px;
        height: 58px;
        margin-left: -3px;
        background: #ffffff;
        border-radius: 3px;
        transform: rotate(305deg);
      }
      .minute {
        width: 4px;
        height: 84px;
        margin-left: -2px;
        background: #fbbf24;
        border-radius: 2px;
        transform: rotate(60deg);
      }
      .second {
        width: 2px;
        height: 100px;
        margin-left: -1px;
        background: #f43f5e;
        transform: rotate(180deg);
      }
      .dot {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -9px 0 0 -9px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #f43f5e;
        border: 3px solid #ffffff;
      }
    `,
    hints: [
      'The clock is a 240px circle (border-radius:50%) with an 8px border, a radial-gradient background and an orange ring made with box-shadow: 0 0 0 4px. Position it relative so everything inside can be absolute.',
      'Every hand starts pointing straight up from the centre: bottom:50%, left:50%, and transform-origin:50% 100% (the bottom of the hand) so rotate() pivots around the middle. Hour = 305deg, minute = 60deg, second = 180deg.',
      'Ticks are placed at the top and rotated around the clock\'s CENTER using transform-origin: 50% <half the clock\'s inner height minus top>px (here 104px) — the 4 ticks differ only by rotate(0/90/180/270deg).',
    ],
  },
]
