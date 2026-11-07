import {createServer} from "/opt/flowkit/dashboard/node_modules/vite/dist/node/index.js";
import {chromium} from "/opt/reddit-agent-publisher/node_modules/playwright-core/index.mjs";
import {mkdirSync,writeFileSync} from "node:fs";
import path from "node:path";
const root=process.cwd();
const server=await createServer({root,cacheDir:path.join(root,".vite-cache"),logLevel:"error",server:{host:"127.0.0.1",port:43123,strictPort:true},appType:"spa"});
await server.listen();
const browser=await chromium.launch({executablePath:"/usr/bin/google-chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]});
const results=[];
try{
 for(const mode of ["baseline","fixed"]){
  const page=await browser.newPage({viewport:{width:1100,height:820},deviceScaleFactor:1});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:43123/?mode="+mode);
  await page.getByRole("button",{name:"More actions"}).click();
  await page.getByRole("menuitem",{name:"Remove"}).waitFor();
  const during=await page.evaluate(()=>document.body.style.pointerEvents);
  await page.screenshot({path:path.join(root,"evidence",mode+"-menu.png")});
  await page.getByRole("menuitem",{name:"Remove"}).click();
  await page.getByRole("alertdialog").waitFor();
  await page.getByRole("button",{name:"Remove skill"}).click();
  await page.getByTestId("removed").waitFor();
  await page.getByRole("alertdialog").waitFor({state:"detached"});
  const after=await page.evaluate(()=>document.body.style.pointerEvents);
  await page.getByRole("button",{name:"Other Settings control"}).click({timeout:5000});
  const interacted=await page.getByTestId("clicked").innerText();
  await page.screenshot({path:path.join(root,"evidence",mode+"-after-removal.png")});
  results.push({mode,pointerEventsMenu:during,pointerEventsAfterDeletion:after,otherSettingsControl:interacted,errors});
  await page.close();
 }
 writeFileSync(path.join(root,"evidence","result.json"),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length||r.otherSettingsControl!=="Clicked"))process.exitCode=1;
 if(results.find(r=>r.mode==="fixed")?.pointerEventsMenu==="none")process.exitCode=1;
} finally{await browser.close();await server.close();}
