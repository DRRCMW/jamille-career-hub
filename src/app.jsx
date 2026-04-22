import { useState, useEffect, useCallback, useMemo } from "react";

/* ─── FONTS ─── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
    @keyframes fadeUp   {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn  {from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes overlayIn{from{opacity:0}to{opacity:1}}
    @keyframes spin     {from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse    {0%,100%{opacity:.5}50%{opacity:1}}
    .fade-up {animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) both}
    .slide-in{animation:slideIn .35s cubic-bezier(.22,.68,0,1.1) both}
  `}</style>
);

/* ─── THEME ─── */
const C = {
  bg:"#070E17", surface:"#0C1624", card:"#0F1D2E", cardHi:"#142335",
  border:"rgba(190,155,60,0.13)", borderHi:"rgba(190,155,60,0.32)",
  gold:"#C9A84C", goldBright:"#E2C36A", goldDim:"rgba(201,168,76,0.08)",
  white:"#F5F0E8", offwhite:"#D6CCBB", muted:"#556678", mutedMid:"#7A8FA6",
  blue:"#2680D4", green:"#28A068", red:"#B83232", amber:"#C87830", teal:"#1E8F8F",
};

/* ─── SEEDED SHUFFLE (deterministic by week) ─── */
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = ((s * 1664525) + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── JOB POOL: 30 SF JOBS ─── */
const SF_POOL = [
  { id:"sf01", company:"Veeva Systems",          logo:"V", title:"Part-Time Salesforce Administrator",       location:"Remote",                   salary:"$45–60/hr",  type:"Part-Time", tag:"salesforce", match:97, about:"Veeva Systems is the leading cloud-software provider for global life sciences. Their Commercial Cloud leverages Salesforce as the backbone of pharma & biotech CRM operations.", description:"Support Veeva's RevOps team on a part-time basis — user management, flow maintenance, and dashboard builds for their Commercial Cloud platform.", requirements:["ADM-201 Certified","Flow Builder proficiency","Excellent stakeholder communication"], niceToHave:["Health/Life Sciences experience","Veeva Vault or CRM familiarity"], applyUrl:"https://careers.veeva.com/", websiteUrl:"https://www.veeva.com" },
  { id:"sf02", company:"Relay Payments",          logo:"R", title:"Salesforce Admin – Contract (20 hrs/wk)", location:"Remote",                   salary:"$50–70/hr",  type:"Contract",  tag:"salesforce", match:94, about:"Relay Payments is a high-growth fintech modernizing payments for the trucking industry. Their team of 300+ relies on Salesforce as the central revenue platform.", description:"Own Salesforce configuration, user management, and reporting for Relay's growing sales and ops teams. 6-month contract with strong renewal.", requirements:["4+ yrs Salesforce Admin","Sales Cloud & Flow","API integration experience"], niceToHave:["Zuora experience","Agile/Scrum background"], applyUrl:"https://relaypayments.com/careers", websiteUrl:"https://www.relaypayments.com" },
  { id:"sf03", company:"Patients & Purpose",      logo:"P", title:"Salesforce Support Admin (Part-Time)",    location:"Hybrid – Philadelphia, PA", salary:"$38–50/hr",  type:"Part-Time", tag:"salesforce", match:91, about:"Patients & Purpose is a healthcare marketing agency. Their Philadelphia office uses Salesforce to manage client relationships and campaign pipelines.", description:"Support the SF org for a 150-person healthcare marketing agency — user management, Service Cloud cases, reports and dashboards.", requirements:["SF Admin Certified","Service Cloud experience","Strong Excel & data skills"], niceToHave:["Healthcare background","Pardot experience"], applyUrl:"https://www.patientsandpurpose.com/careers", websiteUrl:"https://www.patientsandpurpose.com" },
  { id:"sf04", company:"Lev (Concentrix)",        logo:"L", title:"Freelance SF Admin – Client Projects",    location:"Remote",                   salary:"$60–80/hr",  type:"Freelance", tag:"salesforce", match:89, about:"Lev is one of the largest dedicated Salesforce consulting partners in the US, delivering transformation projects for enterprise clients.", description:"Project-based engagements for enterprise clients. Strong org-build and migration experience prioritized.", requirements:["ADM-201 Certified","Data migration experience","Client-facing consulting skills"], niceToHave:["Einstein Analytics","Pardot / Marketing Cloud"], applyUrl:"https://lev.com/careers", websiteUrl:"https://www.lev.com" },
  { id:"sf05", company:"The Salvation Army ARC",  logo:"S", title:"Salesforce Nonprofit Admin (PT)",        location:"Hybrid – Philadelphia, PA", salary:"$35–48/hr",  type:"Part-Time", tag:"salesforce", match:86, about:"The Salvation Army ARC in greater Philadelphia uses Salesforce NPSP to manage donor relationships and program outcomes.", description:"15–20 hrs/week managing a Salesforce NPSP org for a mission-driven organization.", requirements:["SF Admin experience","Nonprofit/NPSP familiarity","Strong reporting skills"], niceToHave:["Volunteer Management module","Donor management experience"], applyUrl:"https://www.salvationarmyusa.org/usn/about/employment/", websiteUrl:"https://www.salvationarmyusa.org" },
  { id:"sf06", company:"Comcast NBCUniversal",    logo:"C", title:"Salesforce Admin – Part-Time Flex",       location:"Philadelphia, PA (Hybrid)", salary:"$55–75/hr",  type:"Part-Time", tag:"salesforce", match:88, about:"Comcast's enterprise tech division operates one of the largest Salesforce deployments on the East Coast, supporting B2B technology products.", description:"Support ongoing Salesforce org initiatives within Comcast's B2B tech division — 15–25 hours per week across sprint-based feature work.", requirements:["5+ yrs Salesforce Admin","Enterprise org experience (200+ users)","Agile/Scrum"], niceToHave:["Einstein AI tools","Pardot","API/integration background"], applyUrl:"https://jobs.comcast.com", websiteUrl:"https://corporate.comcast.com" },
  { id:"sf07", company:"Jefferson Health",        logo:"J", title:"Salesforce CRM Admin (Part-Time)",        location:"Philadelphia, PA",          salary:"$42–55/hr",  type:"Part-Time", tag:"salesforce", match:87, about:"Jefferson Health is a major academic medical center network in Philadelphia, using Salesforce Health Cloud to manage patient engagement and outreach.", description:"Administer the Salesforce Health Cloud org for Jefferson's patient engagement team. 20 hrs/week with flexible scheduling.", requirements:["SF Admin Certified","Health Cloud or Service Cloud experience","HIPAA awareness"], niceToHave:["Patient engagement experience","Pardot"], applyUrl:"https://careers.jefferson.edu", websiteUrl:"https://www.jefferson.edu" },
  { id:"sf08", company:"Curative (Healthcare)",   logo:"Cu", title:"Salesforce Operations Admin",            location:"Remote",                   salary:"$48–65/hr",  type:"Contract",  tag:"salesforce", match:85, about:"Curative is a healthcare technology company focused on simplifying access to care. Their ops team relies on Salesforce to manage partner relationships and workflows.", description:"Support Salesforce configuration and operations for a fast-moving healthcare tech company. Contract role with full-time conversion potential.", requirements:["SF Admin Certified","Process automation (Flows)","Strong documentation skills"], niceToHave:["Healthcare tech exposure","Conga or DocuSign integration"], applyUrl:"https://curative.com/careers", websiteUrl:"https://curative.com" },
  { id:"sf09", company:"Aramark",                 logo:"A", title:"Part-Time Salesforce Admin",              location:"Philadelphia, PA",          salary:"$40–52/hr",  type:"Part-Time", tag:"salesforce", match:83, about:"Aramark is a global food, facilities, and uniform services company headquartered in Philadelphia. Their enterprise Salesforce org supports a global sales operation.", description:"Support Aramark's enterprise SF org with user management, automation, and data quality tasks on a part-time basis.", requirements:["3+ yrs SF Admin","Data migration & governance","Strong stakeholder management"], niceToHave:["CPQ experience","Einstein reporting"], applyUrl:"https://www.aramark.com/careers", websiteUrl:"https://www.aramark.com" },
  { id:"sf10", company:"Axonify",                 logo:"Ax", title:"Salesforce Admin – RevOps (PT)",         location:"Remote",                   salary:"$52–68/hr",  type:"Part-Time", tag:"salesforce", match:90, about:"Axonify is an employee enablement platform used by Fortune 500 companies. Their RevOps team runs a sophisticated Salesforce org to power sales, marketing, and CS.", description:"Join Axonify's RevOps team as a part-time SF admin — own automations, integrations, and executive reporting.", requirements:["ADM-201","Flow Builder","Salesforce Reports & Dashboards"], niceToHave:["Pardot or HubSpot integration","CPQ knowledge"], applyUrl:"https://axonify.com/careers", websiteUrl:"https://axonify.com" },
  { id:"sf11", company:"Gopuff",                  logo:"G", title:"Salesforce Contractor – Sales Ops",       location:"Philadelphia, PA (Hybrid)", salary:"$55–72/hr",  type:"Contract",  tag:"salesforce", match:86, about:"Gopuff is an instant delivery platform headquartered in Philadelphia. Their Sales Ops team manages enterprise partner relationships in Salesforce.", description:"Short-term contract supporting Gopuff's enterprise sales org — new object builds, automation, and dashboard work.", requirements:["Salesforce Admin Certified","Sales Cloud expertise","Data integrity management"], niceToHave:["Integration with Slack or Tableau","Enterprise org experience"], applyUrl:"https://www.gopuff.com/go/careers", websiteUrl:"https://www.gopuff.com" },
  { id:"sf12", company:"WSFS Bank",               logo:"W", title:"Salesforce Admin – Financial Services",   location:"Wilmington, DE (Hybrid)",   salary:"$45–58/hr",  type:"Part-Time", tag:"salesforce", match:82, about:"WSFS Bank is a leading regional bank in the Delaware Valley. Their retail and commercial banking teams use Salesforce Financial Services Cloud.", description:"Support Salesforce FSC administration for WSFS's relationship banking team. Part-time hybrid role.", requirements:["SF Admin experience","Financial Services Cloud a plus","Compliance mindset"], niceToHave:["Veeva or FSC certification","Banking industry background"], applyUrl:"https://www.wsfsbank.com/about/careers", websiteUrl:"https://www.wsfsbank.com" },
  { id:"sf13", company:"Penn Medicine",           logo:"PM", title:"Salesforce CRM Support Admin",           location:"Philadelphia, PA",          salary:"$40–54/hr",  type:"Part-Time", tag:"salesforce", match:84, about:"Penn Medicine is one of the world's leading academic medical centers. Their CRM team uses Salesforce to manage physician outreach and referring provider relationships.", description:"Support Penn Medicine's Salesforce org with configuration, training, and reporting. Flexible 15–20 hrs/week schedule.", requirements:["SF Admin Certified","Service or Health Cloud","End-user training skills"], niceToHave:["Healthcare CRM experience","Strong Excel skills"], applyUrl:"https://www.pennmedicine.org/careers", websiteUrl:"https://www.pennmedicine.org" },
  { id:"sf14", company:"Cloudingo / Validity",    logo:"Cl", title:"Implementation Consultant (PT)",         location:"Remote",                   salary:"$58–75/hr",  type:"Freelance", tag:"salesforce", match:87, about:"Validity helps Salesforce customers improve data quality with tools like Cloudingo and DemandTools. Their partner network supports data governance engagements.", description:"Help Validity's clients implement data quality tools in their Salesforce orgs. Flexible freelance engagement, 10–20 hrs/week.", requirements:["Salesforce Admin Certified","Data migration & deduplication expertise","Client communication skills"], niceToHave:["Cloudingo or DemandTools experience","Mass update experience"], applyUrl:"https://www.validity.com/company/careers/", websiteUrl:"https://www.validity.com" },
  { id:"sf15", company:"FS Investments",          logo:"FS", title:"Salesforce Admin – Wealth Management",   location:"Philadelphia, PA",          salary:"$50–65/hr",  type:"Part-Time", tag:"salesforce", match:83, about:"FS Investments is an alternative investment manager headquartered in Philadelphia, using Salesforce to manage advisor and investor relationships.", description:"Support the Salesforce FSC org for a leading alternative investment firm. 15–20 hrs/week, collaborative team environment.", requirements:["SF Admin experience","Financial Services Cloud or Wealth Management","Strong reporting skills"], niceToHave:["Compliance/regulatory awareness","DocuSign integration"], applyUrl:"https://fsinvestments.com/fs-investments/our-firm/careers/", websiteUrl:"https://fsinvestments.com" },
  { id:"sf16", company:"Publicis Health",         logo:"Ph", title:"Salesforce Admin (Part-Time Contract)",  location:"Remote",                   salary:"$48–62/hr",  type:"Contract",  tag:"salesforce", match:88, about:"Publicis Health is a global health marketing network. Their operations team manages Salesforce for CRM, project tracking, and partner reporting across agencies.", description:"Support Salesforce operations for a global health marketing group — automation, user management, and cross-team reporting.", requirements:["SF Admin Certified","Pardot or Marketing Cloud experience","Agency or media industry background a plus"], niceToHave:["Einstein Analytics","Multi-org experience"], applyUrl:"https://www.publicishealth.com/careers", websiteUrl:"https://www.publicishealth.com" },
  { id:"sf17", company:"Azenta Life Sciences",    logo:"Az", title:"Salesforce CRM Admin (Flex PT)",         location:"Remote",                   salary:"$45–60/hr",  type:"Part-Time", tag:"salesforce", match:85, about:"Azenta Life Sciences provides genomics and sample management solutions globally. Their Salesforce org supports a worldwide sales and service operation.", description:"Flexible part-time admin role supporting Azenta's global Salesforce org — configuration, integrations, and analytics.", requirements:["ADM-201","Flow Builder","Cross-functional stakeholder management"], niceToHave:["Life sciences industry background","Five9 or telephony integration"], applyUrl:"https://www.azenta.com/careers", websiteUrl:"https://www.azenta.com" },
  { id:"sf18", company:"Independence Blue Cross", logo:"IB", title:"Salesforce Admin – Member Services PT",  location:"Philadelphia, PA (Hybrid)", salary:"$50–65/hr",  type:"Part-Time", tag:"salesforce", match:86, about:"Independence Blue Cross is the Philadelphia area's leading health insurer. Their member services team uses Salesforce Service Cloud to manage member interactions at scale.", description:"Part-time Salesforce admin role supporting IBC's Service Cloud org — case management, automation, and workforce tools.", requirements:["SF Admin Certified","Service Cloud experience","Strong documentation habits"], niceToHave:["Health insurance or regulated industry experience","HIPAA compliance awareness"], applyUrl:"https://careers.ibx.com", websiteUrl:"https://www.ibx.com" },
  { id:"sf19", company:"Firstup (SocialChorus)",  logo:"Fu", title:"Salesforce Admin – Growth Tech",         location:"Remote",                   salary:"$52–68/hr",  type:"Contract",  tag:"salesforce", match:89, about:"Firstup is an employee communications platform used by Fortune 500 companies. Their growing RevOps team manages a complex Salesforce environment.", description:"Contract Salesforce admin role for a SaaS company in hypergrowth mode — process automation, clean data architecture, and exec reporting.", requirements:["4+ yrs SF Admin","Flow automation","Data hygiene expertise"], niceToHave:["Salesforce CPQ","HubSpot migration experience"], applyUrl:"https://firstup.io/careers/", websiteUrl:"https://firstup.io" },
  { id:"sf20", company:"Children's Hospital of Philadelphia", logo:"CH", title:"Salesforce Admin (PT Remote)", location:"Remote",               salary:"$42–55/hr",  type:"Part-Time", tag:"salesforce", match:84, about:"CHOP is one of the nation's top pediatric hospitals. Their advancement and outreach teams use Salesforce to manage donor and community relationships.", description:"Support CHOP's Salesforce org for the advancement team — 15–20 hrs/week, fully remote role with a meaningful mission.", requirements:["SF Admin experience","Nonprofit or healthcare Salesforce background","Strong reporting skills"], niceToHave:["NPSP experience","Conga or DocuSign"], applyUrl:"https://jobs.chop.edu", websiteUrl:"https://www.chop.edu" },
  { id:"sf21", company:"Dun & Bradstreet",        logo:"D", title:"Salesforce Operations Admin (PT)",        location:"Remote",                   salary:"$50–65/hr",  type:"Part-Time", tag:"salesforce", match:85, about:"Dun & Bradstreet is a global data and analytics firm. Their sales operations team manages a large, multi-cloud Salesforce environment for enterprise sales workflows.", description:"Part-time ops admin supporting Salesforce configuration and process improvement for D&B's enterprise sales org.", requirements:["ADM-201","Multi-org experience","Sales Cloud proficiency"], niceToHave:["CPQ configuration","Data cloud integration"], applyUrl:"https://www.dnb.com/about-us/company/careers.html", websiteUrl:"https://www.dnb.com" },
  { id:"sf22", company:"Ribbon Health",           logo:"Rh", title:"Salesforce Admin – Health Tech Startup",  location:"Remote",                  salary:"$55–72/hr",  type:"Freelance", tag:"salesforce", match:90, about:"Ribbon Health is a health tech company enabling provider data and network management. Their team needs experienced SF admins to scale their go-to-market infrastructure.", description:"Freelance SF admin supporting a Series B health tech startup — build scalable processes and support a fast-growing revenue team.", requirements:["SF Admin Certified","Startup or high-growth experience","Self-managed, async communication"], niceToHave:["HubSpot to Salesforce migration","Outreach or SalesLoft integration"], applyUrl:"https://ribbonhealth.com/careers/", websiteUrl:"https://ribbonhealth.com" },
  { id:"sf23", company:"AmerisourceBergen (Cencora)", logo:"Am", title:"Salesforce Admin – Pharma PT",        location:"Conshohocken, PA (Hybrid)", salary:"$48–62/hr", type:"Part-Time", tag:"salesforce", match:83, about:"Cencora (formerly AmerisourceBergen) is a global healthcare company headquartered near Philadelphia. Their commercial team uses Salesforce to manage pharmaceutical distribution relationships.", description:"Support Salesforce administration for Cencora's commercial operations team, with a focus on reporting and data governance.", requirements:["SF Admin Certified","Large org experience","Compliance mindset"], niceToHave:["Healthcare or pharma background","Five9 or telephony"], applyUrl:"https://www.amerisourcebergen.com/careers", websiteUrl:"https://www.amerisourcebergen.com" },
  { id:"sf24", company:"Rowan University",        logo:"Ru", title:"Salesforce CRM Admin (Higher Ed PT)",     location:"Glassboro, NJ (Hybrid)",   salary:"$38–48/hr",  type:"Part-Time", tag:"salesforce", match:80, about:"Rowan University uses Salesforce Education Cloud to manage student recruitment, advising, and alumni engagement across its growing campus network.", description:"Part-time Salesforce admin supporting Rowan's student success and advancement teams.", requirements:["SF Admin experience","Education Cloud or NPSP a plus","Strong end-user training skills"], niceToHave:["Higher education background","FormAssembly or similar"], applyUrl:"https://jobs.rowan.edu", websiteUrl:"https://www.rowan.edu" },
  { id:"sf25", company:"Day & Zimmermann",        logo:"DZ", title:"Salesforce Admin – Defense/Gov Contractor", location:"Philadelphia, PA",      salary:"$45–58/hr",  type:"Part-Time", tag:"salesforce", match:81, about:"Day & Zimmermann is a family-owned defense and workforce solutions company headquartered in Philadelphia, using Salesforce to manage government contract relationships.", description:"Administer Salesforce CRM for a Philadelphia-based defense contractor — reporting, user management, and process improvement.", requirements:["SF Admin Certified","Government or enterprise org experience","Reliable and process-oriented"], niceToHave:["DocuSign or contract management integration","Data migration experience"], applyUrl:"https://www.dayzim.com/careers", websiteUrl:"https://www.dayzim.com" },
  { id:"sf26", company:"Bentley Systems",         logo:"Bs", title:"Salesforce Admin – Infrastructure Tech",  location:"Remote / Exton, PA",       salary:"$50–65/hr",  type:"Part-Time", tag:"salesforce", match:85, about:"Bentley Systems is a global infrastructure engineering software company headquartered in Exton, PA. Their CRM team manages global enterprise sales in Salesforce.", description:"Support Bentley's global Salesforce org with configuration, automations, and multi-region reporting on a part-time basis.", requirements:["ADM-201","International org experience","Flow Builder proficiency"], niceToHave:["CPQ or contract management","Multi-language org experience"], applyUrl:"https://www.bentley.com/company/careers/", websiteUrl:"https://www.bentley.com" },
  { id:"sf27", company:"Chariot Solutions",       logo:"Cs", title:"Salesforce Consultant (Flex Contract)",   location:"Horsham, PA",              salary:"$55–70/hr",  type:"Freelance", tag:"salesforce", match:87, about:"Chariot Solutions is a Philadelphia-area technology consulting firm delivering Salesforce and custom software solutions for clients across industries.", description:"Flexible Salesforce consulting engagements with Chariot's growing CRM practice — client work in financial services, healthcare, and nonprofits.", requirements:["3+ yrs SF Admin or Developer","Client-facing skills","Self-starter in a consulting environment"], niceToHave:["Multiple Salesforce certifications","Project management experience"], applyUrl:"https://chariotsolutions.com/careers/", websiteUrl:"https://chariotsolutions.com" },
  { id:"sf28", company:"Radian Group",            logo:"Ra", title:"Salesforce Admin – Mortgage Tech",        location:"Philadelphia, PA (Hybrid)", salary:"$48–60/hr",  type:"Part-Time", tag:"salesforce", match:83, about:"Radian Group is a leading mortgage insurance and real estate services company in Philadelphia. Salesforce supports their B2B lender relationship management.", description:"Part-time SF admin supporting Radian's lender relations team — user management, dashboards, and automation improvements.", requirements:["SF Admin experience","Financial services or mortgage background a plus","Attention to compliance requirements"], niceToHave:["Financial Services Cloud","DocuSign integration"], applyUrl:"https://radian.com/about-radian/careers", websiteUrl:"https://radian.com" },
  { id:"sf29", company:"Catalant Technologies",   logo:"Ca", title:"Salesforce RevOps Admin (PT Remote)",     location:"Remote",                   salary:"$52–68/hr",  type:"Contract",  tag:"salesforce", match:88, about:"Catalant connects companies with business experts for project work. Their RevOps team uses Salesforce to manage enterprise client and expert workflows.", description:"Contract role supporting Catalant's RevOps Salesforce org — automation, data architecture, and executive reporting.", requirements:["ADM-201","Flow Builder & automation","RevOps mindset"], niceToHave:["Outreach or SalesLoft integration","CPQ experience"], applyUrl:"https://catalant.com/careers/", websiteUrl:"https://catalant.com" },
  { id:"sf30", company:"Siemens Healthineers",    logo:"Si", title:"Salesforce Admin – Medical Devices PT",   location:"Malvern, PA (Hybrid)",     salary:"$50–66/hr",  type:"Part-Time", tag:"salesforce", match:84, about:"Siemens Healthineers is a global medical technology company with significant US operations in Malvern, PA. Their commercial team manages service and sales in Salesforce.", description:"Support Salesforce for a medical devices commercial team — field service, case management, and reporting.", requirements:["SF Admin Certified","Service Cloud or Field Service experience","Healthcare/medical device preferred"], niceToHave:["Field Service Lightning","SAP integration awareness"], applyUrl:"https://www.siemens-healthineers.com/en-us/careers", websiteUrl:"https://www.siemens-healthineers.com" },
];

/* ─── JOB POOL: 21 NOTARY JOBS ─── */
const NOTARY_POOL = [
  { id:"n01", company:"Snapdocs",                  logo:"📋", title:"Mobile Notary Signing Agent",          location:"Philadelphia, PA",        salary:"$75–200/signing", type:"Freelance", tag:"notary", match:98, about:"Snapdocs is the mortgage industry's leading digital closing platform, connecting lenders and title companies with professional notary signing agents nationwide.", description:"Join the Snapdocs network to receive real-estate loan signing assignments directly from title companies. Accept only the orders you want.", requirements:["Active PA Notary Commission","NNA Signing Agent Cert preferred","Laser printer","Reliable transportation"], niceToHave:["E&O Insurance ($25k+)","NNA background check on file"], applyUrl:"https://www.snapdocs.com/notaries", websiteUrl:"https://www.snapdocs.com" },
  { id:"n02", company:"Proof (formerly Notarize)", logo:"✍️", title:"Remote Online Notary (RON)",            location:"Remote",                  salary:"$25–50/session",  type:"Part-Time", tag:"notary", match:93, about:"Proof is the leading RON platform for legally binding remote notarizations via secure audio-visual technology across 40+ states.", description:"Perform RON sessions from home using Proof's compliant video platform. Sessions run 10–15 minutes and you set your own availability.", requirements:["PA Notary Commission","PA RON authorization","Webcam & stable internet","Background check"], niceToHave:["Identity verification experience","Multilingual abilities"], applyUrl:"https://www.proof.com/notaries", websiteUrl:"https://www.proof.com" },
  { id:"n03", company:"Signing Services of America", logo:"📝", title:"Loan Signing Agent",                 location:"Philadelphia Metro",       salary:"$100–175/signing",type:"Freelance", tag:"notary", match:95, about:"SSA is one of the nation's leading signing service companies, partnering with title companies, escrow firms, and mortgage lenders across all 50 states.", description:"Accept loan closing assignments throughout greater Philadelphia and South Jersey. SSA coordinates with borrowers — you show up prepared.", requirements:["Active PA Notary Commission","NNA Certified Signing Agent","NNA background check","E&O Insurance"], niceToHave:["Bilingual (Spanish)","Real estate experience"], applyUrl:"https://www.signingservicesofamerica.com/join-our-network", websiteUrl:"https://www.signingservicesofamerica.com" },
  { id:"n04", company:"NotaryGo",                  logo:"🗺️", title:"On-Demand Mobile Notary",              location:"Philadelphia, PA",        salary:"$50–150/visit",   type:"Freelance", tag:"notary", match:88, about:"NotaryGo connects clients in hospitals, care facilities, law offices, and homes with credentialed mobile notaries via an on-demand app.", description:"Accept on-demand requests through the NotaryGo app — hospital bedside visits, estate documents, POA, and general legal paperwork.", requirements:["Active PA Notary Commission","Available evenings/weekends","Reliable transportation","Professional demeanor"], niceToHave:["Medical or legal document experience","Bilingual"], applyUrl:"https://www.notarygo.com/become-a-notary", websiteUrl:"https://www.notarygo.com" },
  { id:"n05", company:"SigningOrder",              logo:"📄", title:"Signing Agent – Title Closings",        location:"South Jersey / Philly",   salary:"$90–150/signing", type:"Freelance", tag:"notary", match:91, about:"SigningOrder matches title companies and attorneys with certified loan signing agents throughout the tri-state area.", description:"Build steady signing income through the SigningOrder network. Title companies post assignments and you can develop ongoing client relationships.", requirements:["NNA Certified Signing Agent","Clean background check","Laser printer","Professional punctuality"], niceToHave:["Title insurance document familiarity","Existing title company relationships"], applyUrl:"https://www.signingorder.com/become-signing-agent", websiteUrl:"https://www.signingorder.com" },
  { id:"n06", company:"National Notary Association", logo:"🏛️", title:"NNA Signing Agent Network – Philadelphia", location:"Philadelphia, PA",  salary:"Varies by engagement", type:"Part-Time", tag:"notary", match:85, about:"The NNA is the nation's largest nonprofit notary membership organization, connecting credentialed notaries with a nationwide referral network.", description:"NNA membership gives you access to assignments from lenders, title companies, and legal professionals seeking vetted notaries in Philadelphia.", requirements:["PA Notary Commission","NNA certification","Background screening","NNA Code of Professional Responsibility"], niceToHave:["Real estate, medical, or estate specialty","Bilingual"], applyUrl:"https://www.nationalnotary.org/notary-signing-agent", websiteUrl:"https://www.nationalnotary.org" },
  { id:"n07", company:"Signature Closers",         logo:"✒️", title:"Notary Signing Agent",                  location:"Philadelphia Metro",       salary:"$85–150/signing", type:"Freelance", tag:"notary", match:90, about:"Signature Closers is a title and settlement services company specializing in flexible remote and mobile closing solutions across the mid-Atlantic region.", description:"Complete residential and refinance loan signings for Signature Closers' title and lender network throughout the Philadelphia metro area.", requirements:["Active PA Notary Commission","Loan signing experience preferred","NNA background check","E&O Insurance"], niceToHave:["Spanish-speaking ability","Knowledge of RON platforms"], applyUrl:"https://www.signatureclosers.com/become-a-notary", websiteUrl:"https://www.signatureclosers.com" },
  { id:"n08", company:"ClosingCorp (ICE Mortgage)", logo:"🏠", title:"Mobile Notary – Mortgage Closings",    location:"Philadelphia, PA",        salary:"$100–160/signing",type:"Freelance", tag:"notary", match:89, about:"ClosingCorp (now part of ICE Mortgage Technology) is a leading provider of closing cost data and settlement solutions for the US mortgage market.", description:"Join ICE's preferred notary network to handle mortgage and refinance closings in the Philadelphia region.", requirements:["PA Notary Commission","NNA Certified Signing Agent","Professional attire","Same-day document return"], niceToHave:["MISMO training","Digital closing platform experience"], applyUrl:"https://www.icemortgagetechnology.com/", websiteUrl:"https://www.icemortgagetechnology.com" },
  { id:"n09", company:"OneNotary",                 logo:"1️⃣", title:"Remote Online Notary",                  location:"Remote",                  salary:"$20–40/session",  type:"Part-Time", tag:"notary", match:87, about:"OneNotary is a secure RON platform providing notarization services to individuals, businesses, and legal professionals across the US.", description:"Join OneNotary as an independent RON to handle legal and personal documents from your home office. Flexible, short sessions.", requirements:["PA Notary License","PA RON Authorization","Video-capable device","Background check"], niceToHave:["Legal document experience","High availability during business hours"], applyUrl:"https://www.onenotary.us/become-a-notary/", websiteUrl:"https://www.onenotary.us" },
  { id:"n10", company:"NotaryCam (WFG)",           logo:"🎥", title:"RON Notary – Estate & Legal Docs",       location:"Remote",                  salary:"$25–45/session",  type:"Part-Time", tag:"notary", match:86, about:"NotaryCam (a WFG National Title company) is a pioneer in remote online notarization, handling real estate, legal, and personal documents for clients nationwide.", description:"Perform remote notarizations via NotaryCam's secure platform. Specialize in estate planning, legal documents, and real estate closings.", requirements:["PA Notary License","RON Certification","Reliable internet & webcam","Customer-first attitude"], niceToHave:["Estate planning document experience","Evening availability"], applyUrl:"https://www.notarycam.com/become-a-notary/", websiteUrl:"https://www.notarycam.com" },
  { id:"n11", company:"Bilingual Notary Network",  logo:"🌍", title:"Bilingual Mobile Notary (EN/ES)",        location:"Philadelphia, PA",        salary:"$60–130/visit",   type:"Freelance", tag:"notary", match:84, about:"Bilingual Notary Network serves diverse communities with bilingual notary signing agents for real estate, immigration, and legal documents.", description:"Provide mobile notary services to Spanish-speaking and diverse Philadelphia communities. A meaningful, impactful role.", requirements:["PA Notary Commission","Bilingual (Spanish preferred)","Mobile transportation","Professional conduct"], niceToHave:["Immigration document experience","Legal or real estate background"], applyUrl:"https://www.bilingualnotarynetwork.com/join", websiteUrl:"https://www.bilingualnotarynetwork.com" },
  { id:"n12", company:"Pavaso (Digital Close)",    logo:"💻", title:"Digital Closing Notary Agent",           location:"Remote / Philly Metro",   salary:"$80–145/closing", type:"Freelance", tag:"notary", match:88, about:"Pavaso is a leading digital mortgage closing platform enabling hybrid and fully digital closings. Their notary network handles eClose and hybrid transactions.", description:"Facilitate digital and hybrid mortgage closings using Pavaso's platform. Training provided.", requirements:["PA Notary Commission","Comfort with digital closing platforms","Detail-oriented","Reliable internet"], niceToHave:["eSign and eNotary familiarity","Mortgage industry background"], applyUrl:"https://www.pavaso.com/notary", websiteUrl:"https://www.pavaso.com" },
  { id:"n13", company:"Amrock (Rocket Mortgage)",  logo:"🚀", title:"Notary Closing Agent – Philly Region",   location:"Philadelphia Metro",       salary:"$100–175/closing",type:"Freelance", tag:"notary", match:93, about:"Amrock, backed by Rocket Companies, is one of the largest title, valuations, and settlement services companies in the US.", description:"Join Amrock's preferred notary network to handle high-volume Rocket Mortgage closings in the greater Philadelphia area.", requirements:["PA Notary Commission","NNA Certified Signing Agent","NNA-approved background check","Professional presentation"], niceToHave:["Rocket or Quicken Loans closing experience","eClose platform experience"], applyUrl:"https://www.amrock.com/closing-agents/", websiteUrl:"https://www.amrock.com" },
  { id:"n14", company:"SIGNiX",                   logo:"🔏", title:"Remote Online Notary Partner",           location:"Remote",                  salary:"$18–35/session",  type:"Part-Time", tag:"notary", match:82, about:"SIGNiX is a digital signature and RON platform used by financial institutions, healthcare organizations, and legal professionals nationwide.", description:"Become a SIGNiX RON partner and handle digital notarizations for financial, legal, and healthcare clients remotely.", requirements:["PA Notary License","PA RON Authorization","Digital signature platform comfort","Quiet home workspace"], niceToHave:["Financial services document experience","Flexible daytime availability"], applyUrl:"https://www.signix.com/notary-signup", websiteUrl:"https://www.signix.com" },
  { id:"n15", company:"Mobile Notary Services of PA", logo:"📍", title:"General Mobile Notary",               location:"Philadelphia, PA",        salary:"$20–35/doc + travel", type:"Part-Time", tag:"notary", match:86, about:"A Philadelphia-based mobile notary agency serving law firms, healthcare facilities, senior communities, and individuals requiring on-location notary services.", description:"Local mobile notary role serving hospital visits, POA signings, estate documents, affidavits, and oath administrations across Philadelphia.", requirements:["PA Notary Commission","Flexible availability","Own transportation","Professional and compassionate"], niceToHave:["Hospital or elder care experience","Evening/weekend availability"], applyUrl:"https://www.nationalnotary.org/find-a-notary", websiteUrl:"https://www.nationalnotary.org" },
  { id:"n16", company:"ALTA Best Practices Firm",  logo:"🏅", title:"Certified Notary Signing Agent",         location:"Philadelphia Metro",       salary:"$90–155/signing", type:"Freelance", tag:"notary", match:87, about:"An ALTA Best Practices certified title and settlement company serving lenders and real estate professionals across Pennsylvania and New Jersey.", description:"Become part of a compliant, quality-focused notary signing network. Consistent assignment volume for credentialed agents.", requirements:["PA Notary Commission","NNA Signing Agent Certification","E&O Insurance","ALTA compliance awareness"], niceToHave:["Title industry experience","Background check on file"], applyUrl:"https://www.alta.org/resources/notary.cfm", websiteUrl:"https://www.alta.org" },
  { id:"n17", company:"Notary Public Underwriters", logo:"🛡️", title:"E&O Insured Notary Network Agent",      location:"Philadelphia, PA",        salary:"$75–140/engagement", type:"Freelance", tag:"notary", match:84, about:"NPU is one of the nation's largest providers of notary E&O insurance and professional resources, helping notaries build sustainable signing businesses.", description:"Build your professional notary practice with NPU's network, resources, and insured agent designation. Ideal for notaries building a book of business.", requirements:["Active PA Notary Commission","E&O Insurance (from NPU or other)","Professional business approach"], niceToHave:["Any existing client relationships","Marketing savvy"], applyUrl:"https://www.npunderwriters.com/notary-network", websiteUrl:"https://www.npunderwriters.com" },
  { id:"n18", company:"Fidelity National Title",   logo:"🏦", title:"Notary Closing Agent",                   location:"Philadelphia, PA",        salary:"$95–165/closing", type:"Freelance", tag:"notary", match:91, about:"Fidelity National Title is one of the nation's largest title insurance and settlement services companies, with offices throughout the Philadelphia region.", description:"Join Fidelity's preferred notary panel to handle residential and commercial closings in the greater Philadelphia area.", requirements:["PA Notary Commission","NNA Certified Signing Agent","Background-screened","Laser printer"], niceToHave:["eClose experience","Spanish-speaking ability"], applyUrl:"https://www.fntic.com/careers/", websiteUrl:"https://www.fntic.com" },
  { id:"n19", company:"Old Republic National Title", logo:"📜", title:"Signing Agent – Preferred Panel",       location:"Philadelphia Metro",       salary:"$90–155/closing", type:"Freelance", tag:"notary", match:89, about:"Old Republic National Title is a major provider of title insurance and settlement services with a large presence in Pennsylvania and New Jersey.", description:"Join Old Republic's preferred signing agent panel for consistent loan closing assignments throughout the Philadelphia region.", requirements:["PA Notary Commission","NNA background check","Professional presentation","Same-day document return"], niceToHave:["Commercial closing experience","RON authorization"], applyUrl:"https://www.oldrepublictitle.com/careers", websiteUrl:"https://www.oldrepublictitle.com" },
  { id:"n20", company:"Philly Estate Planning Attorneys", logo:"⚖️", title:"Notary Public – Estate & Legal Docs", location:"Philadelphia, PA",    salary:"$25–50/visit",    type:"Part-Time", tag:"notary", match:83, about:"A consortium of Philadelphia estate planning and elder law attorneys seeking reliable notaries for client signings — wills, trusts, healthcare directives, and POA documents.", description:"Provide notarization services for estate planning attorneys' clients in Philadelphia. Flexible scheduling, meaningful work.", requirements:["PA Notary Commission","Detail-oriented & patient","Professional and confidential","Own transportation"], niceToHave:["Estate planning document familiarity","Elder care experience","Evening/weekend availability"], applyUrl:"https://www.philabar.org/", websiteUrl:"https://www.philabar.org" },
  { id:"n21", company:"Radian / Green River Capital", logo:"🏡", title:"REO Closing Notary Agent",              location:"Philadelphia Metro",       salary:"$85–140/closing", type:"Freelance", tag:"notary", match:86, about:"Green River Capital, a Radian company, manages REO (real estate owned) assets for lenders and servicers. Their closing team works with mobile notaries for REO property transactions.", description:"Handle REO and asset liquidation closings for a Radian subsidiary throughout the greater Philadelphia area.", requirements:["PA Notary Commission","REO or real estate closing experience preferred","NNA background check","Professional reliability"], niceToHave:["Asset management document experience","Commercial real estate familiarity"], applyUrl:"https://www.greenrivercapital.com/careers", websiteUrl:"https://www.greenrivercapital.com" },
];

/* ─── WEEKLY ROTATION ENGINE ─── */
const ROTATION_KEY   = "jamille_rotation_v1";
const APPS_KEY       = "jamille_apps_v2";
const PROGRAM_DAYS   = 90;
const REFRESH_DAYS   = 7;
const JOBS_PER_PAGE  = 15;

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

/* ─── RESUME DATA ─── */
const RESUME = {
  name:"Jamille Tinsley",
  title:"Certified Salesforce Administrator & Operations Executive",
  contact:{ phone:"267-205-5153", email:"jamille.tinsley13@gmail.com", location:"Philadelphia, PA 19124", linkedin:"linkedin.com/in/jamille-tinsley", trailhead:"trailblazer.me/id/jamillewilliams" },
  summary:"Results-driven Certified Salesforce Administrator and operations executive with 12+ years of cross-functional leadership experience across the PERS, legal, and technology sectors. Proven track record building CRM infrastructure from the ground up, launching products, scaling teams, and delivering measurable process improvements. Adept at translating complex business needs into elegant Salesforce solutions in fast-paced Agile environments. Simultaneously active as a licensed Notary Public available for mobile and remote online signings throughout the Philadelphia region.",
  skills:["Salesforce Administration (ADM-201)","Flow Builder & Process Automation","Einstein Analytics & Dashboards","Pardot / Marketing Cloud","Apex & Visualforce","Data Migration & Deduplication","API & Third-Party Integrations","Project Management","Agile / Scrum Methodology","Advanced Microsoft Excel","Strategic Planning & KPI Design","Team Leadership & Coaching","SOP & Process Design","Product Launch & Management","Notary Public – Commonwealth of PA"],
  tools:["Five9","Conga","DocuSign","Zuora","Velocify","ShipStation","Scout","Litify","Pardot","Einstein Analytics"],
  certifications:[
    { name:"Salesforce Certified Administrator (ADM-201)", issuer:"Salesforce", year:"Active" },
    { name:"Notary Public", issuer:"Commonwealth of Pennsylvania", year:"Active" },
    { name:"Trailhead Ranger", issuer:"Salesforce Trailhead", year:"100+ Badges" },
  ],
  experience:[
    { title:"Salesforce Administrator", company:"Yelp, Inc.", tenure:"October 2020 – Present", location:"Remote", bullets:["Administer and maintain two Salesforce orgs for the Sales & Marketing Engineering team in an Agile Scrum environment.","Lead Feature Request triage and delivery for new product implementations including Einstein AI tools and Pardot campaign automation.","Refined SFDC support model, achieving a 30% increase in case response rate and completion speed.","Collaborate cross-functionally with Sales, Marketing, and Engineering stakeholders to align CRM capabilities with business goals."] },
    { title:"Salesforce Administrator", company:"Pond Lehocky, LLP", tenure:"May 2019 – October 2020", location:"Philadelphia, PA", bullets:["Managed daily Salesforce operations as the sole CRM expert for one of Philadelphia's top personal injury law firms (200+ users) on the Litify platform.","Configured and expanded org to support adoption of new practice areas and onboarding of new user cohorts.","Led org-wide data quality initiative: eliminated duplicate records and established governance standards using Process Builder best practices."] },
    { title:"Director of Operations", company:"Medical Guardian", tenure:"2013 – 2016", location:"Philadelphia, PA", bullets:["Conceptualized and built the company's entire Operations Division from the ground up, reporting directly to the CEO.","Founded and scaled six functional departments: Client Services, Billing, Fulfillment, Procurement, Training, Collections, Retention, and Document Management.","Recruited, hired, and developed a team of 60+ employees; designed management structure, career paths, and performance systems.","Authored all SOPs, KPIs, and SLAs across operational functions. Named Medical Guardian Employee of the Year (2013)."] },
    { title:"Salesforce Administrator", company:"Medical Guardian", tenure:"2014 – 2017", location:"Philadelphia, PA", bullets:["Sole Salesforce Administrator for a 200+ user organization — owned all configuration, customization, and end-user support.","Key stakeholder in full Salesforce implementation: custom objects, workflow automation, validation rules, Apex triggers, Visualforce pages, and dashboards.","Integrated Salesforce with Five9, Conga, DocuSign, Zuora, Scout, ShipStation, and Velocify to create a unified operational ecosystem.","Delivered ongoing end-user training programs driving high adoption and system proficiency across departments."] },
    { title:"Director of Vendor Relations & Product Management", company:"Medical Guardian", tenure:"2016 – 2017", location:"Philadelphia, PA", bullets:["Led the successful launch of two hardware products, overseeing vendor management and cross-functional operations throughout the lifecycle.","Directed product testing, influenced UX and feature design, and owned root cause analysis for post-launch issues.","Coordinated Engineering, Sales, Operations, and Customer Service for seamless go-to-market execution."] },
    { title:"Director of Accounts", company:"Medical Guardian", tenure:"2010 – 2013", location:"Philadelphia, PA", bullets:["Stabilized and scaled a fast-growth small business as a senior executive reporting directly to the CEO.","Spearheaded the launch of two product lines and established Sales, Vendor Relations, and Finance departments.","Led system implementations for Five9 and Velocify, including vendor selection, configuration, and training.","Managed full employee lifecycle: onboarding, offboarding, performance management, and organizational design."] },
  ],
  education:[{ degree:"Bachelor of Science, Business Administration", school:"Temple University", location:"Philadelphia, PA" }],
};

/* ─── KANBAN COLUMNS ─── */
const COLUMNS = [
  { key:"saved",     label:"Saved",     color:"#7A8FA6" },
  { key:"applied",   label:"Applied",   color:"#2680D4" },
  { key:"interview", label:"Interview", color:"#C9A84C" },
  { key:"offer",     label:"Offer 🎉",  color:"#28A068" },
  { key:"rejected",  label:"Rejected",  color:"#B83232" },
];
const blankBoard = () => Object.fromEntries(COLUMNS.map(c => [c.key, []]));

/* ─── STORAGE HOOK (localStorage with Claude storage fallback) ─── */
function useStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
  });

  const save = useCallback((v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
    // Also persist to Claude storage if available
    try { window.storage?.set(key, JSON.stringify(v)); } catch {}
  }, [key]);

  // Sync from Claude storage on first load if localStorage is empty
  useEffect(() => {
    (async () => {
      try {
        const local = localStorage.getItem(key);
        if (!local && window.storage) {
          const r = await window.storage.get(key);
          if (r?.value) {
            const parsed = JSON.parse(r.value);
            setVal(parsed);
            localStorage.setItem(key, r.value);
          }
        }
      } catch {}
    })();
  }, [key]);

  return [val, save];
}

