
//all the maps are stored here
var map_test;
var map_test2;



var dance_test = {
	audio: new Audio('audio/notZun.mp3'),
	obstacles: []
};

function loadMaps() {
	// map_test = importMap(`id~undefined|x~-76|y~-3|dims~264~164|tiles~001*E0*E1*M0*y1*=1*j01*=1*h0*51*=1*d0*=0*d1*50*=0*e1*50*=0*f1*50*=0*h1*40*=0*i1*40*=0*j1*40*=0*k1*40*=0*l1*40*=0*m1*40*=0*n1*40*=0*o1*40*=0*q1110*=0*r1110*=0*s1110*=0*t1110*=0*u110*=0*v110*=0*w110*=0*x110*=0*y110*=0*z110*=0*A110*=0*B110*=0*D110*=0*E110*=0*F110*=0*G110*=0*H110*=0*I1110*=0*K110*=0*L1110*=0*N110*=0*O1110*=0*Q110*=0*R1110*=0*T1110*=0*V110*=0*W1110*=0*Y1110*=0*+1110*=0*=010*=0*=001*60*=0*=0*71*50*=0*=0*b1*80*=0*=0*i1*50*=0*=0*m1*90*=0*=0*u1*70*=0*=0*A1*40*=0*=0*D1110*=0*=0*G1110*=0*=0*I110*=0*=0*J110*=0*=0*K110*=0*=0*L110*=0*=0*M110*=0*=0*N110*=0*=0*O10*=0*=0*O110*=0*=0*P110*=0*=0*Q10*=0*=0*k1*60*q10*=0*=0*h1*40*4110*p10*=0*=0*h10*4100110*p10*=0*=0*h1*90*q10*=0*=0*Q10*=0*=0*Q10*=0*=0*Q10*=0*=0*P110*=0*=0*O110*=0*=0*O110*=0*=0*O110*=0*=0*O110*=0*=0*l1*b0*h1110*=0*=0*l110*91*40*d110*=0*=0*n10*d1110*91110*=0*=0*n110*f1*b0*=0*=0*p10*=0*=0*Q10*=0*=0*Q110*=0*=0*Q110*=0*=0*Q110*=0*=0*Q110*=0*=0*Q110*=0*=0*Q1110*=0*=0*Q1110*=0*=0*Q1*40*=0*=0*Q1*60*=0*=0*Q1*60*=0*=0*Q1*h0*=0*=0*P1*40*=0*=0*S110*=0*=0*T1110*=0*=0*V110*=0*=0*W1110*=0*=0*Y1110*=0*=0*+1110*=0*=0*=01110*=0*=0*=000110*=0*=0*=0*41110*=0*=0*=0*6110*=0*=0*=0*71110*=0*=0*=0*9110*=0*=0*=0*a1110*=0*=0*=0*c110*=0*=0*=0*d1110*=0*=0*=0*f1*50*=0*=0*=0*j1*40*=0*=0*=0*m1*60*=0*=0*=0*r110*=0*=0*=0*s10*=0*=0*=0*s110*=0*=0*=0*t10*=0*=0*=0*t10*=0*=0*=0*t110*=0*=0*=0*u110*=0*=0*=0*v10*=0*=0*=0*v10*=0*=0*=0*v110*=0*=0*=0*w10*=0*=0*=0*u1110*=0*=0*=0*t110*=0*=0*=0*v10*=0*=0*=0*w1110*=0*=0*=0*w10*=0*=0*=0*u1110*=0*=0*=0*s1110*=0*=0*=0*u10*=0*=0*=0*w10*=0*=0*=0*v110*=0*=0*=0*v10*=0*=0*=0*w10*=0*=0*=0*w110*=0*=0*=0*w10*=0*=0*=0*w10*=0*=0*=0*w10*=0*=0*=0*e1*50*d10*=0*=0*=0*b1*90*b110*=0*=0*=0*91*b0*b10*=0*=0*=0*91*b0*b110*=0*=0*=0*91*b0*b10*=0*=0*=0*b1*90*c10*=0*=0*=0*e1*40*e10*=0*=0*=0*v110*=0*=0*=0*v10*=0*=0*=0*w110*=0*=0*=0*w1110*=0*=0*=0*w10*=0*=0*=0*v110*=0*=0*=0*u110*=0*=0*=0*s1*40*=0*=0*=0*r1110*=0*=0*=0*s1110*=0*=0*=0*t110*=0*=0*=0*u110*=0*=0*=0*v1*60*i1*h0*=0*=0*=0*l1*70*41*90*f1*70*=0*=0*=0*r1*60*t1*70*=0*=0*=0*=0*51*50*=0*=0*=0*=0*9111`);
	map_test = importMap(`id~undefined|type~climb|x~-76|y~-3|dims~14~12|tiles~101110*9101110*9101110*9101*60*d110*d110*d110*d10*d110*d110*d110*d1`);
	map_test2Easy = importMap(`id~startEasy|type~climb|x~-137|y~-5|dims~178~160|tiles~0*l1*y0*=0*=0*d1*60*w1*40*=0*=0*61*50*E1*a0*=0*V1*a0*F1101*60*=0*K1*p0*A10111001110*=0*=0*51*50*m1*i0110*=0*=0*81*o0*g1*40*=0*=0*O110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P110*=0*=0*P1110001*50*=0*=0*H1*5000110*=0*=0*H1110*510*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*O1110*=0*=0*O110*=0*=0*O1110*=0*=0*O1110*=0*=0*P1110*=0*=0*Q110*=0*=0*P1110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*p1*60*k10*=0*=0*p1*60*k10*=0*=0*q1*40*l10*=0*=0*61*b0*y10*=0*=0*51*d0*x10*=0*=0*51*d0*w110*=0*=0*61*a0*y10*=0*=0*r1*50*i110*=0*=0*q110001110*f110*=0*=0*r10*61110*b1110*=0*=0*r110*8110*9110*=0*=0*t10*a1*b0*=0*=0*u10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P1*40*=0*=0*P1*40*=0*=0*P1*70*=0*=0*P1*60*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*Q10*=0*=0*P10*=0*=0*P110*=0*=0*u1*a0*b10*=0*=0*u1*c0*910*=0*=0*u1*c0*910*=0*=0*u1*d0*8110*=0*=0*u1*b0*9110*=0*=0*v1*90*a110*=0*=0*O110*=0*=0*M1*40*=0*=0*M1*40*=0*=0*M1110*=0*=0*N1110*=0*=0*N110*=0*=0*O110*=0*=0*O1110*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*h1*70*i1*40*510*=0*=0*e1*a0*e1*90*410*=0*=0*d1*d0*b1*a0*410*=0*=0*d1*b0*d1*80*610*=0*=0*c1*a0*t10*=0*=0*c1*80*v10*=0*=0*d1*40*x110*=0*=0*O10*=0*=0*O110*=0*=0*O10*=0*=0*O10*=0*=0*t1*b0*b10*=0*=0*q1*f0*9110*=0*=0*q1*g0*810*=0*=0*s1*f0*810*=0*=0*t1*d0*8110*=0*=0*v1*90*a10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*l1*50*p110*=0*=0*h1*90*p10*=0*=0*h1*90*p10*=0*=0*h1*80*q10*=0*=0*h1*60*r110*=0*=0*w1*90*910*=0*=0*u1*e0*51110*=0*=0*u1*f0*410*=0*=0*x1*e0*410*=0*=0*y1*d0*410*=0*=0*A1*70*81110*=0*=0*P1*40*=0*=0*P1110*=0*=0*P1110*=0*=0*P1*50*=0*=0*P1*50*=0*=0*P1*60*=0*=0*P1*m0*=0*=0*P1*8`);
	map_test2 = importMap(`id~start|type~climb|x~-137|y~-5|dims~178~160|tiles~0*l1*y0*=0*=0*d1*60*w1*40*=0*=0*61*50*E1*a0*=0*V1*a0*F1101*60*=0*K1*p0*A10111001110*=0*=0*51*50*m1*i0110*=0*=0*81*o0*g1*40*=0*=0*O110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P110*=0*=0*P1110001*50*=0*=0*H1*5000110*=0*=0*H1110*510*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*O1110*=0*=0*O110*=0*=0*O1110*=0*=0*O1110*=0*=0*P1110*=0*=0*Q110*=0*=0*P1110*=0*=0*P1110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*p1*60*k10*=0*=0*p1*60*k10*=0*=0*p1*60*k10*=0*=0*P10*=0*=0*P10*=0*=0*O110*=0*=0*O10*=0*=0*r1*50*i110*=0*=0*q110001110*f110*=0*=0*r10*61110*b1110*=0*=0*r110*8110*9110*=0*=0*t10*a1*b0*=0*=0*u10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P1110*=0*=0*P1*40*=0*=0*P1*40*=0*=0*P1*70*=0*=0*P1*60*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*Q10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*O110*=0*=0*O110*=0*=0*O10*=0*=0*O110*=0*=0*N110*=0*=0*N110*=0*=0*O10*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*O110*=0*=0*O10*=0*=0*O110*=0*=0*O10*=0*=0*O10*=0*=0*P10*=0*=0*O110*=0*=0*O10*=0*=0*P10*=0*=0*O110*=0*=0*O10*=0*=0*P10*=0*=0*P10*=0*=0*P110*=0*=0*P10*=0*=0*P110*=0*=0*P110*=0*=0*P10*=0*=0*P10*=0*=0*P10*=0*=0*O110*=0*=0*O10*=0*=0*N1110*=0*=0*N10*=0*=0*P10*=0*=0*P10*=0*=0*P1110*=0*=0*P1*40*=0*=0*P1110*=0*=0*P1110*=0*=0*P1*50*=0*=0*P1*50*=0*=0*P1*60*=0*=0*P1*m0*=0*=0*P1*8`);
	map_hostile = importMap(`id~undefined|type~climb|x~-133|y~-59|dims~189~134|tiles~0*d1110*=0*+10*L10*e1*60*=0*V110*I1*40*j1*50*=0*b10*F110*H10010*n1*40*n1*k0*r110*G110*p10*f110010*q110*=0*5110*I110*o10*f100010*=0*w110*K110*m110*e1100010*=0*w10*M10*m10*e110*410*F110*P110*N10*l10*e10*510*H110*M110*O110*j110*d110*5110*H1110*J110*81*k0*o110*i10*m10*J1110*h1*e0*c10*S10*i10*m10*L1110*E10*T110*h10*m10*e1*50*j110*9110*C110*U110*f110*m110*a1*40*n10*N110*W10*f10*o10*81110*f1*70*410*N10*X110*e10*o10*51*40*b1*70*9110*=0*L110*d10*o10*4110*b1*40*f10*=0*N110*B110*z10*=0*=0*q10*z10*=0*=0*Z110*=0*=0*Z10*=0*=0*+10*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*a110*=0*=0*X1110*=0*=0*X1*40*=0*=0*X1*40*=0*=0*W1*40*=0*=0*W1*50*=0*=0*U1*70*=0*=0*T1*70*=0*=0*T1*80*=0*=0*S1*80*f110*=0*=0*B1*90*g1110*=0*=0*y1*90*i1*40*=0*=0*v1*a0*k1*70*=0*=0*p1*a0*n1*e0*=0*=0*f1*b0*p1*d0*=0*=0*f1*90*r1*c0*=0*=0*h1*70*t1*a0*=0*=0*j1*50*v1*80*=0*=0*k1110*y1*60*=0*=0*X1*40*=0*=0*E10*k110*=0*=0*E10*=0*=0*Z110*=0*=0*Z110*=0*=0*Z110*=0*=0*Y1110*=0*=0*Y1110*=0*=0*Y1110*810*=0*=0*O1*40*81110*=0*=0*M1*40*91110*=0*=0*K1*50*91*50*=0*=0*I1*50*=0*=0*W1*50*=0*=0*V1*70*=0*=0*=0*=0*=0*=0*=0*=0*K10*=0*=0*+10*=0*=0*Z110*=0*=0*Y1110*=0*=0*X1*40*=0*511100010*=0*L1*40*=0*51*70*=0*K1*50*=0*51*60*=0*K1*60*=0*51*60*=0*K1*60*=0*41*50*=0*L1*70*=0*41*40*=0*L1*80*h1110*L1110*=0*L1*80*j1*40*J110*=0*M1*80*k1*50*G110*=0*M1*90*m1*40*E110*=0*N1*80*o1*50*=0*=0*s1*60*q1*50*=0*=0*s1*40*r1*50*=0*=0*t110*s1*60*=0*=0*X1*60*=0*=0*W1*80*=0*=0*U1*80*=0*=0*V1*80*=0*=0*U1*90*=0*=0*T1*a0*=0*=0*T1*90*=0*=0*T1*80*=0*=0*V1*60*=0*=0*X1*50*=0*=0*X1*40*=0*=0*Z110*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*q10*=0*=0*+10*H1*60*=0*=0*d110*z1*b0*=0*=0*e1110*t1*e0*=0*=0*h1110*o1*h0*=0*=0*j1*40*j1*i0*=0*=0*l1*50*g1*h0*=0*=0*p1*50*g1*c0*=0*=0*u1*50*g1*a0*=0*=0*w1*50*g1*70*=0*=0*z1*50*h1110*=0*=0*B1*60*=0*=0*W1*60*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*=0*C10*=0*=0*+110*=0*=0*+1110*=0*=0*Y1*40*=0*=0*Y1*40*=0*=0*X1*50*=0*=0*X1*50*=0*=0*W1*70*=0*=0*U1*80*=0*=0*U1*80*=0*=0*T1*80*=0*=0*U1*60*=0*=0*V1*40*=0*=0*Y110*=0*k`);
}