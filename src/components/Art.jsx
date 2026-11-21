import { useId } from 'react';
import { useMotion } from '../MotionContext';

export function BridgeArt() {
  const { motion } = useMotion();
  const glow = useId();
  return <figure className="bridge-figure">
    <svg viewBox="0 0 540 420" role="img" aria-label="An illustrated suspension bridge connecting Parent and Child over gently rippling water">
      <defs>
        <radialGradient id={glow} cx="50%" cy="42%" r="62%"><stop stopColor="#FFFFFF" stopOpacity=".26" /><stop offset="1" stopColor="#243B3B" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="540" height="420" fill={'url(#' + glow + ')'} />
      <g className="bridge-illustration">
        <g fill="none" stroke="#FFFFFF" opacity=".22">
          <circle cx="270" cy="187" r="123" /><circle cx="270" cy="187" r="145" strokeDasharray="2 6" /><circle cx="270" cy="187" r="164" />
          <path d="M270 22v337M102 187h336" strokeDasharray="2 9" />
        </g>
        <circle cx="270" cy="178" r="86" fill="#A4C0C3" opacity=".36" />
        <circle cx="270" cy="178" r="72" fill="#FFFFFF" opacity=".12" />
        <path d="M0 270q59-44 111-16t78 16v82H0zm540-4q-63-44-109-17t-81 19v84h190z" fill="#243B3B" opacity=".44" />
        <path d="M0 293q52-36 111-16t76 14v47H0zm540-6q-54-37-106-16t-82 17v50h188z" fill="#243B3B" opacity=".52" />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M65 246c113 0 116-115 205-115s92 115 205 115" stroke="#A4C0C3" strokeWidth="1.25" opacity=".48" transform="translate(0 -8)" />
          <path className="connecting-arch" d="M65 246c113 0 116-115 205-115s92 115 205 115" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M61 248h418m-397 7h376m-352 1v38m328-38v38M158 214v76m224-76v76M186 184v64m168-64v64M214 154v94m112-94v94M242 137v111m56-111v111M270 131v117" stroke="#FFFFFF" opacity=".6" strokeWidth="1.4" />
          <path d="M97 294h18m34-5h18m206 0h18m34 5h18" stroke="#A4C0C3" opacity=".65" />
          <g stroke="#FFFFFF" opacity=".38" className="art-water">
            <path d="M15 315q35-8 73 0t77 0t88 0t88 0t87 0t98 0M-40 329q40-8 79 0t80 0t83 0t86 0t84 0t87 0t98 0M4 344q38-7 77 0t84 0t87 0t86 0t83 0t97 0M36 359q36-6 74 0t77 0t86 0t87 0t84 0t64 0" />
          </g>
          <path className="art-bird drift-1" d="M116 129q9-6 17 5 7-10 16-7" stroke="#FFFFFF" strokeWidth="1.7" />
          <path className="art-bird drift-2" d="M370 104q6-5 12 2 4-7 12-6" stroke="#FFFFFF" strokeWidth="1.5" />
          <path className="art-bird drift-3" d="M406 140q6-3 11 3 4-6 10-4" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M171 99v14m-7-7h14m176 47v15m-7-7h14m-61-96v10m-5-5h10m-117 99v9m-5-5h10" stroke="#FFFFFF" opacity=".56" />
        </g>
        <g fill="#FFFFFF"><circle className="speck" cx="93" cy="174" r="2" /><circle className="speck" cx="228" cy="92" r="2" /><circle className="speck" cx="322" cy="96" r="1.5" /><circle className="speck" cx="443" cy="183" r="2" /><circle cx="65" cy="246" r="5" /><circle cx="475" cy="246" r="5" /></g>
        {motion && <>
          <circle r="4.6" fill="#FFFFFF"><animateMotion dur="12s" repeatCount="indefinite" path="M65 246c113 0 116-115 205-115s92 115 205 115" /></circle>
          <circle r="4.6" fill="#A4C0C3"><animateMotion dur="14s" repeatCount="indefinite" path="M475 246c-113 0-116-115-205-115s-92 115-205 115" /></circle>
        </>}
        <g fill="#FFFFFF" textAnchor="middle" fontSize="16" fontWeight="500"><text x="65" y="390">Parent</text><text x="475" y="390">Child</text></g>
      </g>
    </svg>
  </figure>;
}

export function Water() {
  return <svg className="wave-divider" viewBox="0 0 1150 38" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none"><path d="M-90 19q145-15 290 0t290 0t290 0t290 0t290 0" stroke="var(--ocean)" /><path d="M-90 26q145-15 290 0t290 0t290 0t290 0t290 0" stroke="var(--sand)" /></g>
  </svg>;
}