/* ─── UI PRIMITIVES ─── */
const Badge = ({ children, color = C.gold }) => (
  <span style={{ background:color+"18", color, border:`1px solid ${color}30`, borderRadius:20,
    padding:"2px 10px", fontSize:10, fontWeight:600, letterSpacing:"0.06em",
    textTransform:"uppercase", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif" }}>
    {children}
  </span>
);

const GoldDivider = ({ style={} }) => (
  <div style={{ height:1, margin:"12px 0 16px",
    background:`linear-gradient(90deg,${C.gold}55,${C.gold}11,transparent)`, ...style }} />
);

const EyebrowLabel = ({ children }) => (
  <div style={{ fontSize:9.5, color:C.gold, fontWeight:700, letterSpacing:"0.18em",
    textTransform:"uppercase", fontFamily:"'Outfit',sans-serif", marginBottom:5 }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant="gold", disabled, full, icon, style={} }) => {
  const variants = {
    gold:    { background:`linear-gradient(135deg,${C.gold},${C.goldBright})`, color:"#060D16", border:"none", boxShadow:`0 4px 18px ${C.gold}33` },
    ghost:   { background:"transparent", color:C.mutedMid, border:`1px solid rgba(255,255,255,0.1)`, boxShadow:"none" },
    outline: { background:"transparent", color:C.gold, border:`1px solid ${C.gold}44`, boxShadow:"none" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      ...variants[variant], borderRadius:9, padding:"9px 20px", fontWeight:700,
      cursor:disabled?"not-allowed":"pointer", fontSize:12, fontFamily:"'Outfit',sans-serif",
      opacity:disabled?0.45:1, display:"inline-flex", alignItems:"center", gap:6,
      width:full?"100%":undefined, justifyContent:full?"center":"flex-start",
      transition:"all 0.18s", ...style }}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
};

/* ─── SIDEBAR ─── */
const NAV = [
  { id:"dashboard", icon:"◈", label:"Overview"       },
  { id:"resume",    icon:"◎", label:"Resume"          },
  { id:"jobs",      icon:"◉", label:"Job Board"       },
  { id:"tracker",   icon:"◫", label:"Applications"   },
  { id:"interview", icon:"◆", label:"Interview Prep" },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width:220, background:C.surface, borderRight:`1px solid ${C.border}`,
      position:"fixed", top:0, left:0, height:"100vh", display:"flex",
      flexDirection:"column", zIndex:200, overflow:"hidden" }}>
      <div style={{ padding:"28px 20px 20px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:46, height:46, borderRadius:12, flexShrink:0,
          background:`linear-gradient(135deg,${C.gold}CC,${C.goldBright})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:17, fontWeight:800, color:"#060D16", marginBottom:14,
          boxShadow:`0 0 28px ${C.gold}33`, fontFamily:"'Cormorant Garamond',serif" }}>JT</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
          fontSize:17, color:C.white, lineHeight:1.3 }}>Jamille Tinsley</div>
        <div style={{ color:C.mutedMid, fontSize:11, marginTop:3,
          fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>SF Admin · Notary · Philadelphia</div>
        <a href="https://www.linkedin.com/in/jamille-tinsley/" target="_blank" rel="noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:11,
            color:C.gold, fontSize:10.5, textDecoration:"none", fontWeight:600,
            background:C.goldDim, border:`1px solid ${C.border}`,
            padding:"5px 10px", borderRadius:6, fontFamily:"'Outfit',sans-serif" }}>
          in  LinkedIn ↗
        </a>
      </div>
      <nav style={{ padding:"12px 10px", flex:1 }}>
        {NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:11,
              padding:"10px 13px", borderRadius:9, border:"none", cursor:"pointer",
              background:on?`linear-gradient(90deg,${C.goldDim},transparent)`:"transparent",
              borderLeft:on?`2px solid ${C.gold}`:"2px solid transparent",
              color:on?C.goldBright:C.muted, fontWeight:on?600:400, fontSize:13,
              fontFamily:"'Outfit',sans-serif", textAlign:"left",
              marginBottom:2, transition:"all 0.15s",
            }}>
              <span style={{ fontSize:14, opacity:on?1:0.4 }}>{n.icon}</span>{n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}` }}>
        {["ADM-201 Certified","Notary Public, PA","100+ Trailhead Badges"].map(t => (
          <div key={t} style={{ display:"flex", alignItems:"center", gap:7,
            fontSize:10, color:C.muted, marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>
            <span style={{ color:C.gold, fontSize:7 }}>✦</span>{t}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─── REFRESH BANNER ─── */
function RefreshBanner({ rotation, onRefresh, refreshed }) {
  if (!rotation) return null;
  const today       = getTodayStr();
  const programDay  = daysBetween(rotation.startDate, today) + 1;
  const daysLeft    = PROGRAM_DAYS - programDay + 1;
  const nextRefresh = daysBetween(today, rotation.nextRefreshDate);
  const expired     = daysLeft <= 0;
  const pct         = Math.min(100, Math.round((programDay / PROGRAM_DAYS) * 100));

  return (
    <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:14,
      padding:"16px 22px", marginBottom:20, display:"flex",
      alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <div style={{ flex:1, minWidth:200 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <EyebrowLabel>
            {expired ? "90-Day Program Complete" : `90-Day Job Refresh Program · Week ${rotation.weekNum + 1} of 13`}
          </EyebrowLabel>
          <span style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
            {expired ? "Complete ✓" : `${daysLeft} days remaining`}
          </span>
        </div>
        <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2,
            background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,
            width:`${pct}%`, transition:"width 0.6s" }} />
        </div>
      </div>
      <div style={{ display:"flex", gap:16, alignItems:"center", flexShrink:0 }}>
        {!expired && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22,
              fontWeight:700, color:C.gold }}>
              {nextRefresh <= 0 ? "Today" : `${nextRefresh}d`}
            </div>
            <div style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
              {nextRefresh <= 0 ? "refresh ready" : "until refresh"}
            </div>
          </div>
        )}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22,
            fontWeight:700, color:C.mutedMid }}>{pct}%</div>
          <div style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>complete</div>
        </div>
        {!expired && (
          <Btn onClick={onRefresh} variant={nextRefresh <= 0 ? "gold" : "outline"}
            icon={refreshed ? "✓" : "↻"} style={{ padding:"8px 16px" }}>
            {refreshed ? "Refreshed!" : nextRefresh <= 0 ? "Refresh Now" : "Preview Next"}
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ─── JOB DETAIL MODAL ─── */
function JobModal({ job, onClose, onSave, saved }) {
  if (!job) return null;
  const isNotary = job.tag === "notary";
  const tc = isNotary ? C.teal : C.blue;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(5,10,18,0.84)",
        zIndex:500, backdropFilter:"blur(6px)", animation:"overlayIn .22s ease" }} />
      <div className="slide-in" style={{ position:"fixed", top:0, right:0, height:"100vh",
        width:570, background:`linear-gradient(160deg,${C.card},${C.surface})`,
        borderLeft:`1px solid ${C.borderHi}`, zIndex:501, overflowY:"auto",
        boxShadow:"-20px 0 80px rgba(0,0,0,0.65)", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"32px 36px 24px", borderBottom:`1px solid ${C.border}`,
          background:`linear-gradient(135deg,${C.surface},${C.bg})`, position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:18, right:18,
            background:"transparent", border:"none", color:C.muted,
            cursor:"pointer", fontSize:20 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:52, height:52, borderRadius:12,
              background:`linear-gradient(135deg,${tc}22,${tc}44)`,
              border:`1px solid ${tc}44`, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:isNotary?22:15, fontWeight:800, color:tc,
              fontFamily:"'Cormorant Garamond',serif" }}>{job.logo}</div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22,
                fontWeight:700, color:C.white, lineHeight:1.2 }}>{job.title}</div>
              <div style={{ color:C.gold, fontSize:13, fontWeight:600,
                fontFamily:"'Outfit',sans-serif", marginTop:2 }}>{job.company}</div>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 }}>
            <Badge color={tc}>{job.type}</Badge>
            <Badge color={C.gold}>💰 {job.salary}</Badge>
            <Badge color={C.mutedMid}>📍 {job.location}</Badge>
          </div>
          {job.match && (
            <div style={{ display:"flex", alignItems:"center", gap:12,
              background:C.goldDim, border:`1px solid ${C.border}`,
              borderRadius:9, padding:"10px 14px" }}>
              <div style={{ width:44, height:44, position:"relative", flexShrink:0 }}>
                <svg viewBox="0 0 36 36" style={{ transform:"rotate(-90deg)", width:44, height:44 }}>
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.border} strokeWidth="2.5"/>
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke={C.gold}
                    strokeWidth="2.5" strokeDasharray={`${job.match} ${100-job.match}`} strokeLinecap="round"/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:10, fontWeight:700, color:C.gold,
                  fontFamily:"'Outfit',sans-serif" }}>{job.match}%</div>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gold }}>Profile Match Score</div>
                <div style={{ fontSize:11, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
                  Based on your Salesforce & leadership background
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding:"26px 36px", flex:1, overflowY:"auto" }}>
          <EyebrowLabel>About {job.company}</EyebrowLabel>
          <p style={{ fontSize:13, color:C.offwhite, lineHeight:1.72, margin:"6px 0 22px",
            fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{job.about}</p>
          <EyebrowLabel>Role Overview</EyebrowLabel>
          <GoldDivider style={{ margin:"6px 0 12px" }} />
          <p style={{ fontSize:13, color:C.offwhite, lineHeight:1.72, margin:"0 0 22px",
            fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{job.description}</p>
          <EyebrowLabel>Requirements</EyebrowLabel>
          <GoldDivider style={{ margin:"6px 0 12px" }} />
          <div style={{ marginBottom:20 }}>
            {job.requirements.map((r,i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
                <span style={{ color:C.gold, marginTop:1, flexShrink:0 }}>▸</span>
                <span style={{ fontSize:13, color:C.offwhite, lineHeight:1.5,
                  fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{r}</span>
              </div>
            ))}
          </div>
          {job.niceToHave?.length > 0 && <>
            <EyebrowLabel>Nice to Have</EyebrowLabel>
            <GoldDivider style={{ margin:"6px 0 12px" }} />
            <div style={{ marginBottom:12 }}>
              {job.niceToHave.map((r,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:7 }}>
                  <span style={{ color:C.mutedMid, marginTop:1, flexShrink:0 }}>◦</span>
                  <span style={{ fontSize:12.5, color:C.mutedMid, lineHeight:1.5,
                    fontFamily:"'Outfit',sans-serif" }}>{r}</span>
                </div>
              ))}
            </div>
          </>}
        </div>

        {/* Footer CTAs */}
        <div style={{ padding:"18px 36px 30px", borderTop:`1px solid ${C.border}`,
          background:`linear-gradient(0deg,${C.bg},transparent)`,
          display:"flex", flexDirection:"column", gap:9 }}>
          <a href={job.applyUrl} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <Btn full icon="↗" style={{ fontSize:14, padding:"13px 20px",
              background:`linear-gradient(135deg,${C.gold},${C.goldBright})`,
              boxShadow:`0 6px 28px ${C.gold}44` }}>
              Apply Now at {job.company}
            </Btn>
          </a>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant={saved?"ghost":"outline"} onClick={onSave} disabled={saved}
              full icon={saved?"✓":undefined} style={{ flex:1 }}>
              {saved ? "Saved to Tracker" : "Save to Tracker"}
            </Btn>
            <a href={job.websiteUrl} target="_blank" rel="noreferrer"
              style={{ textDecoration:"none", flex:1 }}>
              <Btn variant="ghost" full icon="🌐">Visit Website</Btn>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ applications, setTab, rotation }) {
  const total = Object.values(applications).flat().length;
  const stats = [
    { label:"Applications", value:total,                          icon:"◈", color:C.blue   },
    { label:"Interviews",   value:applications.interview?.length, icon:"◆", color:C.gold   },
    { label:"Offers",       value:applications.offer?.length,     icon:"★", color:C.green  },
    { label:"Jobs Saved",   value:applications.saved?.length,     icon:"◉", color:C.mutedMid },
  ];
  return (
    <div className="fade-up">
      <div style={{ marginBottom:32 }}>
        <EyebrowLabel>Career Intelligence Dashboard</EyebrowLabel>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:700,
          margin:"6px 0 0", lineHeight:1.1,
          background:`linear-gradient(100deg,${C.white} 50%,${C.goldBright})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Welcome back,<br/>Jamille.
        </h1>
        <p style={{ color:C.muted, margin:"12px 0 0", fontSize:13,
          fontFamily:"'Outfit',sans-serif", fontWeight:300, lineHeight:1.7 }}>
          Your personalized hub for Salesforce Admin &amp; Notary opportunities. 15 fresh jobs every week for 90 days.
        </p>
      </div>

      {rotation && (() => {
        const today = getTodayStr();
        const programDay = daysBetween(rotation.startDate, today) + 1;
        const pct = Math.min(100, Math.round((programDay / PROGRAM_DAYS) * 100));
        return (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
            padding:"16px 22px", marginBottom:22,
            display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontSize:10, color:C.gold, fontWeight:700,
                  letterSpacing:"0.12em", textTransform:"uppercase",
                  fontFamily:"'Outfit',sans-serif" }}>
                  Week {rotation.weekNum+1} of 13 · 90-Day Refresh Program
                </span>
                <span style={{ fontSize:10, color:C.muted,
                  fontFamily:"'Outfit',sans-serif" }}>Day {Math.min(programDay,90)}</span>
              </div>
              <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:2, width:`${pct}%`,
                  background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,
                  transition:"width 0.8s" }} />
              </div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {[
                ["Week", `${rotation.weekNum+1}/13`],
                ["Day", `${Math.min(programDay,90)}/90`],
                ["Progress", `${pct}%`],
              ].map(([k,v]) => (
                <div key={k} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:20, fontWeight:700, color:C.gold }}>{v}</div>
                  <div style={{ fontSize:10, color:C.muted,
                    fontFamily:"'Outfit',sans-serif" }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={s.label} className="fade-up" style={{ animationDelay:`${i*0.07}s`,
            background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ color:s.color, fontSize:12, marginBottom:8, opacity:0.7 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36,
              fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:3,
              fontFamily:"'Outfit',sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"5fr 4fr", gap:18, marginBottom:18 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <EyebrowLabel>Profile Snapshot</EyebrowLabel>
          <GoldDivider />
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
            {["Salesforce ADM-201","Flow Builder","Einstein Analytics","Pardot","Data Migration",
              "API Integrations","Agile / Scrum","Operations Leadership","Notary Public"].map(s => (
              <span key={s} style={{ background:C.goldDim, border:`1px solid ${C.border}`,
                borderRadius:6, padding:"4px 10px", fontSize:11,
                color:C.offwhite, fontFamily:"'Outfit',sans-serif" }}>{s}</span>
            ))}
          </div>
          {[["Current Focus","Part-Time SF Admin · Notary"],["Experience","12+ Years"],
            ["Certifications","ADM-201 · PA Notary Public"],["Trailhead","Ranger · 100+ Badges"],
            ["Location","Philadelphia, PA 19124"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between",
              fontSize:12.5, paddingBottom:9, marginBottom:9,
              borderBottom:`1px solid ${C.border}`, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ color:C.muted }}>{k}</span>
              <span style={{ fontWeight:600, color:C.white }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <EyebrowLabel>Quick Actions</EyebrowLabel>
          <GoldDivider />
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"◉", label:"Browse 15 New Jobs",        sub:"This week's curated opportunities",          tab:"jobs",      c:C.blue  },
              { icon:"◎", label:"View / Print Resume",        sub:"Updated from LinkedIn & CV",                 tab:"resume",    c:C.gold  },
              { icon:"◫", label:"Track Applications",         sub:"Manage your job pipeline",                   tab:"tracker",   c:C.green },
              { icon:"◆", label:"Interview Practice",         sub:"25+ role-specific Q&A with coaching",        tab:"interview", c:C.amber },
            ].map(a => (
              <button key={a.tab} onClick={() => setTab(a.tab)} style={{
                background:`linear-gradient(90deg,${a.c}0A,transparent)`,
                border:`1px solid ${a.c}22`, borderRadius:10,
                padding:"12px 14px", cursor:"pointer", textAlign:"left",
                fontFamily:"'Outfit',sans-serif", transition:"all 0.15s",
              }}>
                <div style={{ fontWeight:600, fontSize:12.5, color:a.c }}>
                  {a.icon}  {a.label}
                </div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {total > 0 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
          <EyebrowLabel>Pipeline Overview</EyebrowLabel>
          <GoldDivider />
          <div style={{ display:"flex" }}>
            {COLUMNS.map(col => {
              const count = applications[col.key]?.length || 0;
              return (
                <div key={col.key} style={{ flex:1, textAlign:"center", padding:"6px 0" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32,
                    fontWeight:700, color:col.color }}>{count}</div>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6,
                    fontFamily:"'Outfit',sans-serif" }}>{col.label}</div>
                  <div style={{ height:2, margin:"0 10px", borderRadius:1,
                    background:count>0?col.color:C.border, opacity:count>0?0.7:0.2 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── RESUME VIEW ─── */
function ResumeView() {
  const r = RESUME;
  const sh = (label) => (
    <div style={{ marginTop:26, marginBottom:4 }}>
      <EyebrowLabel>{label}</EyebrowLabel>
      <GoldDivider />
    </div>
  );
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <EyebrowLabel>Resume</EyebrowLabel>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28,
            fontWeight:700, margin:"4px 0 0", color:C.white }}>Jamille Tinsley</h2>
          <p style={{ color:C.muted, fontSize:12, margin:"5px 0 0",
            fontFamily:"'Outfit',sans-serif" }}>Updated from LinkedIn & CV · April 2026</p>
        </div>
        <button onClick={() => window.print()} style={{
          background:`linear-gradient(135deg,${C.gold},${C.goldBright})`, color:"#060D16",
          border:"none", borderRadius:9, padding:"10px 20px", fontWeight:700,
          cursor:"pointer", fontSize:12, fontFamily:"'Outfit',sans-serif",
          boxShadow:`0 4px 18px ${C.gold}33`, display:"flex", alignItems:"center", gap:6 }}>
          ↓ Print / Download
        </button>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"32px 36px 26px",
          background:`linear-gradient(135deg,${C.surface},${C.bg})`,
          borderBottom:`1px solid ${C.border}` }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36,
            fontWeight:700, margin:"0 0 4px", color:C.white }}>{r.name}</h1>
          <div style={{ fontSize:14, color:C.gold, fontWeight:500,
            marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>{r.title}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, fontSize:12,
            color:C.mutedMid, fontFamily:"'Outfit',sans-serif" }}>
            <span>📱 {r.contact.phone}</span>
            <span>✉️ {r.contact.email}</span>
            <span>📍 {r.contact.location}</span>
            <a href="https://www.linkedin.com/in/jamille-tinsley/" target="_blank" rel="noreferrer"
              style={{ color:C.gold, textDecoration:"none" }}>in {r.contact.linkedin}</a>
            <a href="https://trailblazer.me/id/jamillewilliams" target="_blank" rel="noreferrer"
              style={{ color:C.gold, textDecoration:"none" }}>☁️ {r.contact.trailhead}</a>
          </div>
        </div>
        <div style={{ padding:"4px 36px 36px" }}>
          {sh("Professional Summary")}
          <p style={{ fontSize:13, color:C.offwhite, lineHeight:1.75, margin:0,
            fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{r.summary}</p>
          {sh("Core Competencies")}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"3px 20px" }}>
            {r.skills.map(s => (
              <div key={s} style={{ display:"flex", gap:7, fontSize:12,
                color:C.offwhite, padding:"3px 0", fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>
                <span style={{ color:C.gold, fontSize:7, marginTop:5, flexShrink:0 }}>✦</span>{s}
              </div>
            ))}
          </div>
          {sh("Tools & Integrations")}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {r.tools.map(t => (
              <span key={t} style={{ background:C.goldDim, border:`1px solid ${C.border}`,
                borderRadius:6, padding:"4px 12px", fontSize:11.5,
                color:C.offwhite, fontFamily:"'Outfit',sans-serif" }}>{t}</span>
            ))}
          </div>
          {sh("Professional Experience")}
          {r.experience.map((exp,i) => (
            <div key={i} style={{ marginBottom:22, paddingBottom:22,
              borderBottom:i < r.experience.length-1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17,
                    fontWeight:700, color:C.white }}>{exp.title}</div>
                  <div style={{ color:C.gold, fontSize:12.5, fontWeight:600, marginTop:2,
                    fontFamily:"'Outfit',sans-serif" }}>{exp.company}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11.5, color:C.mutedMid, fontFamily:"'Outfit',sans-serif" }}>{exp.tenure}</div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>{exp.location}</div>
                </div>
              </div>
              <div style={{ marginTop:10 }}>
                {exp.bullets.map((b,j) => (
                  <div key={j} style={{ display:"flex", gap:10, marginBottom:6 }}>
                    <span style={{ color:C.gold, fontSize:7, marginTop:5, flexShrink:0 }}>▸</span>
                    <span style={{ fontSize:12.5, color:C.offwhite, lineHeight:1.6,
                      fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {sh("Certifications")}
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {r.certifications.map((cert,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", background:C.goldDim, border:`1px solid ${C.border}`,
                borderRadius:9, padding:"11px 16px" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.white,
                    fontFamily:"'Outfit',sans-serif" }}>{cert.name}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2,
                    fontFamily:"'Outfit',sans-serif" }}>{cert.issuer}</div>
                </div>
                <Badge color={C.gold}>{cert.year}</Badge>
              </div>
            ))}
          </div>
          {sh("Education")}
          {r.education.map((e,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
                  fontWeight:700, color:C.white }}>{e.degree}</div>
                <div style={{ fontSize:12, color:C.gold, marginTop:2,
                  fontFamily:"'Outfit',sans-serif" }}>{e.school}</div>
              </div>
              <div style={{ fontSize:11, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
                {e.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── JOB BOARD ─── */
function JobBoard({ weekJobs, rotation, onSaveJob, savedIds, onRefresh }) {
  const [filter, setFilter]  = useState("salesforce");
  const [selected, setSelected] = useState(null);
  const [refreshed, setRefreshed] = useState(false);

  const sfJobs     = weekJobs.sf;
  const notaryJobs = weekJobs.notary;
  const jobs       = filter === "salesforce" ? sfJobs : notaryJobs;

  const handleRefresh = () => {
    onRefresh();
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 3000);
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <EyebrowLabel>Job Board</EyebrowLabel>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30,
          fontWeight:700, margin:"4px 0 6px", color:C.white }}>This Week's Opportunities</h2>
        <p style={{ color:C.muted, fontSize:12, margin:0,
          fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>
          15 curated openings per category · Click any role to view details and apply directly to the company's careers page.
        </p>
      </div>

      <RefreshBanner rotation={rotation} onRefresh={handleRefresh} refreshed={refreshed} />

      <div style={{ display:"flex", gap:8, marginBottom:22, alignItems:"center", flexWrap:"wrap" }}>
        {[{key:"salesforce",label:"☁  Salesforce Admin"},{key:"notary",label:"✍  Notary / Signing Agent"}].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            background:filter===f.key?`linear-gradient(135deg,${C.gold},${C.goldBright})`:"transparent",
            color:filter===f.key?"#060D16":C.muted,
            border:`1px solid ${filter===f.key?C.gold:C.border}`,
            borderRadius:20, padding:"8px 20px", fontSize:12, fontWeight:600,
            cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.2s",
            boxShadow:filter===f.key?`0 4px 16px ${C.gold}33`:"none",
          }}>{f.label} ({filter===f.key?jobs.length:(filter==="salesforce"?notaryJobs.length:sfJobs.length)})</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          {rotation && (
            <span style={{ fontSize:11, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
              Week {rotation.weekNum+1} · {rotation.lastRefreshDate}
            </span>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {jobs.map((job,i) => {
          const isSaved = savedIds.has(job.id);
          const tc = job.tag==="notary" ? C.teal : C.blue;
          return (
            <div key={job.id} className="fade-up" style={{ animationDelay:`${i*0.04}s`,
              background:C.card, border:`1px solid ${isSaved?C.green+"44":C.border}`,
              borderRadius:14, padding:18, cursor:"pointer",
              transition:"all 0.2s", display:"flex", flexDirection:"column",
              boxShadow:isSaved?`0 0 18px ${C.green}18`:"none" }}
              onClick={() => setSelected(job)}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderHi; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 28px rgba(0,0,0,0.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=isSaved?C.green+"44":C.border; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=isSaved?`0 0 18px ${C.green}18`:"none"; }}>

              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:8, flexShrink:0,
                  background:`linear-gradient(135deg,${tc}18,${tc}33)`,
                  border:`1px solid ${tc}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:job.tag==="notary"?16:13, fontWeight:800, color:tc,
                  fontFamily:"'Cormorant Garamond',serif" }}>{job.logo}</div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Badge color={tc}>{job.type}</Badge>
                  {job.match && <span style={{ fontSize:9.5, color:C.gold,
                    fontFamily:"'Outfit',sans-serif", fontWeight:600 }}>{job.match}% match</span>}
                </div>
              </div>

              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15,
                fontWeight:700, color:C.white, marginBottom:3, lineHeight:1.3 }}>{job.title}</div>
              <div style={{ color:C.gold, fontSize:11, fontWeight:600, marginBottom:8,
                fontFamily:"'Outfit',sans-serif" }}>{job.company}</div>
              <div style={{ display:"flex", gap:10, fontSize:10.5, color:C.muted,
                marginBottom:10, fontFamily:"'Outfit',sans-serif", flexWrap:"wrap" }}>
                <span>📍 {job.location}</span>
                <span>💰 {job.salary}</span>
              </div>
              <p style={{ fontSize:11.5, color:C.muted, margin:"0 0 12px", lineHeight:1.55,
                fontFamily:"'Outfit',sans-serif", fontWeight:300, flex:1 }}>
                {job.description.slice(0,95)}{job.description.length>95?"…":""}
              </p>

              <div style={{ display:"flex", gap:7, marginTop:"auto" }}>
                <button onClick={e=>{e.stopPropagation();setSelected(job);}} style={{
                  flex:1, background:C.goldDim, border:`1px solid ${C.gold}33`,
                  borderRadius:7, color:C.gold, fontSize:10.5, fontWeight:600,
                  cursor:"pointer", padding:"7px 0", fontFamily:"'Outfit',sans-serif" }}>
                  View & Apply ↗
                </button>
                <button onClick={e=>{e.stopPropagation();onSaveJob(job);}}
                  disabled={isSaved} style={{
                  background:isSaved?C.green+"18":"transparent",
                  border:`1px solid ${isSaved?C.green+"44":C.border}`,
                  borderRadius:7, color:isSaved?C.green:C.mutedMid,
                  fontSize:11, fontWeight:600, cursor:isSaved?"default":"pointer",
                  padding:"7px 10px", fontFamily:"'Outfit',sans-serif" }}>
                  {isSaved?"✓":"＋"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <JobModal job={selected} onClose={() => setSelected(null)}
        onSave={() => onSaveJob(selected)}
        saved={selected ? savedIds.has(selected.id) : false} />
    </div>
  );
}

