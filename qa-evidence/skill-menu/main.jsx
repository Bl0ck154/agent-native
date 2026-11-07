import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "./style.css";

const mode = new URLSearchParams(location.search).get("mode") || "fixed";
function RowMenuTrigger({children}) {
  return <DropdownMenu.Root modal={mode !== "fixed"}>
    <DropdownMenu.Trigger asChild><button type="button" aria-label="More actions" className="more">⋯</button></DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content className="menu" align="end" sideOffset={4}>{children}</DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>;
}
function App(){
 const [open,setOpen]=useState(false);
 const [removed,setRemoved]=useState(false);
 const [pending,setPending]=useState(false);
 const [clicked,setClicked]=useState(false);
 const remove=async()=>{setPending(true);setRemoved(true);await new Promise(r=>setTimeout(r,200));setOpen(false);setPending(false);};
 return <main>
 <h1>Settings</h1><nav>Account　 Agent　 Organization</nav>
 <h2>Personal Skills</h2>
 <section><p className="desc">Manage skills in your personal workspace</p>
 {!removed?<div className="skill"><div><strong>Sample Personal Skill</strong><small>resources/skills/sample/SKILL.md</small></div>
 <RowMenuTrigger><DropdownMenu.Item className="item" onSelect={()=>setOpen(true)}>Remove</DropdownMenu.Item></RowMenuTrigger></div>:
 <p data-testid="removed">No personal skills</p>}
 </section>
 <button type="button" className="settings-control" onClick={()=>setClicked(true)}>Other Settings control</button>
 <span data-testid="clicked">{clicked?"Clicked":"Not clicked"}</span>
 <AlertDialog.Root open={open} onOpenChange={setOpen}>
 <AlertDialog.Portal><AlertDialog.Overlay className="overlay"/><AlertDialog.Content className="dialog">
 <AlertDialog.Title>Remove "Sample Personal Skill"?</AlertDialog.Title>
 <AlertDialog.Description>This removes the selected skill.</AlertDialog.Description>
 <div className="actions"><AlertDialog.Cancel asChild><button>Cancel</button></AlertDialog.Cancel>
 <button type="button" onClick={()=>void remove()} disabled={pending}> {pending?"Removing…":"Remove skill"} </button></div>
 </AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root>
 <footer>Isolated Radix component reproduction — not a deployed Agent-Native application</footer>
 </main>
}
createRoot(document.getElementById("root")).render(<App/>);