/* ─── APP TRACKER ─── */
function KanbanCard({ app, colKey, onMove, onRemove }) {
  return (
    <div style={{ background:C.surface, borderRadius:10, padding:"11px 13px",
      border:`1px solid ${C.border}`, marginBottom:8 }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:700,
        marginBottom:2, color:C.white, lineHeight:1.25 }}>{app.title}</div>
      <div style={{ fontSize:11, color:C.gold, fontWeight:600, marginBottom:7,
        fontFamily:"'Outfit',sans-serif" }}>{app.company}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {app.location && <span style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>📍 {app.location}</span>}
        {app.salary   && <span style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>💰 {app.salary}</span>}
        {app.date     && <span style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>📅 {app.date}</span>}
      </div>
      {app.type && <div style={{ marginTop:7 }}><Badge color={app.type==="Notary"?C.teal:C.blue}>{app.type}</Badge></div>}
      {app.notes && <div style={{ fontSize:10, color:C.muted, marginTop:7, fontStyle:"italic",
        lineHeight:1.4, fontFamily:"'Outfit',sans-serif" }}>"{app.notes}"</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:9 }}>
        {COLUMNS.filter(c=>c.key!==colKey).map(c => (
          <button key={c.key} onClick={() => onMove(app,colKey,c.key)} style={{
            background:c.color+"18", color:c.color, border:`1px solid ${c.color}30`,
            borderRadius:5, padding:"2px 7px", fontSize:9, fontWeight:600,
            cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
            {c.label}
          </button>
        ))}
        <button onClick={() => onRemove(app,colKey)} style={{ background:"transparent",
          color:C.red, border:"none", cursor:"pointer", fontSize:13, marginLeft:"auto" }}>✕</button>
      </div>
    </div>
  );
}

function AppTracker({ applications, setApplications }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company:"", title:"", location:"", salary:"",
    type:"Salesforce Admin", date:new Date().toISOString().slice(0,10), notes:"" });

  const addApp = () => {
    if (!form.company.trim()||!form.title.trim()) return;
    setApplications({...applications, applied:[...applications.applied,{...form,id:Date.now().toString()}]});
    setForm({ company:"", title:"", location:"", salary:"",
      type:"Salesforce Admin", date:new Date().toISOString().slice(0,10), notes:"" });
    setShowForm(false);
  };
  const moveApp=(app,from,to)=>setApplications({...applications,[from]:applications[from].filter(a=>a.id!==app.id),[to]:[...applications[to],app]});
  const removeApp=(app,s)=>setApplications({...applications,[s]:applications[s].filter(a=>a.id!==app.id)});

  const inp=(label,key,type="text",opts=null)=>(
    <div>
      <div style={{ fontSize:9.5, color:C.muted, fontWeight:600, textTransform:"uppercase",
        letterSpacing:"0.1em", marginBottom:5, fontFamily:"'Outfit',sans-serif" }}>{label}</div>
      {opts ? (
        <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
          style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:8, padding:"9px 12px", color:C.white, fontSize:12.5,
            outline:"none", fontFamily:"'Outfit',sans-serif" }}>
          {opts.map(o=><option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
          style={{ width:"100%", boxSizing:"border-box", background:C.surface,
            border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px",
            color:C.white, fontSize:12.5, outline:"none", fontFamily:"'Outfit',sans-serif" }} />
      )}
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26 }}>
        <div>
          <EyebrowLabel>Application Tracker</EyebrowLabel>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30,
            fontWeight:700, margin:"4px 0 0", color:C.white }}>Your Pipeline</h2>
        </div>
        <Btn onClick={() => setShowForm(!showForm)} icon="＋">Add Application</Btn>
      </div>
      {showForm && (
        <div style={{ background:C.card, border:`1px solid ${C.borderHi}`, borderRadius:14,
          padding:24, marginBottom:20, boxShadow:`0 0 40px ${C.gold}18` }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.goldBright, marginBottom:14,
            fontFamily:"'Outfit',sans-serif" }}>New Application</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
            {inp("Company","company")}{inp("Job Title","title")}{inp("Location","location")}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 2fr", gap:12, marginBottom:18 }}>
            {inp("Salary","salary")}
            {inp("Type","type","text",["Salesforce Admin","Notary","Other"])}
            {inp("Date Applied","date","date")}
            {inp("Notes","notes")}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={addApp}>Save Application</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
        {COLUMNS.map(col => (
          <div key={col.key} style={{ background:C.card, borderRadius:12,
            border:`1px solid ${col.color}22`, padding:13, minHeight:320 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:10, fontWeight:700, color:col.color,
                textTransform:"uppercase", letterSpacing:"0.1em",
                fontFamily:"'Outfit',sans-serif" }}>{col.label}</div>
              <div style={{ background:col.color+"22", color:col.color, borderRadius:"50%",
                width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:800 }}>{applications[col.key]?.length||0}</div>
            </div>
            {(applications[col.key]||[]).map(app => (
              <KanbanCard key={app.id} app={app} colKey={col.key} onMove={moveApp} onRemove={removeApp} />
            ))}
            {(applications[col.key]?.length||0)===0 && (
              <div style={{ textAlign:"center", padding:"26px 0", color:C.muted,
                fontSize:11, border:`1px dashed ${col.color}18`, borderRadius:9,
                fontFamily:"'Outfit',sans-serif" }}>No items yet</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── INTERVIEW PREP ─── */
const INTERVIEW_SETS = {
  behavioral:{label:"Behavioral",color:C.blue,icon:"🧠",questions:[
    {q:"Tell me about a time you improved a Salesforce process that saved time or reduced errors.",tip:"Use STAR. Quantify impact — e.g. '30% reduction in case response time at Yelp.' Name specific tools like Flow Builder or Pardot."},
    {q:"Describe a situation where you managed competing priorities across multiple stakeholders.",tip:"Your CEO-reporting role at Medical Guardian is perfect here. You balanced Operations, Sales, and Product simultaneously."},
    {q:"Give an example of a complex data migration you led. What challenges arose?",tip:"Draw on your Medical Guardian full-org build. Mention Zuora, DocuSign, Five9 integration and data governance you established."},
    {q:"Tell me about a time you trained end users on a new system. How did you ensure adoption?",tip:"Reference your 60+ person team at Medical Guardian. Mention SOPs, KPI tracking, and how you measured training effectiveness."},
    {q:"Describe a product launch you owned. Walk me through your approach.",tip:"Two product launches as Director of Vendor Relations. Cover vendor selection, testing, root cause analysis, and go-to-market."},
  ]},
  technical:{label:"Salesforce Technical",color:C.gold,icon:"☁️",questions:[
    {q:"What's the difference between a Process Builder and a Flow? When would you use each?",tip:"Flows are now Salesforce's only automation tool — Process Builder new creation is retired. Mention your migration experience at Pond Lehocky and Yelp."},
    {q:"How do you approach deduplication in a large Salesforce org with 200+ users?",tip:"Reference your Pond Lehocky dedup initiative. Cover Duplicate Rules, Matching Rules, third-party tools, and post-cleanup governance."},
    {q:"Walk me through how you'd design role hierarchy and sharing rules for a 200-person org.",tip:"You've built this at Yelp and Medical Guardian. OWD defaults, role hierarchy design, criteria-based sharing, principle of least privilege."},
    {q:"How have you used Einstein Analytics or AI tools to support business decisions?",tip:"Reference Einstein tools at Yelp. Describe a specific dashboard or insight that influenced a business outcome."},
    {q:"What integrations have you managed, and how did you handle errors or sync failures?",tip:"Your list is impressive: Five9, Conga, DocuSign, Zuora, Scout, ShipStation, Velocify. Speak to monitoring, error logging, vendor coordination."},
    {q:"Explain validation rules vs. workflow rules. Give a real example of each from your experience.",tip:"Validation rules = enforce data quality at input. Flows/workflow rules = trigger automated actions post-save. Give a Medical Guardian example for each."},
  ]},
  notary:{label:"Notary / Signing",color:C.green,icon:"📜",questions:[
    {q:"What types of documents have you most frequently notarized?",tip:"Cover your range: affidavits, POA, loan packages, real estate closings, medical consent docs, estate planning instruments."},
    {q:"Walk me through your full process for a loan signing appointment.",tip:"Confirm → review package → print/organize → verify signer ID (2 IDs) → walk through each document → notarize → return package same day. Professionalism and accuracy are everything."},
    {q:"How do you handle a situation where a signer refuses or is unable to complete the signing?",tip:"Don't pressure — document everything, contact the title company immediately, note the refusal professionally. The notary's role is to witness, not influence."},
    {q:"What's your availability and geographic coverage area?",tip:"Be specific: Philadelphia proper, surrounding counties, RON sessions remotely. Evening and weekend availability is a strong differentiator."},
    {q:"Are you NNA certified and do you carry E&O insurance?",tip:"NNA Certified Signing Agent certification and E&O insurance ($25k–$100k) are the two most important credentials for consistent title company assignments."},
  ]},
  situational:{label:"Situational",color:C.amber,icon:"💡",questions:[
    {q:"A sales rep reports their workflow automation 'just stopped working.' How do you triage?",tip:"Check Setup Audit Trail first → identify recent changes → debug in Flow Debug logs → verify active/inactive status and criteria. Communicate ETA to the rep."},
    {q:"Leadership needs a pipeline health dashboard by region by end of business. What's your process?",tip:"Confirm report type → build custom reports → save to folder → create dashboard components → add to exec dashboard → set auto-refresh. Done in under 2 hours."},
    {q:"You're onboarding 30 users from an acquired company into your Salesforce org. What's your plan?",tip:"Phase 1: audit needs → assign profiles/roles. Phase 2: migrate data with dedup. Phase 3: sandbox training. Phase 4: phased go-live with hypercare."},
    {q:"A signer texts you 10 minutes before their appointment saying they can't make it. What do you do?",tip:"Immediately contact the title company. Reschedule within their acceptable window. Document the cancellation in the platform. Follow up professionally."},
  ]},
};

function QuestionItem({ item, idx, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o=>!o)} style={{
      background:C.card, border:`1px solid ${open?color+"44":C.border}`,
      borderRadius:12, padding:"16px 20px", cursor:"pointer", transition:"all 0.2s",
      boxShadow:open?`0 0 22px ${color}18`:"none" }}>
      <div style={{ display:"flex", gap:13, alignItems:"flex-start" }}>
        <div style={{ background:color+"22", color, borderRadius:"50%", width:28, height:28,
          flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:800, fontFamily:"'Outfit',sans-serif" }}>{idx+1}</div>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700,
            margin:0, color:C.white, lineHeight:1.4 }}>{item.q}</p>
          {open && (
            <div style={{ marginTop:12, padding:"13px 15px", background:color+"0D",
              borderRadius:9, border:`1px solid ${color}22` }}>
              <div style={{ fontSize:9.5, fontWeight:700, color, textTransform:"uppercase",
                letterSpacing:"0.12em", marginBottom:7, fontFamily:"'Outfit',sans-serif" }}>💡 Coaching Tip</div>
              <p style={{ fontSize:12.5, color:C.offwhite, margin:0, lineHeight:1.65,
                fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>{item.tip}</p>
            </div>
          )}
        </div>
        <div style={{ color:C.muted, fontSize:13 }}>{open?"▲":"▼"}</div>
      </div>
    </div>
  );
}

function InterviewPrep() {
  const [category, setCategory] = useState("behavioral");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("flashcard");
  const set = INTERVIEW_SETS[category];
  const q   = set.questions[idx];
  const total = set.questions.length;
  const next = () => { setIdx(i=>(i+1)%total); setFlipped(false); };
  const prev = () => { setIdx(i=>(i-1+total)%total); setFlipped(false); };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <EyebrowLabel>Interview Preparation</EyebrowLabel>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30,
          fontWeight:700, margin:"4px 0 6px", color:C.white }}>Practice & Coaching</h2>
        <p style={{ color:C.muted, fontSize:12, margin:0, fontFamily:"'Outfit',sans-serif", fontWeight:300 }}>
          Questions personalized to your résumé — tap any card to reveal your coaching tip.
        </p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        {Object.entries(INTERVIEW_SETS).map(([key,s]) => (
          <button key={key} onClick={() => { setCategory(key); setIdx(0); setFlipped(false); }} style={{
            background:category===key?`linear-gradient(135deg,${s.color}BB,${s.color}88)`:"transparent",
            color:category===key?"#fff":C.muted,
            border:`1px solid ${category===key?s.color:C.border}`,
            borderRadius:20, padding:"7px 16px", fontSize:11.5, fontWeight:600,
            cursor:"pointer", fontFamily:"'Outfit',sans-serif",
            boxShadow:category===key?`0 4px 14px ${s.color}33`:"none",
          }}>{s.icon} {s.label} ({s.questions.length})</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {[{m:"flashcard",l:"🃏 Cards"},{m:"list",l:"📋 List"}].map(({m,l}) => (
            <button key={m} onClick={() => setMode(m)} style={{
              background:mode===m?C.goldDim:"transparent",
              color:mode===m?C.goldBright:C.muted,
              border:`1px solid ${mode===m?C.gold+"44":C.border}`,
              borderRadius:8, padding:"7px 13px", fontSize:11, fontWeight:600,
              cursor:"pointer", fontFamily:"'Outfit',sans-serif",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {mode==="flashcard" ? (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:3, background:C.border, borderRadius:2 }}>
              <div style={{ height:"100%", borderRadius:2,
                background:`linear-gradient(90deg,${set.color},${set.color}88)`,
                width:`${((idx+1)/total)*100}%`, transition:"width 0.4s" }} />
            </div>
            <span style={{ fontSize:11, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>{idx+1}/{total}</span>
          </div>
          <div onClick={() => setFlipped(f=>!f)} style={{
            cursor:"pointer", minHeight:270,
            background:flipped?`linear-gradient(135deg,${set.color}14,${set.color}08)`:`linear-gradient(135deg,${C.card},${C.surface})`,
            border:`1px solid ${set.color}${flipped?"55":"22"}`,
            borderRadius:20, padding:"46px 50px",
            display:"flex", flexDirection:"column",
            justifyContent:"center", alignItems:"center",
            textAlign:"center", transition:"all 0.3s", marginBottom:20,
            boxShadow:flipped?`0 0 50px ${set.color}22,0 20px 60px rgba(0,0,0,0.5)`:`0 10px 40px rgba(0,0,0,0.4)`,
          }}>
            <div style={{ fontSize:10, fontWeight:700, color:set.color,
              letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:16,
              fontFamily:"'Outfit',sans-serif" }}>
              {flipped?"💡 Coaching Tip":`${set.icon}  Question ${idx+1} of ${total}`}
            </div>
            <p style={{ fontSize:flipped?14:19, color:flipped?C.offwhite:C.white,
              fontFamily:flipped?"'Outfit',sans-serif":"'Cormorant Garamond',serif",
              fontWeight:flipped?300:700, lineHeight:1.55, margin:0, maxWidth:560 }}>
              {flipped?q.tip:q.q}
            </p>
            {!flipped && <div style={{ marginTop:20, fontSize:11, color:C.muted,
              fontFamily:"'Outfit',sans-serif" }}>Tap to reveal coaching tip →</div>}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Btn variant="ghost" onClick={prev}>← Prev</Btn>
            <Btn variant="outline" onClick={() => setFlipped(f=>!f)}>
              {flipped?"Show Question":"Show Tip"}
            </Btn>
            <Btn onClick={next}>Next →</Btn>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {set.questions.map((item,i) => (
            <QuestionItem key={i} item={item} idx={i} color={set.color} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ROOT APP ─── */
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [applications, setApplications] = useStorage(APPS_KEY, blankBoard());
  const [savedJobIds, setSavedJobIds]   = useState(new Set());
  const [rotation, setRotation]         = useStorage(ROTATION_KEY, null);

  /* Boot / advance rotation */
  useEffect(() => {
    const today = getTodayStr();
    setRotation(prev => {
      if (!prev) {
        return { startDate:today, lastRefreshDate:today, nextRefreshDate:addDays(today,7), weekNum:0 };
      }
      const expired = daysBetween(prev.startDate, today) >= PROGRAM_DAYS;
      if (expired) return prev;
      const due = daysBetween(prev.lastRefreshDate, today) >= REFRESH_DAYS;
      if (due) {
        const newWeek = Math.min(prev.weekNum + 1, 12);
        return { ...prev, lastRefreshDate:today, nextRefreshDate:addDays(today,7), weekNum:newWeek };
      }
      return prev;
    });
  }, []);

  function addDays(dateStr, n) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0,10);
  }

  const handleManualRefresh = () => {
    const today = getTodayStr();
    setRotation(prev => {
      if (!prev) return prev;
      const expired = daysBetween(prev.startDate, today) >= PROGRAM_DAYS;
      if (expired) return prev;
      const newWeek = Math.min(prev.weekNum + 1, 12);
      return { ...prev, lastRefreshDate:today, nextRefreshDate:addDays(today,7), weekNum:newWeek };
    });
  };

  /* Compute this week's 15 jobs per category */
  const weekJobs = useMemo(() => {
    const seed = (rotation?.weekNum ?? 0) + 1;
    const sf     = seededShuffle(SF_POOL,    seed * 31337).slice(0, JOBS_PER_PAGE);
    const notary = seededShuffle(NOTARY_POOL, seed * 99991).slice(0, JOBS_PER_PAGE);
    return { sf, notary };
  }, [rotation?.weekNum]);

  useEffect(() => {
    setSavedJobIds(new Set(applications.saved?.map(a=>a.id)||[]));
  }, [applications]);

  const handleSaveJob = (job) => {
    if (!job || savedJobIds.has(job.id)) return;
    setApplications({
      ...applications,
      saved:[...applications.saved,{
        id:job.id, company:job.company, title:job.title, location:job.location,
        salary:job.salary, type:job.tag==="notary"?"Notary":"Salesforce Admin",
        date:new Date().toISOString().slice(0,10), notes:"",
      }],
    });
  };

  const renderTab = () => {
    switch(tab) {
      case "dashboard": return <Dashboard applications={applications} setTab={setTab} rotation={rotation} />;
      case "resume":    return <ResumeView />;
      case "jobs":      return <JobBoard weekJobs={weekJobs} rotation={rotation} onSaveJob={handleSaveJob} savedIds={savedJobIds} onRefresh={handleManualRefresh} />;
      case "tracker":   return <AppTracker applications={applications} setApplications={setApplications} />;
      case "interview": return <InterviewPrep />;
      default:          return null;
    }
  };

  return (
    <>
      <Fonts />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.bg};}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${C.surface};}
        ::-webkit-scrollbar-thumb{background:${C.gold}44;border-radius:3px;}
        button{transition:all 0.15s;}
        button:hover:not(:disabled){filter:brightness(1.1);}
        @media print{aside,nav{display:none!important;}main{margin-left:0!important;padding:20px!important;}}
      `}</style>
      <div style={{ fontFamily:"'Outfit',sans-serif", background:C.bg,
        minHeight:"100vh", color:C.white, display:"flex" }}>
        <Sidebar active={tab} setActive={setTab} />
        <main style={{ marginLeft:220, padding:"36px 42px", minHeight:"100vh", flex:1 }}>
          {renderTab()}
        </main>
      </div>
    </>
  );
}
